"""
MindSprint AI - Authentication & Security Utilities
Password hashing (PBKDF2-HMAC-SHA256 & bcrypt fallback) and JWT Bearer token lifecycle.
"""

import os
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

try:
    from backend.app.database import get_db
    from backend.app import models
except ImportError:
    from app.database import get_db
    from app import models

# ==========================================
# Configuration
# ==========================================

SECRET_KEY = os.getenv("JWT_SECRET", "mindsprint_ai_super_secret_jwt_key_2026_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/Auth/login", auto_error=False)


# ==========================================
# Password Hashing & Verification
# ==========================================

# Check if passlib / bcrypt is available
_pwd_context = None
try:
    from passlib.context import CryptContext
    _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    _pwd_context = None


def _hash_pbkdf2(password: str) -> str:
    """Zero-dependency PBKDF2-HMAC-SHA256 password hashing."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2:sha256:100000${salt}${key.hex()}"


def _verify_pbkdf2(password: str, hashed: str) -> bool:
    """Verify PBKDF2-HMAC-SHA256 hash."""
    try:
        parts = hashed.split("$")
        if len(parts) != 3:
            return False
        meta, salt, expected_hex = parts
        algo_parts = meta.split(":")
        algo = algo_parts[1]
        iterations = int(algo_parts[2])
        calc = hashlib.pbkdf2_hmac(algo, password.encode("utf-8"), salt.encode("utf-8"), iterations)
        return hmac.compare_digest(calc.hex(), expected_hex)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Hash password using passlib/bcrypt if available, else standard PBKDF2."""
    if _pwd_context is not None:
        try:
            return _pwd_context.hash(password)
        except Exception:
            pass
    return _hash_pbkdf2(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against stored hash."""
    if not hashed_password or not plain_password:
        return False

    if hashed_password.startswith("pbkdf2:"):
        return _verify_pbkdf2(plain_password, hashed_password)

    if _pwd_context is not None:
        try:
            return _pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass

    return _verify_pbkdf2(plain_password, hashed_password)


# ==========================================
# JWT Generation & Parsing
# ==========================================

# Import JWT engine: PyJWT or python-jose
try:
    import jwt as pyjwt
    HAS_PYJWT = True
except ImportError:
    try:
        from jose import jwt as pyjwt
        HAS_PYJWT = False
    except ImportError:
        pyjwt = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create signed HS256 JWT access token."""
    to_encode = data.copy()
    now = datetime.utcnow()
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": now
    })

    if pyjwt is not None:
        token = pyjwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        return token

    # Pure Python HS256 fallback if no external JWT library installed
    import base64
    import json

    header = {"alg": "HS256", "typ": "JWT"}
    # Convert datetime objects to timestamps
    cleaned_payload = {}
    for k, v in to_encode.items():
        if isinstance(v, datetime):
            cleaned_payload[k] = int(v.timestamp())
        else:
            cleaned_payload[k] = v

    def b64_url_encode(raw_bytes: bytes) -> str:
        return base64.urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")

    h_b64 = b64_url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    p_b64 = b64_url_encode(json.dumps(cleaned_payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    sig = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = b64_url_encode(sig)
    return f"{h_b64}.{p_b64}.{sig_b64}"


def decode_access_token(token: str) -> dict:
    """Decode and validate JWT access token."""
    if pyjwt is not None:
        try:
            # Handles PyJWT and python-jose
            payload = pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except Exception as e:
            err_name = type(e).__name__
            if "ExpiredSignature" in err_name:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Signature has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # Pure Python decoder fallback
    import base64
    import json
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Malformed token")
        h_b64, p_b64, sig_b64 = parts

        def b64_url_decode(s: str) -> bytes:
            padding = "=" * ((4 - len(s) % 4) % 4)
            return base64.urlsafe_b64decode(s + padding)

        signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = b64_url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            raise ValueError("Invalid signature")

        payload_bytes = b64_url_decode(p_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))

        # Verify expiration
        exp = payload.get("exp")
        if exp is not None:
            now_ts = int(datetime.utcnow().timestamp())
            if now_ts > exp:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Signature has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        return payload
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    token_from_scheme: Optional[str] = Depends(oauth2_scheme),
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Extracts current authenticated User from JWT token.
    Supports both OAuth2PasswordBearer and raw Authorization: Bearer <token> headers.
    """
    token = token_from_scheme
    if not token and authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    username = payload.get("username")

    user = None
    if user_id:
        try:
            uid_int = int(user_id)
            user = db.query(models.User).filter(models.User.id == uid_int).first()
        except ValueError:
            user = db.query(models.User).filter(models.User.username == str(user_id)).first()

    if not user and username:
        user = db.query(models.User).filter(models.User.username == username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
