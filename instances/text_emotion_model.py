from transformers import pipeline

text_emotion_model = pipeline(
    "text-classification",
    model="SamLowe/roberta-base-go_emotions",
    top_k=None,
    return_all_scores=True
)