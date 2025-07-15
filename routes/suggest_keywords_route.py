from fastapi import APIRouter, HTTPException
from schemas.post_suggest_keywords import KeywordSuggestionRequest, KeywordSuggestionResponse
from services.wrappers.suggest_keywords_wrapper import generate_keywords

router = APIRouter(prefix="/suggest-keywords", tags=["suggest-keywords"])

@router.post("", response_model=KeywordSuggestionResponse)
def suggest_keywords_endpoint(payload: KeywordSuggestionRequest):
    try:
        keywords = generate_keywords(payload.domain, payload.business)
        return KeywordSuggestionResponse(keywords=keywords)
    except Exception as e:
        print("❌ Error generating keyword suggestions:", e)
        raise HTTPException(status_code=500, detail="Failed to generate keyword suggestions.")
