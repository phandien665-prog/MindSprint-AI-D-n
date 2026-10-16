"""
MindSprint AI - Flashcards Review Router
Author: Hung Vu
Implements Flashcards retrieval, single card management, and SuperMemo SM-2 Spaced Repetition engine.
"""

import math
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

try:
    from backend.app.database import get_db
    from backend.app import models, schemas
    from backend.app.auth_utils import get_current_user
except ImportError:
    from app.database import get_db
    from app import models, schemas
    from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/Flashcards", tags=["Flashcards Review (Hung Vu)"])


@router.get("", response_model=List[schemas.FlashcardOut])
@router.get("/", response_model=List[schemas.FlashcardOut], include_in_schema=False)
def list_flashcards(
    category: Optional[str] = Query(None, description="Filter flashcards by category"),
    due_only: Optional[bool] = Query(False, description="Filter only cards due for review"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (Easy, Medium, Hard)"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves flashcards belonging to current user.
    Supports filtering by category, difficulty, and due review status.
    """
    query = db.query(models.Flashcard).filter(models.Flashcard.user_id == current_user.id)

    if category:
        query = query.filter(models.Flashcard.category == category)

    if difficulty:
        query = query.filter(models.Flashcard.difficulty == difficulty)

    if due_only:
        now = datetime.utcnow()
        query = query.filter(models.Flashcard.next_review <= now)

    cards = query.order_by(models.Flashcard.id.asc()).all()
    return cards


@router.post("", response_model=schemas.FlashcardOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.FlashcardOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_flashcard(
    card_in: schemas.FlashcardCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates a single flashcard in the user's study deck.
    """
    front_clean = card_in.front.strip()
    back_clean = card_in.back.strip()
    if not front_clean or not back_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Flashcard front and back cannot be empty"
        )

    new_card = models.Flashcard(
        user_id=current_user.id,
        front=front_clean,
        back=back_clean,
        category=(card_in.category or "General").strip(),
        difficulty=(card_in.difficulty or "Medium").strip(),
        repetitions=0,
        interval=1,
        ease_factor=2.5,
        next_review=datetime.utcnow()
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return new_card


@router.post("/{id}/review", response_model=schemas.ReviewOut)
async def review_flashcard(
    id: int,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits recall quality evaluation for a flashcard and applies the SuperMemo-2 (SM-2) algorithm:
    - Quality rating q in [1..5]:
        1 = Again (complete blackout)
        2 = Hard (incorrect, remembered on sight)
        3 = Good (correct recalled with difficulty)
        4 = Easy (correct with hesitation)
        5 = Mastered (perfect instant recall)
    - Updates repetition count, interval (days), and ease factor.
    - Saves historical trace to review_logs.
    """
    # Parse body flexibly (handles {"rating": 4} or {"difficulty": "Easy"})
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload for review"
        )

    rating = body.get("rating")
    difficulty_val = body.get("difficulty")

    if rating is None and difficulty_val is not None:
        diff_map = {
            "again": 1,
            "hard": 2,
            "good": 3,
            "medium": 3,
            "easy": 4,
            "mastered": 5
        }
        rating = diff_map.get(str(difficulty_val).lower())

    if rating is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5"
        )

    try:
        q = int(rating)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5"
        )

    if q < 1 or q > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5"
        )

    # Locate card owned by current user
    card = db.query(models.Flashcard).filter(
        models.Flashcard.id == id,
        models.Flashcard.user_id == current_user.id
    ).first()

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )

    # ==========================================
    # SuperMemo-2 (SM-2) Algorithm Implementation
    # ==========================================
    prev_interval = card.interval if card.interval is not None else 1
    prev_ef = card.ease_factor if card.ease_factor is not None else 2.5
    reps = card.repetitions if card.repetitions is not None else 0

    # 1. Calculate New Ease Factor
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = prev_ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    # Minimum ease factor floor is 1.3
    if new_ef < 1.3:
        new_ef = 1.3
    new_ef = round(new_ef, 4)

    # 2. Calculate New Repetitions and Interval
    if q < 3:
        # Failure to recall: reset repetitions and schedule review for tomorrow
        new_reps = 0
        new_interval = 1
    else:
        # Successful recall
        if reps == 0:
            new_interval = 1
        elif reps == 1:
            new_interval = 6
        else:
            new_interval = int(math.ceil(prev_interval * new_ef))
        new_reps = reps + 1

    # 3. Determine Updated Difficulty Classification
    if q >= 4:
        new_diff = "Easy"
    elif q == 3:
        new_diff = "Medium"
    else:
        new_diff = "Hard"

    # 4. Compute Next Review Timestamp
    now = datetime.utcnow()
    next_review_dt = now + timedelta(days=new_interval)

    # 5. Persist Flashcard State
    card.repetitions = new_reps
    card.interval = new_interval
    card.ease_factor = new_ef
    card.difficulty = new_diff
    card.next_review = next_review_dt
    card.last_reviewed_at = now
    card.updated_at = now

    # 6. Log Review in review_logs table
    log_entry = models.ReviewLog(
        flashcard_id=card.id,
        user_id=current_user.id,
        rating=q,
        reviewed_at=now,
        previous_interval=prev_interval,
        new_interval=new_interval,
        previous_ease_factor=prev_ef,
        new_ease_factor=new_ef
    )
    db.add(log_entry)

    db.commit()
    db.refresh(card)

    return schemas.ReviewOut(
        id=card.id,
        card_id=card.id,
        rating=q,
        repetitions=card.repetitions,
        interval=card.interval,
        ease_factor=card.ease_factor,
        difficulty=card.difficulty,
        next_review=card.next_review.isoformat(),
        message=f"Review recorded successfully. Next review in {card.interval} days."
    )


@router.delete("/{id}")
def delete_flashcard(
    id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes a flashcard by ID, ensuring user ownership.
    """
    card = db.query(models.Flashcard).filter(
        models.Flashcard.id == id,
        models.Flashcard.user_id == current_user.id
    ).first()

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )

    db.delete(card)
    db.commit()

    return {
        "detail": f"Flashcard {id} deleted successfully",
        "message": f"Flashcard {id} deleted successfully",
        "id": id
    }
