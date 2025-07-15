from pydantic import BaseModel, Field, field_validator
from typing import List

class SuggestResponseRequest(BaseModel):
    domain: str = Field(..., description="Conversation domain or user query topic")
    business: str = Field(..., description="Business type or product name")

    @field_validator("domain", "business")
    @classmethod
    def fields_not_empty(cls, v: str, field) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError(f"{field.name} must be a non-empty string")
        return cleaned

class SuggestResponseResult(BaseModel):
    suggestions: List[str] = Field(..., description="List of short friendly response suggestions")

    @field_validator("suggestions")
    @classmethod
    def validate_suggestions(cls, v: List[str]) -> List[str]:
        cleaned = [s.strip() for s in v if s.strip()]
        if not cleaned:
            raise ValueError("Suggestions list must contain at least one non-empty string")
        return cleaned
