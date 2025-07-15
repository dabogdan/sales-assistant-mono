from services.prompts.utils import load_prompt
from services.helpers.llm_helpers import generate_bulleted_list

def generate_keywords(domain: str, business: str) -> list[str]:
    prompt = load_prompt("suggest_keywords", domain=domain, business=business)
    return generate_bulleted_list(prompt, stop=["\n\n", "</s>"], max_tokens=150)
