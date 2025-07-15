from services.models_services.keyword_service import extract_keywords

def get_keywords(text: str, top_n: int = 5) -> dict:
    return extract_keywords(text, top_n=top_n)
