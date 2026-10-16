"""
MindSprint AI — Tier 1: Feature Coverage Test Suite (Happy Path)
Comprehensive coverage for all 9 RESTful endpoints plus AI generation & Stats extensions:
- Auth: register, login (username/email), me, token validity, profile data
- Tasks: get tasks, create task, patch status to InProgress, patch to Completed, delete task
- Flashcards Review: get flashcards, review rating 1 (Again), rating 2 (Hard), rating 3 (Good), rating 4 (Easy) with SM-2 updates
- Bulk & AI: bulk import JSON list, bulk direct array, AI generate from topic, AI generate from notes, stats retrieval
"""

import pytest


# =====================================================================
# 1. Authentication Feature Coverage (Tuấn Linh — auth.py)
# =====================================================================

def test_auth_register_happy_path(client):
    """TC-T1-AUTH-01: Register user with valid credentials returns 201 and sanitized profile."""
    payload = {
        "username": "tuan_linh",
        "email": "tuanlinh@mindsprint.ai",
        "password": "SecurePassword123!",
        "full_name": "Tuấn Linh"
    }
    response = client.post("/api/Auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["username"] == "tuan_linh"
    assert data["email"] == "tuanlinh@mindsprint.ai"
    assert data["full_name"] == "Tuấn Linh"
    assert "password" not in data
    assert "hashed_password" not in data


def test_auth_login_via_username_happy_path(client):
    """TC-T1-AUTH-02: Login with registered username returns 200, access_token, and user object."""
    register_payload = {
        "username": "login_user",
        "email": "login_user@mindsprint.ai",
        "password": "Password123!"
    }
    client.post("/api/Auth/register", json=register_payload)

    login_res = client.post("/api/Auth/login", json={
        "username": "login_user",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["token_type"].lower() == "bearer"
    assert len(data["access_token"]) > 20
    assert "user" in data
    assert data["user"]["username"] == "login_user"


def test_auth_login_via_email_happy_path(client):
    """TC-T1-AUTH-03: Login using registered email in place of username returns 200 and JWT."""
    register_payload = {
        "username": "email_user",
        "email": "email_user@mindsprint.ai",
        "password": "Password123!"
    }
    client.post("/api/Auth/register", json=register_payload)

    login_res = client.post("/api/Auth/login", json={
        "username": "email_user@mindsprint.ai",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["token_type"].lower() == "bearer"


def test_auth_me_happy_path(client, auth_headers):
    """TC-T1-AUTH-04: Retrieve current user profile (/me) with valid Bearer token."""
    response = client.get("/api/Auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@mindsprint.ai"
    assert "id" in data


def test_auth_token_structure_and_persistence(client, auth_headers):
    """TC-T1-AUTH-05: Verify issued JWT token structure and profile persistence across multiple requests."""
    res1 = client.get("/api/Auth/me", headers=auth_headers)
    assert res1.status_code == 200
    user_id = res1.json()["id"]

    # Second request to verify persistent valid authentication
    res2 = client.get("/api/Auth/me", headers=auth_headers)
    assert res2.status_code == 200
    assert res2.json()["id"] == user_id

    # Verify token has standard JWT structure (3 dot-separated base64 parts)
    token = auth_headers["Authorization"].split(" ")[1]
    parts = token.split(".")
    assert len(parts) == 3


# =====================================================================
# 2. Kanban Tasks Feature Coverage (Phan Diễn — tasks.py)
# =====================================================================

def test_tasks_create_task_happy_path(client, auth_headers):
    """TC-T1-TASK-01: Create task with full metadata returns 201 with default status Todo."""
    payload = {
        "title": "Design Database Schema",
        "description": "Create SQLite tables for users, tasks, flashcards",
        "status": "Todo",
        "priority": "High",
        "due_date": "2026-10-01T12:00:00"
    }
    response = client.post("/api/Tasks", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Design Database Schema"
    assert data["status"] == "Todo"
    assert data["priority"] == "High"
    assert "id" in data


def test_tasks_list_tasks_happy_path(client, auth_headers):
    """TC-T1-TASK-02: List Kanban tasks returns all tasks belonging to authenticated user."""
    client.post("/api/Tasks", json={"title": "Task 1", "status": "Todo"}, headers=auth_headers)
    client.post("/api/Tasks", json={"title": "Task 2", "status": "InProgress"}, headers=auth_headers)

    response = client.get("/api/Tasks", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)
    assert len(tasks) >= 2
    titles = [t["title"] for t in tasks]
    assert "Task 1" in titles
    assert "Task 2" in titles


def test_tasks_patch_status_to_inprogress(client, auth_headers):
    """TC-T1-TASK-03: Move task from Todo to InProgress via status PATCH."""
    create_res = client.post("/api/Tasks", json={"title": "Move Me", "status": "Todo"}, headers=auth_headers)
    task_id = create_res.json()["id"]

    patch_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "InProgress"}, headers=auth_headers)
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["id"] == task_id
    assert data["status"] == "InProgress"


def test_tasks_patch_status_to_completed(client, auth_headers):
    """TC-T1-TASK-04: Move task from InProgress to Completed via status PATCH."""
    create_res = client.post("/api/Tasks", json={"title": "Complete Me", "status": "InProgress"}, headers=auth_headers)
    task_id = create_res.json()["id"]

    patch_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "Completed"}, headers=auth_headers)
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["id"] == task_id
    assert data["status"] == "Completed"


def test_tasks_delete_task_happy_path(client, auth_headers):
    """TC-T1-TASK-05: Delete a task by ID returns success and removes task from list."""
    create_res = client.post("/api/Tasks", json={"title": "Delete Me"}, headers=auth_headers)
    task_id = create_res.json()["id"]

    del_res = client.delete(f"/api/Tasks/{task_id}", headers=auth_headers)
    assert del_res.status_code == 200

    list_res = client.get("/api/Tasks", headers=auth_headers)
    remaining_ids = [t["id"] for t in list_res.json()]
    assert task_id not in remaining_ids


# =====================================================================
# 3. Flashcards Review Feature Coverage (Hung Vu — flashcards_review.py)
# =====================================================================

def test_flashcards_get_empty_deck_and_create(client, auth_headers):
    """TC-T1-FC-01: New user has empty deck, can create a flashcard."""
    get_res = client.get("/api/Flashcards", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json() == []

    create_res = client.post("/api/Flashcards", json={
        "front": "What is Python?",
        "back": "A high-level programming language",
        "category": "CS"
    }, headers=auth_headers)
    assert create_res.status_code == 201
    card = create_res.json()
    assert card["front"] == "What is Python?"
    assert card["repetitions"] == 0
    assert card["interval"] == 1


def test_flashcards_review_rating_1_again(client, auth_headers):
    """TC-T1-FC-02: Review card with rating 1 (Again) resets repetitions to 0 and interval to 1."""
    card_res = client.post("/api/Flashcards", json={
        "front": "Forgotten Concept",
        "back": "Needs reset"
    }, headers=auth_headers)
    card_id = card_res.json()["id"]

    review_res = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 1}, headers=auth_headers)
    assert review_res.status_code == 200
    data = review_res.json()
    assert data["repetitions"] == 0
    assert data["interval"] == 1
    assert data["difficulty"] == "Hard"


def test_flashcards_review_rating_2_hard(client, auth_headers):
    """TC-T1-FC-03: Review card with rating 2 (Hard) resets repetitions to 0 and decreases ease factor."""
    card_res = client.post("/api/Flashcards", json={
        "front": "Hard Concept",
        "back": "Barely remembered"
    }, headers=auth_headers)
    card_id = card_res.json()["id"]

    review_res = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 2}, headers=auth_headers)
    assert review_res.status_code == 200
    data = review_res.json()
    assert data["repetitions"] == 0
    assert data["interval"] == 1
    assert data["ease_factor"] < 2.5


def test_flashcards_review_rating_3_good(client, auth_headers):
    """TC-T1-FC-04: Review card with rating 3 (Good) advances repetitions to 1 with interval 1."""
    card_res = client.post("/api/Flashcards", json={
        "front": "Good Concept",
        "back": "Recalled well"
    }, headers=auth_headers)
    card_id = card_res.json()["id"]

    review_res = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 3}, headers=auth_headers)
    assert review_res.status_code == 200
    data = review_res.json()
    assert data["repetitions"] == 1
    assert data["interval"] == 1
    assert data["difficulty"] == "Medium"


def test_flashcards_review_rating_4_easy_sm2_progression(client, auth_headers):
    """TC-T1-FC-05: Review card with rating 4 (Easy) consecutively to verify SM-2 interval progression (1 -> 6 -> 15+)."""
    card_res = client.post("/api/Flashcards", json={
        "front": "Easy Concept",
        "back": "Mastered well"
    }, headers=auth_headers)
    card_id = card_res.json()["id"]

    # 1st review: rep 1 -> interval 1
    r1 = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 4}, headers=auth_headers)
    assert r1.status_code == 200
    assert r1.json()["repetitions"] == 1
    assert r1.json()["interval"] == 1

    # 2nd review: rep 2 -> interval 6
    r2 = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 4}, headers=auth_headers)
    assert r2.status_code == 200
    assert r2.json()["repetitions"] == 2
    assert r2.json()["interval"] == 6

    # 3rd review: rep 3 -> interval = ceil(6 * ease_factor) >= 15
    r3 = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 4}, headers=auth_headers)
    assert r3.status_code == 200
    assert r3.json()["repetitions"] == 3
    assert r3.json()["interval"] >= 15


# =====================================================================
# 4. Flashcards Bulk, AI & Stats Feature Coverage (Phạm Duy - AI — flashcards_bulk.py)
# =====================================================================

def test_bulk_import_json_list(client, auth_headers):
    """TC-T1-BULK-01: Bulk import flashcards via {"cards": [...]} payload returns 201 and imported count."""
    payload = {
        "cards": [
            {"front": "What is REST?", "back": "Representational State Transfer", "category": "Web"},
            {"front": "What is JSON?", "back": "JavaScript Object Notation", "category": "Web"},
            {"front": "What is SQL?", "back": "Structured Query Language", "category": "DB"}
        ]
    }
    response = client.post("/api/Flashcards/bulk", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["imported_count"] == 3
    assert len(data["cards"]) == 3

    # Verify cards are present in list
    list_res = client.get("/api/Flashcards", headers=auth_headers)
    assert len(list_res.json()) >= 3


def test_bulk_import_direct_array(client, auth_headers):
    """TC-T1-BULK-02: Bulk import flashcards using a direct JSON array [...] format."""
    payload = [
        {"front": "Direct Card 1", "back": "Direct Answer 1", "category": "Direct"},
        {"front": "Direct Card 2", "back": "Direct Answer 2", "category": "Direct"}
    ]
    response = client.post("/api/Flashcards/bulk", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["imported_count"] == 2


def test_ai_generate_from_topic(client, auth_headers):
    """TC-T1-BULK-03: AI generate flashcards from topic returns structured Q&A drafts."""
    payload = {
        "topic": "Operating Systems",
        "count": 3
    }
    response = client.post("/api/Flashcards/ai-generate", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Operating Systems"
    assert data["generated_count"] >= 1
    assert len(data["cards"]) >= 1
    for card in data["cards"]:
        assert len(card["front"]) > 0
        assert len(card["back"]) > 0


def test_ai_generate_from_notes_with_save_to_deck(client, auth_headers):
    """TC-T1-BULK-04: AI generate flashcards from lecture notes with save_to_deck=true persists cards directly."""
    notes = (
        "FastAPI is a modern web framework for Python. "
        "SQLAlchemy is an SQL toolkit and Object Relational Mapper. "
        "Pydantic provides data validation using Python type annotations."
    )
    payload = {
        "notes": notes,
        "topic": "Python Frameworks",
        "count": 3,
        "save_to_deck": True
    }
    response = client.post("/api/Flashcards/ai-generate", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["saved"] is True
    assert data["generated_count"] >= 1

    # Verify saved to deck
    list_res = client.get("/api/Flashcards?category=Python Frameworks", headers=auth_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1


def test_flashcards_stats_retrieval(client, auth_headers):
    """TC-T1-BULK-05: Retrieve learning progress analytics report returns comprehensive metrics."""
    # Add a card and review it to produce non-zero stats
    c_res = client.post("/api/Flashcards", json={"front": "Stats Q", "back": "Stats A"}, headers=auth_headers)
    card_id = c_res.json()["id"]
    client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 4}, headers=auth_headers)

    response = client.get("/api/Flashcards/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_cards" in data
    assert data["total_cards"] >= 1
    assert "retention_rate" in data
    assert "total_reviews" in data
    assert data["total_reviews"] >= 1
    assert "cards_learning" in data or "cards_mastered" in data
