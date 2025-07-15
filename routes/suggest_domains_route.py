from fastapi import APIRouter, HTTPException
from schemas.post_suggest_domains import DomainSuggestionRequest, DomainSuggestionResponse
from services.wrappers.suggest_domains_wrapper import suggest_faq_domains

router = APIRouter(prefix="/suggest-domains", tags=["suggest-domains"])

@router.post("", response_model=DomainSuggestionResponse)
async def suggest_domains_endpoint(payload: DomainSuggestionRequest):
    try:
        domains = suggest_faq_domains(payload.business)
        return DomainSuggestionResponse(domains=domains)
    except Exception as e:
        print("❌ Error generating FAQ domains:", e)
        raise HTTPException(status_code=500, detail="Failed to generate FAQ domain suggestions.")
