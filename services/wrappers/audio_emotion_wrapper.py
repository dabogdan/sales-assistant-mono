from services.models_services.audio_emotion_service import detect_audio_emotion

def get_audio_emotion(wav_path: str) -> dict:
    return detect_audio_emotion(wav_path)
