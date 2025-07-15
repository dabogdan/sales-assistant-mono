from services.models_services.zero_shot_service import classify_domain_zero_shot

def classify_domain(
    keywords: list[str], 
    user_keywords_map: dict[str, list[str]], 
    user_domain_map: dict[str, str], 
    text_input: str
) -> dict:
    return classify_domain_zero_shot(keywords, user_keywords_map, user_domain_map, text_input)
