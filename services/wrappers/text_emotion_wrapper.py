from services.models_services.text_emotion_service import detect_text_emotions

def get_text_emotions(text: str, top_k: int = 3) -> dict:
    return detect_text_emotions(text, top_k=top_k)
