import time
import uuid
import json
import base64
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.helpers.audio_processing import write_temp_audio_files, cleanup_temp_audio_files, get_wav_duration, trim_wav

from services.wrappers.audio_emotion_wrapper import get_audio_emotion
from services.wrappers.asr_wrapper import get_transcript
from services.wrappers.text_emotion_wrapper import get_text_emotions
from services.wrappers.keyword_extraction_wrapper import get_keywords
from services.wrappers.zero_shot_wrapper import classify_domain
from services.wrappers.llm_wrapper import generate_final_response

from schemas.ws_emotion import (
    IncomingWebSocketPayload,
    EmotionScore,
    AudioEmotionEvent,
    TranscriptEvent,
    TextEmotionsEvent,
    KeywordsEvent,
    ClassificationEvent,
    FinalResponseEvent
)

router = APIRouter()

@router.websocket("/ws/summary")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    temp_id = str(uuid.uuid4())
    audio_data = bytearray()
    last_sent = time.time()
    transcript_buffer: list[str] = []
    final_transcript_text = ""
    session_keywords_map: dict[str, list[str]] = {}
    session_domain_map: dict[str, str] = {}
    business_name: Optional[str] = None
    last_audio_duration_sec = 0 

    print("🔔 WebSocket connection started")

    try:
        while True:
            try:
                message = await websocket.receive()
                if message["type"] == "websocket.disconnect":
                    break
            except WebSocketDisconnect:
                print("🔌 WebSocketDisconnect caught — breaking loop")
                break
            except Exception as e:
                print("❌ Error during receive:", e)
                break

            if "text" in message:
                if message["text"] == "end":
                    print("🛑 Received end signal")
                    break

                try:
                    payload = IncomingWebSocketPayload(**json.loads(message["text"]))

                    if payload.audio:
                        audio_chunk = base64.b64decode(payload.audio)
                        audio_data.extend(audio_chunk)

                    if payload.keywords_map:
                        session_keywords_map = payload.keywords_map

                    if payload.domain_response_map:
                        session_domain_map = payload.domain_response_map

                    if time.time() - last_sent >= 5:
                        wav_path = write_temp_audio_files(audio_data, temp_id)

                        current_duration = get_wav_duration(wav_path)

                        new_duration = current_duration - last_audio_duration_sec
                        if new_duration <= 0:
                            new_duration = 5

                        trimmed_wav = f"trimmed_{temp_id}.wav"
                        trim_wav(wav_path, trimmed_wav, last_audio_duration_sec, new_duration)

                        transcript = get_transcript(trimmed_wav)
                        if transcript:
                            transcript_buffer.append(transcript)
                            latest_transcript = " ".join(transcript_buffer)
                            print("📝 Recognized text:", transcript)

                            await websocket.send_json(TranscriptEvent(
                                transcript=latest_transcript
                            ).model_dump())

                        audio_emotion_label, audio_emotion_score = get_audio_emotion(trimmed_wav)
                        if audio_emotion_label:
                            print("📌 Audio Emotion:", audio_emotion_label)

                            await websocket.send_json(AudioEmotionEvent(
                                audio_emotion=EmotionScore(
                                    label=audio_emotion_label,
                                    score=audio_emotion_score
                                )
                            ).model_dump())
                        
                        last_audio_duration_sec = current_duration
                        cleanup_temp_audio_files(temp_id)

                        text_emotion_top3 = []
                        if transcript_buffer:
                            text_input = " ".join(transcript_buffer[-5:])
                            text_emotion_top3 = get_text_emotions(text_input)

                        if text_emotion_top3:
                            print("📌 Text Emotions:", text_emotion_top3)

                            await websocket.send_json(TextEmotionsEvent(
                                text_emotions=[EmotionScore(label=e["label"],
                                score=e["score"]) for e in text_emotion_top3]
                            ).model_dump())

                        keywords: list[str] = []
                        if transcript_buffer:
                            keywords = get_keywords(text_input)
                            print(f"📌 Extracted keywords: {keywords}")

                        if keywords:
                            await websocket.send_json(KeywordsEvent(
                                keywords=keywords
                            ).model_dump())

                        # ⛔ Check if domain_response_map is empty
                        if not session_domain_map:
                            await websocket.send_json(FinalResponseEvent(
                                emotionally_aware_response="Please enter concerns in settings so I can help you"
                            ).model_dump())
                            last_sent = time.time()
                            continue

                        # ✅ Otherwise, try to classify domain
                        domain_classification: dict = {}
                        if transcript_buffer:
                            domain_classification = classify_domain(
                                keywords,
                                session_keywords_map or {},
                                session_domain_map,
                                text_input
                            )
                            print(f"📌 Classified domain: {domain_classification['domain']}")
                            print(f"📌 Desired response: {domain_classification['desired_response']}")

                         # ⛔ Check if concern was not found
                        if domain_classification["domain"] == "unknown":
                            await websocket.send_json(FinalResponseEvent(
                                emotionally_aware_response="Not among your concerns, consider adding more so I can help better"
                            ).model_dump())
                            last_sent = time.time()
                            continue

                         # ✅ Valid domain — now generate response
                        if domain_classification:
                            await websocket.send_json(ClassificationEvent(
                                domain=domain_classification["domain"],
                                desired_response=domain_classification["desired_response"]
                            ).model_dump())

                        final_response = ""
                        if transcript_buffer:
                            final_response = generate_final_response(
                                text_emotion_top3=text_emotion_top3,
                                desired_response=domain_classification["desired_response"],
                            )
                        
                        if final_response:
                            await websocket.send_json(FinalResponseEvent(
                                emotionally_aware_response=final_response
                            ).model_dump())

                        # await websocket.send_json(response_payload.model_dump())
                        last_sent = time.time()

                except json.JSONDecodeError:
                    print("❌ Invalid JSON received")

    except Exception as e:
        print("❌ Outer exception in WebSocket loop:", str(e))
    finally:
        final_transcript_text = " ".join(transcript_buffer).strip()
        print("📄 Final transcript text:", final_transcript_text)

        try:
            cleanup_temp_audio_files(temp_id)
        except Exception as e:
            print(f"❌ Final cleanup failed for {temp_id}: {e}")
            
        print("🧹 WebSocket connection closed")
