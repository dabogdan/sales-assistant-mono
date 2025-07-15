from services.prompts.utils import load_prompt
from services.helpers.llm_helpers import generate_text_streaming_with_progress

def stream_faq_suggestions(business: str):
    prompt = load_prompt("suggest_domains_and_replies", business=business)
    return generate_text_streaming_with_progress(prompt)
