from services.prompts.utils import load_prompt
from services.helpers.llm_helpers import generate_bulleted_list

def suggest_faq_domains(business: str) -> list[str]:
    prompt = load_prompt("suggest_domains", business=business)
    return generate_bulleted_list(prompt)
