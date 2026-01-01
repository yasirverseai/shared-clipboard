from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# Card schemas
class CardBase(BaseModel):
    content: str
    user_name: Optional[str] = None


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    content: str


class CardResponse(CardBase):
    id: int
    clipboard_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Clipboard schemas
class ClipboardResponse(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime
    cards: List[CardResponse] = []

    class Config:
        from_attributes = True


class ClipboardIDResponse(BaseModel):
    id: str
