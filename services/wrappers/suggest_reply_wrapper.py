from services.prompts.utils import load_prompt
from services.helpers.llm_helpers import generate_bulleted_list

def suggest_response(domain: str, business: str) -> list[str]:
    prompt = load_prompt("suggest_response", domain=domain, business=business)
    return generate_bulleted_list(prompt)
