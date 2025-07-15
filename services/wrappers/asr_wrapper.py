#services/wrappers/asr_wrapper.py
from services.models_services.asr_service import transcribe_audio

def get_transcript(wav_path: str) -> dict:
    return transcribe_audio(wav_path)
