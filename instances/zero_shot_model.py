from transformers import pipeline

# Load the Zero-Shot Classification pipeline once using BART model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
