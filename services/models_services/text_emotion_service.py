from instances.text_emotion_model import text_emotion_model
from utils.maps import text_emotion_map

def detect_text_emotions(text: str, top_k: int = 3) -> list[dict]:
    try:
        result = text_emotion_model(text, truncation=True)
        if not result or not isinstance(result[0], list):
            return []
        sorted_emotions = sorted(result[0], key=lambda x: x["score"], reverse=True)[:top_k]
        return [
            {
                "label": text_emotion_map.get(item["label"].lower(), "Unknown"),
                "score": round(item["score"] * 100, 1)
            }
            for item in sorted_emotions
        ]
    except Exception as e:
        print("❌ Text emotion detection failed:", e)
        raise
