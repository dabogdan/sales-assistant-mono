from pydantic import BaseModel, Field, field_validator
from typing import Dict, List

class AutoSuggestRequest(BaseModel):
    business: str = Field(..., description="Business type or product name")

    @field_validator("business")
    @classmethod
    def business_not_empty(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("business must be a non-empty string")
        return cleaned

class AutoSuggestResponseV2(BaseModel):
    suggestions: Dict[str, List[str]] = Field(..., description="Suggested domains with their respective responses")
