# auto_suggest_route.py

from fastapi import APIRouter, HTTPException
from schemas.post_auto_suggest import AutoSuggestRequest
from services.wrappers.suggest_bulk_wrapper import stream_domains_with_replies

from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/auto-suggest", tags=["auto-suggest"])

@router.post("/bulk")
async def auto_suggest_stream(payload: AutoSuggestRequest):
    try:
        stream = stream_domains_with_replies(payload.business)
        return StreamingResponse(stream, media_type="text/plain")
    except Exception as e:
        print("❌ Error in auto_suggest_stream:", e)
        raise HTTPException(status_code=500, detail="Auto-suggestion failed.")
