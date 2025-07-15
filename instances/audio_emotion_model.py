from transformers import pipeline

emotion_model = pipeline(
    task="audio-classification",
    model="superb/hubert-large-superb-er",
)