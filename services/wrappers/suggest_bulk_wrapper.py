from services.models_services.auto_suggestion_service import stream_faq_suggestions

def stream_domains_with_replies(business: str):
    return stream_faq_suggestions(business)
