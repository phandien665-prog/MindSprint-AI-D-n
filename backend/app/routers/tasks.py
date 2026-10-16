"""
MindSprint AI - Kanban Tasks Router
Author: Phan Diễn
Handles Kanban task listing, creation, column status transitions (Todo, InProgress, Completed), and deletion.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

try:
    from backend.app.database import get_db
    from backend.app import models, schemas
    from backend.app.auth_utils import get_current_user
except ImportError:
    from app.database import get_db
    from app import models, schemas
    from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/Tasks", tags=["Kanban Tasks (Phan Diễn)"])

VALID_STATUSES = {"Todo", "InProgress", "Completed"}
VALID_PRIORITIES = {"Low", "Medium", "High"}


def parse_datetime(dt_val) -> Optional[datetime]:
    """Helper to convert string/datetime into Python datetime object."""
    if dt_val is None:
        return None
    if isinstance(dt_val, datetime):
        return dt_val
    if isinstance(dt_val, str):
        cleaned = dt_val.strip()
        if not cleaned:
            return None
        # Handle 'Z' suffix
        cleaned = cleaned.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except ValueError:
            for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
                try:
                    return datetime.strptime(cleaned, fmt)
                except ValueError:
                    continue
    return None


@router.get("", response_model=List[schemas.TaskOut])
@router.get("/", response_model=List[schemas.TaskOut], include_in_schema=False)
def list_tasks(
    status: Optional[str] = Query(None, description="Filter by status: Todo, InProgress, Completed"),
    priority: Optional[str] = Query(None, description="Filter by priority: Low, Medium, High"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves all Kanban tasks owned by current user.
    Supports optional status and priority query parameter filters.
    """
    query = db.query(models.Task).filter(models.Task.user_id == current_user.id)

    if status:
        query = query.filter(models.Task.status == status)
    if priority:
        query = query.filter(models.Task.priority == priority)

    tasks = query.order_by(models.Task.id.asc()).all()
    return tasks


@router.post("", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_task(
    task_in: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates a new Kanban task assigned to current user.
    Defaults status to 'Todo' and priority to 'Medium'.
    """
    if task_in.status and task_in.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status: '{task_in.status}'. Allowed values: {sorted(list(VALID_STATUSES))}"
        )

    if task_in.priority and task_in.priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority: '{task_in.priority}'. Allowed values: {sorted(list(VALID_PRIORITIES))}"
        )

    due_dt = parse_datetime(task_in.due_date)

    new_task = models.Task(
        user_id=current_user.id,
        title=task_in.title.strip(),
        description=task_in.description or "",
        status=task_in.status or "Todo",
        priority=task_in.priority or "Medium",
        due_date=due_dt
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.patch("/{id}/status", response_model=schemas.TaskOut)
def update_task_status(
    id: int,
    status_update: schemas.TaskStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the Kanban status of a task (e.g. dragging between Todo, InProgress, Completed).
    Guarantees user data isolation.
    """
    target_status = status_update.status
    if target_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed values: {', '.join(sorted(list(VALID_STATUSES)))}"
        )

    task = db.query(models.Task).filter(
        models.Task.id == id,
        models.Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.status = target_status
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    return task


@router.delete("/{id}")
def delete_task(
    id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes a task by ID. Ensures user can only delete their own tasks.
    """
    task = db.query(models.Task).filter(
        models.Task.id == id,
        models.Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "detail": f"Task {id} deleted successfully",
        "message": f"Task {id} deleted successfully",
        "id": id
    }
