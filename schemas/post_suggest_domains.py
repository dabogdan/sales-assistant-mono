from pydantic import BaseModel, Field, field_validator
from typing import List

class DomainSuggestionRequest(BaseModel):
    business: str = Field(..., description="Business type or product name")

    @field_validator("business")
    @classmethod
    def business_not_empty(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("business must be a non-empty string")
        return cleaned

class DomainSuggestionResponse(BaseModel):
    domains: List[str] = Field(..., description="List of suggested FAQ-style domain topics")

    @field_validator("domains")
    @classmethod
    def validate_domains(cls, v: List[str]) -> List[str]:
        cleaned = [s.strip() for s in v if s.strip()]
        if not cleaned:
            raise ValueError("Domains list must contain at least one non-empty string")
        return cleaned
