"""
MindSprint AI - SQLAlchemy ORM Models
Defines User, Task, Flashcard, and ReviewLog entities with cascading relationships.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

try:
    from backend.app.database import Base
except ImportError:
    from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="owner", cascade="all, delete-orphan")
    review_logs = relationship("ReviewLog", back_populates="user", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True, default="")
    status = Column(String(20), nullable=False, default="Todo", index=True)  # 'Todo', 'InProgress', 'Completed'
    priority = Column(String(10), nullable=False, default="Medium")          # 'Low', 'Medium', 'High'
    due_date = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to user
    owner = relationship("User", back_populates="tasks")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, default="General")
    difficulty = Column(String(20), nullable=False, default="Medium")  # 'Easy', 'Medium', 'Hard'
    repetitions = Column(Integer, default=0, nullable=False)
    interval = Column(Integer, default=1, nullable=False)              # SM-2 days interval
    ease_factor = Column(Float, default=2.5, nullable=False)           # SM-2 Ease Factor (min 1.3)
    next_review = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    last_reviewed_at = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="flashcards")
    review_logs = relationship("ReviewLog", back_populates="flashcard", cascade="all, delete-orphan")


class ReviewLog(Base):
    __tablename__ = "review_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)                           # 1 (Again) .. 5 (Mastered)
    reviewed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    previous_interval = Column(Integer, nullable=False)
    new_interval = Column(Integer, nullable=False)
    previous_ease_factor = Column(Float, nullable=False)
    new_ease_factor = Column(Float, nullable=False)

    # Relationships
    flashcard = relationship("Flashcard", back_populates="review_logs")
    user = relationship("User", back_populates="review_logs")
