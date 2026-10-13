"""
MindSprint AI - Pydantic Request/Response DTO Schemas
Supports Pydantic v1 and v2 with dual ORM mode configuration.
"""

from datetime import datetime
from typing import Optional, List, Dict, Union
import re
from pydantic import BaseModel, Field, validator

# Dual compatibility helper for Pydantic v1 & v2
class BaseSchema(BaseModel):
    model_config = {"from_attributes": True}

    class Config:
        orm_mode = True
        from_attributes = True


# ==========================================
# 1. User & Authentication Schemas
# ==========================================

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: str = Field(..., min_length=5, max_length=100, description="Valid email address")
    password: str = Field(..., min_length=6, max_length=100, description="Plaintext password (min 6 chars)")
    full_name: Optional[str] = Field(None, max_length=100, description="User full display name")

    @validator("username")
    def validate_username(cls, v: str) -> str:
        v_stripped = v.strip()
        if len(v_stripped) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if not re.match(r"^[\w\.\-]+$", v_stripped):
            raise ValueError("Username can only contain letters, numbers, underscores, dashes, and periods")
        return v_stripped

    @validator("email")
    def validate_email(cls, v: str) -> str:
        v_stripped = v.strip()
        email_pattern = r"^[\w\.\+\-]+@[\w\-]+(\.[\w\-]+)+$"
        if not re.match(email_pattern, v_stripped):
            raise ValueError("Invalid email format")
        return v_stripped.lower()

    @validator("password")
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v


class UserLogin(BaseModel):
    username: str = Field(..., min_length=1, description="Username or Email")
    password: str = Field(..., min_length=1, description="Account password")


class UserOut(BaseSchema):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None


class Token(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = 86400
    user: Optional[UserOut] = None


# ==========================================
# 2. Kanban Tasks Schemas
# ==========================================

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field("", description="Detailed task description")
    status: Optional[str] = Field("Todo", description="Kanban status: Todo, InProgress, Completed")
    priority: Optional[str] = Field("Medium", description="Priority level: Low, Medium, High")
    due_date: Optional[Union[datetime, str]] = Field(None, description="ISO datetime for due date")

    @validator("title")
    def validate_title(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Title cannot be empty or whitespace only")
        return v_stripped

    @validator("status")
    def validate_status(cls, v: Optional[str]) -> str:
        if v is None:
            return "Todo"
        allowed = {"Todo", "InProgress", "Completed"}
        if v not in allowed:
            raise ValueError(f"Invalid status: '{v}'. Must be one of {allowed}")
        return v

    @validator("priority")
    def validate_priority(cls, v: Optional[str]) -> str:
        if v is None:
            return "Medium"
        allowed = {"Low", "Medium", "High"}
        if v not in allowed:
            raise ValueError(f"Invalid priority: '{v}'. Must be one of {allowed}")
        return v


class TaskStatusUpdate(BaseModel):
    status: str = Field(..., description="Target status: Todo, InProgress, or Completed")

    @validator("status")
    def validate_status(cls, v: str) -> str:
        allowed = {"Todo", "InProgress", "Completed"}
        if v not in allowed:
            raise ValueError(f"Invalid status: '{v}'. Must be one of {allowed}")
        return v


class TaskOut(BaseSchema):
    id: int
    user_id: int
    title: str
    description: Optional[str] = ""
    status: str
    priority: str
    due_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class TaskDeleteOut(BaseSchema):
    message: str
    id: int


# ==========================================
# 3. Flashcards & SM-2 Review Schemas
# ==========================================

class FlashcardItemIn(BaseModel):
    front: str = Field(..., min_length=1, description="Question or prompt on card front")
    back: str = Field(..., min_length=1, description="Answer or concept on card back")
    category: Optional[str] = Field("General", description="Subject or topic category")
    difficulty: Optional[str] = Field("Medium", description="Initial difficulty: Easy, Medium, Hard")

    @validator("front", "back")
    def validate_not_blank(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Card front and back cannot be blank")
        return v_stripped


class FlashcardCreate(FlashcardItemIn):
    pass


class FlashcardReview(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5, description="SM-2 recall rating 1 (Again) to 5 (Mastered)")
    difficulty: Optional[str] = Field(None, description="UI difficulty string: Again, Hard, Good, Easy, Mastered")

    @validator("rating", always=True)
    def validate_rating_or_diff(cls, v, values):
        diff = values.get("difficulty")
        if v is not None:
            if v < 1 or v > 5:
                raise ValueError("Rating must be an integer between 1 and 5")
            return v
        if diff is not None:
            diff_map = {
                "again": 1,
                "hard": 2,
                "good": 3,
                "medium": 3,
                "easy": 4,
                "mastered": 5
            }
            mapped = diff_map.get(str(diff).lower())
            if mapped:
                return mapped
            raise ValueError(f"Unknown difficulty: '{diff}'")
        raise ValueError("Either 'rating' (1-5) or 'difficulty' is required")


class FlashcardOut(BaseSchema):
    id: int
    user_id: int
    front: str
    back: str
    category: str = "General"
    difficulty: str = "Medium"
    repetitions: int = 0
    interval: int = 1
    ease_factor: float = 2.5
    next_review: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ReviewOut(BaseSchema):
    id: int
    card_id: Optional[int] = None
    rating: int
    repetitions: int
    interval: int
    ease_factor: float
    difficulty: Optional[str] = "Medium"
    next_review: Optional[Union[datetime, str]] = None
    message: Optional[str] = None


# ==========================================
# 4. Bulk Import & AI Generation Schemas
# ==========================================

class BulkFlashcardsIn(BaseModel):
    cards: Optional[List[FlashcardItemIn]] = None
    flashcards: Optional[List[FlashcardItemIn]] = None

    def get_items(self) -> List[FlashcardItemIn]:
        items = self.cards if self.cards is not None else self.flashcards
        if not items:
            raise ValueError("Cards list cannot be empty")
        return items


class BulkFlashcardsOut(BaseSchema):
    imported_count: int
    cards: Optional[List[FlashcardOut]] = None
    flashcards: Optional[List[FlashcardOut]] = None


class FlashcardDraft(BaseModel):
    front: str
    back: str
    category: Optional[str] = "General"


class AIGenerateIn(BaseModel):
    text: Optional[str] = Field(None, description="Input study note text or summary")
    notes: Optional[str] = Field(None, description="Alias for text")
    topic: Optional[str] = Field("AI Generated", description="Topic/category name")
    num_cards: Optional[int] = Field(5, ge=1, le=50, description="Target number of cards")
    count: Optional[int] = Field(None, ge=1, le=50, description="Alias for num_cards")
    save_to_deck: Optional[bool] = Field(False, description="Whether to persist generated cards to database")


class AIGenerateOut(BaseSchema):
    topic: str
    generated_count: int
    saved: bool = False
    cards: Optional[List[FlashcardDraft]] = None
    flashcards: Optional[List[FlashcardDraft]] = None


class FlashcardStatsOut(BaseSchema):
    total_cards: int
    cards_due: int = 0
    due_today: int = 0
    cards_mastered: int = 0
    cards_learning: int = 0
    cards_new: int = 0
    retention_rate: float = 0.0
    total_reviews: int = 0
    streak_days: int = 0
    category_breakdown: Optional[Dict[str, int]] = None
    difficulty_breakdown: Optional[Dict[str, int]] = None
