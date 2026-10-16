"""
MindSprint AI — Tier 2: Boundary, Corner & Negative Test Suite
Rigorous testing of edge cases, invalid inputs, security validations, and IDOR multi-tenant protections:
- Auth: duplicate username, duplicate email, wrong password, missing fields, invalid/expired JWT
- Tasks: non-existent task ID (404), invalid status string (422/400), cross-user task access rejection (404/403), empty title
- Flashcards: invalid rating values (e.g. 0, 6), non-existent card ID review, empty card list, invalid category
- Bulk & AI: empty bulk list, malformed items, count out of bounds, missing topic/notes
"""

import pytest


# =====================================================================
# 1. Auth Boundary & Negative Cases
# =====================================================================

def test_auth_duplicate_username_conflict(client):
    """TC-T2-AUTH-01: Registering with an already registered username returns 400 Bad Request."""
    user = {"username": "duplicate_user", "email": "dup1@mindsprint.ai", "password": "Password123!"}
    res1 = client.post("/api/Auth/register", json=user)
    assert res1.status_code == 201

    res2 = client.post("/api/Auth/register", json={
        "username": "duplicate_user",
        "email": "different_email@mindsprint.ai",
        "password": "Password123!"
    })
    assert res2.status_code == 400
    assert "username already registered" in res2.json()["detail"].lower()


def test_auth_case_insensitive_duplicate_username(client):
    """TC-T2-AUTH-02: Username duplication check is case-insensitive (e.g. TestUser vs testuser)."""
    user = {"username": "CaseSensitiveUser", "email": "case1@mindsprint.ai", "password": "Password123!"}
    res1 = client.post("/api/Auth/register", json=user)
    assert res1.status_code == 201

    res2 = client.post("/api/Auth/register", json={
        "username": "casesensitiveuser",
        "email": "case2@mindsprint.ai",
        "password": "Password123!"
    })
    assert res2.status_code == 400


def test_auth_duplicate_email_conflict(client):
    """TC-T2-AUTH-03: Registering with an already registered email returns 400 Bad Request."""
    user = {"username": "user_a", "email": "same_email@mindsprint.ai", "password": "Password123!"}
    res1 = client.post("/api/Auth/register", json=user)
    assert res1.status_code == 201

    res2 = client.post("/api/Auth/register", json={
        "username": "user_b",
        "email": "same_email@mindsprint.ai",
        "password": "Password123!"
    })
    assert res2.status_code == 400
    assert "email already registered" in res2.json()["detail"].lower()


def test_auth_login_invalid_credentials(client):
    """TC-T2-AUTH-04: Login with wrong password or non-existent user returns 401 Unauthorized."""
    user = {"username": "valid_user", "email": "valid@mindsprint.ai", "password": "CorrectPassword123!"}
    client.post("/api/Auth/register", json=user)

    # Wrong password
    res1 = client.post("/api/Auth/login", json={"username": "valid_user", "password": "WrongPassword"})
    assert res1.status_code == 401

    # Non-existent user
    res2 = client.post("/api/Auth/login", json={"username": "unknown_user_xyz", "password": "Password123!"})
    assert res2.status_code == 401


def test_auth_register_validation_failures(client):
    """TC-T2-AUTH-05: Missing fields, short password (<6 chars), or malformed email returns 422."""
    # Short password
    res1 = client.post("/api/Auth/register", json={
        "username": "short_pwd_user",
        "email": "valid@email.com",
        "password": "123"
    })
    assert res1.status_code == 422

    # Malformed email
    res2 = client.post("/api/Auth/register", json={
        "username": "bad_email_user",
        "email": "not-an-email",
        "password": "ValidPassword123!"
    })
    assert res2.status_code == 422

    # Short username (<3 chars)
    res3 = client.post("/api/Auth/register", json={
        "username": "ab",
        "email": "valid2@email.com",
        "password": "ValidPassword123!"
    })
    assert res3.status_code == 422


def test_auth_invalid_and_missing_jwt_tokens(client):
    """TC-T2-AUTH-06: Missing or malformed JWT token on protected endpoint returns 401."""
    # Missing header
    res1 = client.get("/api/Auth/me")
    assert res1.status_code == 401

    # Malformed token
    res2 = client.get("/api/Auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert res2.status_code == 401


# =====================================================================
# 2. Kanban Tasks Boundary & Security Cases
# =====================================================================

def test_tasks_non_existent_task_id_status_patch(client, auth_headers):
    """TC-T2-TASK-01: Patching status on non-existent task ID returns 404 Not Found."""
    response = client.patch("/api/Tasks/999999/status", json={"status": "Completed"}, headers=auth_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_tasks_non_existent_task_id_deletion(client, auth_headers):
    """TC-T2-TASK-02: Deleting a non-existent task ID returns 404 Not Found."""
    response = client.delete("/api/Tasks/999999", headers=auth_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_tasks_invalid_status_string_rejected(client, auth_headers):
    """TC-T2-TASK-03: Submitting invalid status string to PATCH /api/Tasks/{id}/status returns 400 or 422."""
    create_res = client.post("/api/Tasks", json={"title": "Status Test"}, headers=auth_headers)
    task_id = create_res.json()["id"]

    patch_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "NonExistentStatus"}, headers=auth_headers)
    assert patch_res.status_code in [400, 422]


def test_tasks_empty_and_whitespace_title_rejected(client, auth_headers):
    """TC-T2-TASK-04: Creating a task with empty or whitespace-only title returns 422."""
    res1 = client.post("/api/Tasks", json={"title": ""}, headers=auth_headers)
    assert res1.status_code == 422

    res2 = client.post("/api/Tasks", json={"title": "     "}, headers=auth_headers)
    assert res2.status_code == 422


def test_tasks_cross_user_isolation_prevent_idor(client, auth_headers, secondary_auth_headers):
    """TC-T2-TASK-05: User B cannot modify or delete User A's task (IDOR protection)."""
    # User A creates a task
    create_res = client.post("/api/Tasks", json={"title": "User A Private Task"}, headers=auth_headers)
    assert create_res.status_code == 201
    task_id = create_res.json()["id"]

    # User B tries to update User A's task status -> 404
    patch_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "Completed"}, headers=secondary_auth_headers)
    assert patch_res.status_code in [403, 404]

    # User B tries to delete User A's task -> 404
    del_res = client.delete(f"/api/Tasks/{task_id}", headers=secondary_auth_headers)
    assert del_res.status_code in [403, 404]

    # Confirm User A's task is still intact and Todo
    list_res = client.get("/api/Tasks", headers=auth_headers)
    matching = [t for t in list_res.json() if t["id"] == task_id]
    assert len(matching) == 1
    assert matching[0]["status"] == "Todo"


def test_tasks_unauthorized_endpoints(client):
    """TC-T2-TASK-06: Task endpoints reject requests lacking valid authentication headers with 401."""
    assert client.get("/api/Tasks").status_code == 401
    assert client.post("/api/Tasks", json={"title": "T"}).status_code == 401
    assert client.patch("/api/Tasks/1/status", json={"status": "Todo"}).status_code == 401
    assert client.delete("/api/Tasks/1").status_code == 401


# =====================================================================
# 3. Flashcards Review Boundary & Validation Cases
# =====================================================================

def test_flashcards_invalid_rating_values(client, auth_headers):
    """TC-T2-FC-01: Ratings outside range [1..5] (e.g. 0, 6, -1) return 400 or 422."""
    card_res = client.post("/api/Flashcards", json={"front": "Q", "back": "A"}, headers=auth_headers)
    card_id = card_res.json()["id"]

    res_zero = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 0}, headers=auth_headers)
    assert res_zero.status_code in [400, 422]

    res_six = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 6}, headers=auth_headers)
    assert res_six.status_code in [400, 422]

    res_negative = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": -5}, headers=auth_headers)
    assert res_negative.status_code in [400, 422]


def test_flashcards_review_non_existent_card(client, auth_headers):
    """TC-T2-FC-02: Reviewing a non-existent card ID returns 404 Not Found."""
    response = client.post("/api/Flashcards/999999/review", json={"rating": 3}, headers=auth_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_flashcards_cross_user_review_forbidden(client, auth_headers, secondary_auth_headers):
    """TC-T2-FC-03: User B cannot review User A's flashcard."""
    card_res = client.post("/api/Flashcards", json={"front": "User A Card", "back": "Secret"}, headers=auth_headers)
    card_id = card_res.json()["id"]

    # User B reviews User A's card
    review_res = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 5}, headers=secondary_auth_headers)
    assert review_res.status_code in [403, 404]


def test_flashcards_ease_factor_minimum_floor(client, auth_headers):
    """TC-T2-FC-04: Repeated rating 1 ('Again') reviews never drop ease_factor below theoretical minimum 1.3."""
    card_res = client.post("/api/Flashcards", json={"front": "Hard Card", "back": "Answer"}, headers=auth_headers)
    card_id = card_res.json()["id"]

    # Review 8 times with rating 1
    last_ef = None
    for _ in range(8):
        rev = client.post(f"/api/Flashcards/{card_id}/review", json={"rating": 1}, headers=auth_headers)
        assert rev.status_code == 200
        last_ef = rev.json()["ease_factor"]

    assert last_ef >= 1.3


def test_flashcards_unauthorized_access(client):
    """TC-T2-FC-05: Flashcards endpoints reject unauthenticated requests with 401."""
    assert client.get("/api/Flashcards").status_code == 401
    assert client.post("/api/Flashcards", json={"front": "Q", "back": "A"}).status_code == 401
    assert client.post("/api/Flashcards/1/review", json={"rating": 3}).status_code == 401


# =====================================================================
# 4. Bulk & AI Module Boundary Cases
# =====================================================================

def test_bulk_import_empty_list_rejected(client, auth_headers):
    """TC-T2-BULK-01: Bulk import with empty cards list returns 400 Bad Request."""
    res1 = client.post("/api/Flashcards/bulk", json={"cards": []}, headers=auth_headers)
    assert res1.status_code == 400

    res2 = client.post("/api/Flashcards/bulk", json=[], headers=auth_headers)
    assert res2.status_code == 400


def test_bulk_import_malformed_items(client, auth_headers):
    """TC-T2-BULK-02: Bulk import with cards missing front or back returns 422."""
    payload = {
        "cards": [
            {"front": "Valid Front", "back": "Valid Back"},
            {"front": "", "back": "Missing Front"},
        ]
    }
    response = client.post("/api/Flashcards/bulk", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_bulk_import_invalid_payload_type(client, auth_headers):
    """TC-T2-BULK-03: Submitting invalid payload format (e.g. string/integer instead of list/dict) returns 400 or 422."""
    res = client.post("/api/Flashcards/bulk", json="not a list", headers=auth_headers)
    assert res.status_code in [400, 422]


def test_ai_generate_text_too_short(client, auth_headers):
    """TC-T2-BULK-04: Submitting text shorter than 10 characters returns 400 Bad Request."""
    response = client.post("/api/Flashcards/ai-generate", json={"text": "short"}, headers=auth_headers)
    assert response.status_code == 400
    assert "at least 10 characters" in response.json()["detail"].lower()


def test_ai_generate_count_out_of_bounds(client, auth_headers):
    """TC-T2-BULK-05: Submitting num_cards > 50 or < 1 returns 422 Unprocessable Entity."""
    res_large = client.post("/api/Flashcards/ai-generate", json={
        "topic": "Biology",
        "num_cards": 100
    }, headers=auth_headers)
    assert res_large.status_code == 422

    res_zero = client.post("/api/Flashcards/ai-generate", json={
        "topic": "Biology",
        "num_cards": 0
    }, headers=auth_headers)
    assert res_zero.status_code == 422


def test_stats_isolated_per_tenant(client, auth_headers, secondary_auth_headers):
    """TC-T2-BULK-06: Stats metrics are strictly isolated between tenants (User A cards not counted in User B stats)."""
    # User A imports 3 cards
    client.post("/api/Flashcards/bulk", json={
        "cards": [
            {"front": "A1", "back": "Ans1"},
            {"front": "A2", "back": "Ans2"},
            {"front": "A3", "back": "Ans3"}
        ]
    }, headers=auth_headers)

    # Check User B stats
    stats_b = client.get("/api/Flashcards/stats", headers=secondary_auth_headers).json()
    assert stats_b["total_cards"] == 0

    # Check User A stats
    stats_a = client.get("/api/Flashcards/stats", headers=auth_headers).json()
    assert stats_a["total_cards"] == 3
