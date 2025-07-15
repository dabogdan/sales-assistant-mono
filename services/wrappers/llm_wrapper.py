from services.models_services.llm_service import generate_emotionally_aware_response

def generate_final_response(
    text_emotion_top3: list[dict],
    desired_response: str,
) -> str:
    try:
        return generate_emotionally_aware_response(
            text_emotion_top3=text_emotion_top3,
            desired_response=desired_response,
        )
    except Exception as e:
        print("❌ Emotionally aware response generation failed:", e)
        raise

