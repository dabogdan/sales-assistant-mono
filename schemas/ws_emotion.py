from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Literal
from datetime import datetime


class IncomingWebSocketPayload(BaseModel):
    audio: Optional[str] = Field(default=None, description="Base64-encoded audio chunk")
    timestamp: Optional[int] = Field(default=None, description="Unix timestamp from frontend")
    keywords_map: Optional[Dict[str, List[str]]] = Field(
        default=None,
        description="Mapping of domains to keyword lists, e.g., {\"domain_name\": [\"keyword1\", \"keyword2\"]}"
    )
    domain_response_map: Optional[Dict[str, str]] = Field(
        default=None,
        description="Mapping of domains to desired responses, e.g., {\"domain_name\": \"response text\"}"
    )
    business_name: Optional[str] = Field(default=None, description="Optional business name to provide context")

    @field_validator("timestamp")
    @classmethod
    def timestamp_valid(cls, v):
        if v is not None and v < 0:
            raise ValueError("timestamp must be a positive integer")
        return v

    @field_validator("keywords_map", mode="before")
    @classmethod
    def clean_keywords_map(cls, v):
        if v:
            return {
                k.strip(): [kw.strip() for kw in vlist if kw.strip()]
                for k, vlist in v.items() if k.strip()
            }
        return v

    @field_validator("domain_response_map", mode="before")
    @classmethod
    def clean_domain_response_map(cls, v):
        if v:
            return {
                k.strip(): vstr.strip()
                for k, vstr in v.items() if k.strip() and vstr.strip()
            }
        return v
    
    @field_validator("business_name")
    @classmethod
    def clean_business_name(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class EmotionScore(BaseModel):
    label: str = Field(..., description="Detected emotion label (e.g., 'Joy')")
    score: float = Field(..., ge=0, le=100, description="Confidence score (0–100)")

    @field_validator("label")
    @classmethod
    def label_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("label must be a non-empty string")
        return v


class BaseWebSocketEvent(BaseModel):
    type: str = Field(..., description="Event type identifier")


class AudioEmotionEvent(BaseWebSocketEvent):
    type: Literal["audio_emotion"] = "audio_emotion"
    audio_emotion: EmotionScore


class TranscriptEvent(BaseWebSocketEvent):
    type: Literal["transcript"] = "transcript"
    transcript: str


class TextEmotionsEvent(BaseWebSocketEvent):
    type: Literal["text_emotions"] = "text_emotions"
    text_emotions: List[EmotionScore]


class KeywordsEvent(BaseWebSocketEvent):
    type: Literal["keywords"] = "keywords"
    keywords: List[str]


class ClassificationEvent(BaseWebSocketEvent):
    type: Literal["classification"] = "classification"
    domain: str
    desired_response: str


class FinalResponseEvent(BaseWebSocketEvent):
    type: Literal["final_response"] = "final_response"
    emotionally_aware_response: str
