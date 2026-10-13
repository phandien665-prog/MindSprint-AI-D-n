"""
MindSprint AI — Tier 3: Cross-Feature Integration Test Suite
Evaluates full cross-module workflows, state transitions, and multi-tenant data isolation:
- End-to-end user journey: Register -> Login -> Create Tasks -> Drag/Update Status -> Bulk Import Flashcards -> Review Cycle -> Check Progress Stats -> Complete Tasks
- Multi-tenant isolation test: User A and User B operate concurrently without data leakage
- AI-to-study pipeline: AI generation -> Bulk Ingestion -> Active Review Session -> Retention Stats
"""

import pytest


def test_end_to_end_user_journey(client):
    """
    TC-T3-FLOW-01: Complete student study lifecycle:
    Register -> Login -> Create Kanban Task -> InProgress -> Bulk Import Flashcards ->
    SM-2 Reviews -> Check Progress Analytics -> Mark Task Completed -> Clean Up
    """
    # 1. Register
    reg_res = client.post("/api/Auth/register", json={
        "username": "sarah_student",
        "email": "sarah@mindsprint.ai",
        "password": "StudyPassword123!",
        "full_name": "Sarah Connor"
    })
    assert reg_res.status_code == 201

    # 2. Login
    login_res = client.post("/api/Auth/login", json={
        "username": "sarah_student",
        "password": "StudyPassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Verify Identity (/me)
    me_res = client.get("/api/Auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "sarah_student"

    # 4. Create Kanban task
    task_res = client.post("/api/Tasks", json={
        "title": "Prepare for Anatomy Midterm",
        "description": "Master muscular and skeletal system decks",
        "priority": "High"
    }, headers=headers)
    assert task_res.status_code == 201
    task_id = task_res.json()["id"]
    assert task_res.json()["status"] == "Todo"

    # 5. Move task to InProgress
    patch1_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "InProgress"}, headers=headers)
    assert patch1_res.status_code == 200
    assert patch1_res.json()["status"] == "InProgress"

    # 6. Bulk import 5 anatomy flashcards
    bulk_res = client.post("/api/Flashcards/bulk", json={
        "cards": [
            {"front": "How many bones in the adult human body?", "back": "206 bones", "category": "Anatomy"},
            {"front": "What is the longest bone in human body?", "back": "Femur (thigh bone)", "category": "Anatomy"},
            {"front": "Which organ pumps blood throughout the circulatory system?", "back": "Heart", "category": "Anatomy"},
            {"front": "What connective tissue connects muscle to bone?", "back": "Tendon", "category": "Anatomy"},
            {"front": "What is the powerhouse of the cell?", "back": "Mitochondria", "category": "Biology"}
        ]
    }, headers=headers)
    assert bulk_res.status_code == 201
    assert bulk_res.json()["imported_count"] == 5
    card_list = bulk_res.json()["cards"]
    assert len(card_list) == 5

    # 7. Verify cards listed in deck
    deck_res = client.get("/api/Flashcards", headers=headers)
    assert deck_res.status_code == 200
    assert len(deck_res.json()) == 5

    # 8. Review cycle: Card 1 (Easy/5), Card 2 (Good/3), Card 3 (Again/1)
    rev1 = client.post(f"/api/Flashcards/{card_list[0]['id']}/review", json={"rating": 5}, headers=headers)
    assert rev1.status_code == 200
    assert rev1.json()["ease_factor"] >= 2.5

    rev2 = client.post(f"/api/Flashcards/{card_list[1]['id']}/review", json={"rating": 3}, headers=headers)
    assert rev2.status_code == 200

    rev3 = client.post(f"/api/Flashcards/{card_list[2]['id']}/review", json={"rating": 1}, headers=headers)
    assert rev3.status_code == 200
    assert rev3.json()["repetitions"] == 0

    # 9. Verify progress analytics
    stats_res = client.get("/api/Flashcards/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_cards"] == 5
    assert stats["total_reviews"] == 3
    assert stats["retention_rate"] > 0

    # 10. Complete Kanban task
    patch2_res = client.patch(f"/api/Tasks/{task_id}/status", json={"status": "Completed"}, headers=headers)
    assert patch2_res.status_code == 200
    assert patch2_res.json()["status"] == "Completed"

    # 11. Delete completed task
    del_res = client.delete(f"/api/Tasks/{task_id}", headers=headers)
    assert del_res.status_code == 200

    # 12. Verify Kanban board is empty, but Flashcard data remains intact
    tasks_check = client.get("/api/Tasks", headers=headers)
    assert len(tasks_check.json()) == 0

    deck_check = client.get("/api/Flashcards", headers=headers)
    assert len(deck_check.json()) == 5


def test_multi_tenant_isolation_concurrent_workflow(client):
    """
    TC-T3-FLOW-02: Multi-tenant boundary isolation between Student Alpha and Student Beta:
    Ensures zero cross-tenant data leakage across tasks, flashcard decks, reviews, and analytics.
    """
    # 1. Register & login Student Alpha
    client.post("/api/Auth/register", json={"username": "student_alpha", "email": "alpha@mindsprint.ai", "password": "PasswordAlpha1!"})
    login_alpha = client.post("/api/Auth/login", json={"username": "student_alpha", "password": "PasswordAlpha1!"})
    headers_alpha = {"Authorization": f"Bearer {login_alpha.json()['access_token']}"}

    # 2. Register & login Student Beta
    client.post("/api/Auth/register", json={"username": "student_beta", "email": "beta@mindsprint.ai", "password": "PasswordBeta2!"})
    login_beta = client.post("/api/Auth/login", json={"username": "student_beta", "password": "PasswordBeta2!"})
    headers_beta = {"Authorization": f"Bearer {login_beta.json()['access_token']}"}

    # 3. Student Alpha creates 2 tasks and 3 flashcards
    t1_res = client.post("/api/Tasks", json={"title": "Alpha Task 1"}, headers=headers_alpha)
    t2_res = client.post("/api/Tasks", json={"title": "Alpha Task 2"}, headers=headers_alpha)
    alpha_task_1_id = t1_res.json()["id"]

    c_alpha_res = client.post("/api/Flashcards/bulk", json={
        "cards": [
            {"front": "Alpha Q1", "back": "Ans1"},
            {"front": "Alpha Q2", "back": "Ans2"},
            {"front": "Alpha Q3", "back": "Ans3"}
        ]
    }, headers=headers_alpha)
    alpha_card_1_id = c_alpha_res.json()["cards"][0]["id"]

    # 4. Student Beta creates 1 task and 2 flashcards
    client.post("/api/Tasks", json={"title": "Beta Task 1"}, headers=headers_beta)
    client.post("/api/Flashcards/bulk", json={
        "cards": [
            {"front": "Beta Q1", "back": "AnsB1"},
            {"front": "Beta Q2", "back": "AnsB2"}
        ]
    }, headers=headers_beta)

    # 5. Verify isolated counts
    assert len(client.get("/api/Tasks", headers=headers_alpha).json()) == 2
    assert len(client.get("/api/Tasks", headers=headers_beta).json()) == 1

    assert len(client.get("/api/Flashcards", headers=headers_alpha).json()) == 3
    assert len(client.get("/api/Flashcards", headers=headers_beta).json()) == 2

    # 6. Beta attempts unauthorized mutations on Alpha's task -> 404
    assert client.patch(f"/api/Tasks/{alpha_task_1_id}/status", json={"status": "Completed"}, headers=headers_beta).status_code in [403, 404]
    assert client.delete(f"/api/Tasks/{alpha_task_1_id}", headers=headers_beta).status_code in [403, 404]

    # 7. Beta attempts unauthorized review on Alpha's card -> 404
    assert client.post(f"/api/Flashcards/{alpha_card_1_id}/review", json={"rating": 4}, headers=headers_beta).status_code in [403, 404]

    # 8. Alpha reviews own card -> 200
    rev_alpha = client.post(f"/api/Flashcards/{alpha_card_1_id}/review", json={"rating": 4}, headers=headers_alpha)
    assert rev_alpha.status_code == 200

    # 9. Verify analytics isolation
    stats_alpha = client.get("/api/Flashcards/stats", headers=headers_alpha).json()
    stats_beta = client.get("/api/Flashcards/stats", headers=headers_beta).json()
    assert stats_alpha["total_cards"] == 3
    assert stats_alpha["total_reviews"] == 1
    assert stats_beta["total_cards"] == 2
    assert stats_beta["total_reviews"] == 0


def test_ai_generation_to_study_pipeline(client, auth_headers):
    """
    TC-T3-FLOW-03: AI Generation -> Ingestion -> Spaced Repetition Study Pipeline:
    Verifies that AI generated cards can be reviewed and accurately update learning progress stats.
    """
    lecture_notes = (
        "DNS stands for Domain Name System. "
        "TCP provides reliable, ordered, and error-checked delivery of a stream of octets. "
        "UDP is a connectionless communication protocol facilitating low-latency transmissions."
    )

    # 1. AI Generate cards with save_to_deck=true
    gen_res = client.post("/api/Flashcards/ai-generate", json={
        "notes": lecture_notes,
        "topic": "Computer Networks",
        "count": 3,
        "save_to_deck": True
    }, headers=auth_headers)
    assert gen_res.status_code == 200
    assert gen_res.json()["saved"] is True

    # 2. Retrieve the generated cards
    deck_res = client.get("/api/Flashcards?category=Computer Networks", headers=auth_headers)
    assert deck_res.status_code == 200
    cards = deck_res.json()
    assert len(cards) >= 1

    # 3. Complete review for each card
    for c in cards:
        r_res = client.post(f"/api/Flashcards/{c['id']}/review", json={"rating": 4}, headers=auth_headers)
        assert r_res.status_code == 200

    # 4. Check stats report
    stats_res = client.get("/api/Flashcards/stats", headers=auth_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_reviews"] >= len(cards)
    assert stats["retention_rate"] == 100.0
