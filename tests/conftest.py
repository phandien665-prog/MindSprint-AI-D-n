"""
MindSprint AI - Automated Test Suite Configuration & Central Fixtures
Isolated in-memory SQLite database with StaticPool and FastAPI TestClient dependency overrides.
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure project root and backend are in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
APP_DIR = BACKEND_DIR / "app"

for p in [str(PROJECT_ROOT), str(BACKEND_DIR), str(APP_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app.main import app
    from backend.app.database import Base, get_db
    from backend.app import models
except ImportError:
    try:
        from app.main import app
        from app.database import Base, get_db
        from app import models
    except ImportError:
        from main import app
        from database import Base, get_db
        import models

# In-memory SQLite with StaticPool ensures single connection persists across queries in test thread
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Creates fresh database schema in-memory for each test and drops all tables on teardown.
    Guarantees 100% test isolation and zero state leakage between tests.
    """
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    FastAPI TestClient with get_db dependency overridden to use the in-memory test database.
    """
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def auth_headers(client):
    """
    Registers and logs in a primary test user, returning HTTP Authorization Bearer headers.
    """
    user_payload = {
        "username": "testuser",
        "email": "testuser@mindsprint.ai",
        "password": "Password123!",
        "full_name": "Test User",
    }
    client.post("/api/Auth/register", json=user_payload)
    login_res = client.post(
        "/api/Auth/login",
        json={"username": user_payload["username"], "password": user_payload["password"]},
    )
    token = login_res.json().get("access_token", "")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def secondary_auth_headers(client):
    """
    Registers and logs in a secondary test user for multi-tenant isolation verification.
    """
    user_payload = {
        "username": "otheruser",
        "email": "otheruser@mindsprint.ai",
        "password": "Password456!",
        "full_name": "Other User",
    }
    client.post("/api/Auth/register", json=user_payload)
    login_res = client.post(
        "/api/Auth/login",
        json={"username": user_payload["username"], "password": user_payload["password"]},
    )
    token = login_res.json().get("access_token", "")
    return {"Authorization": f"Bearer {token}"}
