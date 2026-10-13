"""
MindSprint AI - Authentication Router
Author: Tuấn Linh
Handles user registration, login with JWT token issuance, and current user profile retrieval.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

try:
    from backend.app.database import get_db
    from backend.app import models, schemas
    from backend.app.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user
except ImportError:
    from app.database import get_db
    from app import models, schemas
    from app.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/Auth", tags=["Authentication (Tuấn Linh)"])


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new user account.
    - Hashes user password
    - Enforces uniqueness on username and email (case-insensitive)
    - Returns sanitized UserOut profile
    """
    # Check duplicate username
    existing_username = db.query(models.User).filter(
        func.lower(models.User.username) == user_in.username.lower()
    ).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check duplicate email
    existing_email = db.query(models.User).filter(
        func.lower(models.User.email) == user_in.email.lower()
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password securely
    hashed_pwd = get_password_hash(user_in.password)

    new_user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=schemas.Token)
async def login(request: Request, db: Session = Depends(get_db)):
    """
    Authenticates user credentials and issues a signed JWT Bearer token.
    Accepts JSON body ({"username": "...", "password": "..."}) or form data.
    """
    username = None
    password = None

    # Handle JSON and Form-Encoded payloads
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("username")
            password = body.get("password")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid JSON payload"
            )
    elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")
    else:
        # Fallback attempt to parse JSON
        try:
            body = await request.json()
            username = body.get("username")
            password = body.get("password")
        except Exception:
            pass

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username and password are required"
        )

    # Allow lookup by username OR email
    username_str = str(username).strip()
    user = db.query(models.User).filter(
        or_(
            func.lower(models.User.username) == username_str.lower(),
            func.lower(models.User.email) == username_str.lower()
        )
    ).first()

    if not user or not verify_password(str(password), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Issue JWT token
    token_payload = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email
    }
    access_token = create_access_token(data=token_payload)

    user_out = schemas.UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at
    )
    return schemas.Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400,
        user=user_out
    )


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Returns current authenticated user profile verified via JWT Bearer header.
    """
    return current_user
