from fastapi import APIRouter, HTTPException
from schemas.post_suggest_reply import SuggestResponseRequest, SuggestResponseResult
from services.wrappers.suggest_reply_wrapper import suggest_response

router = APIRouter(prefix="/generate-suggestions", tags=["generate-suggestions"])

@router.post("", response_model=SuggestResponseResult)
def suggest_reply_endpoint(request: SuggestResponseRequest):
    try:
        suggestions = suggest_response(request.domain, request.business)
        return SuggestResponseResult(suggestions=suggestions)
    except Exception as e:
        print("❌ Error generating suggestions:", e)
        raise HTTPException(status_code=500, detail="Failed to generate suggestions.")
    