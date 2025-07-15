from pydantic import BaseModel, Field, field_validator
from typing import List

class KeywordSuggestionRequest(BaseModel):
    domain: str = Field(..., description="Conversation domain to extract keyword phrases for")
    business: str = Field(..., description="Context or product type related to the domain")

    @field_validator("domain", "business")
    @classmethod
    def fields_not_empty(cls, v: str, field) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError(f"{field.name} must be a non-empty string")
        return cleaned

class KeywordSuggestionResponse(BaseModel):
    keywords: List[str] = Field(..., description="List of 2-word keyword phrases")

    @field_validator("keywords")
    @classmethod
    def validate_keywords(cls, v: List[str]) -> List[str]:
        cleaned = [s.strip() for s in v if s.strip()]
        if not cleaned:
            raise ValueError("Keywords list must contain at least one non-empty string")
        return cleaned
