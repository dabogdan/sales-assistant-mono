from instances.audio_emotion_model import emotion_model
from utils.maps import emotion_map

def detect_audio_emotion(wav_path: str) -> tuple[str, float]:
    try:
        raw_emotion = emotion_model(wav_path, top_k=None)
        scores = raw_emotion[0] if isinstance(raw_emotion[0], list) else raw_emotion
        top = max(scores, key=lambda x: x["score"])
        label = emotion_map.get(top["label"], "Unknown")
        score = round(top["score"] * 100, 1)
        return label, score
    except Exception as e:
        print("❌ Audio emotion detection failed:", e)
        raise
