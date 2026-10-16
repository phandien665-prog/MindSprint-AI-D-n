"""
MindSprint AI — Tier 4: Real-World Workload Scenarios Test Suite
Simulates realistic student learning sessions and sprint workloads:
- Scenario 1: Finals Week Exam Sprint (multi-subject Kanban goals, AI synthesis from lecture notes, SM-2 study session, status updates, progress analytics)
- Scenario 2: High-Density Flashcard Bulk Ingestion and Rapid Review Session (multi-category medical terminology, spaced repetition scheduling verification)
"""

import pytest


def test_finals_week_exam_sprint_workload(client):
    """
    TC-T4-SCENARIO-01: Realistic Finals Week Study Session.
    A university student manages dual courses ('Data Structures' & 'World History'):
    1. Sets up study goals in Kanban.
    2. Transitions active study goals to InProgress.
    3. Synthesizes flashcards from lecture notes via AI.
    4. Bulk imports historical timeline flashcards.
    5. Completes a rigorous spaced repetition review session.
    6. Verifies SM-2 algorithm intervals and retention statistics.
    7. Marks study milestone as Completed in Kanban.
    """
    # 1. Register & authenticate student
    reg_res = client.post("/api/Auth/register", json={
        "username": "alex_student",
        "email": "alex@university.edu",
        "password": "FinalsSprint2026!",
        "full_name": "Alex Mercer"
    })
    assert reg_res.status_code == 201

    login_res = client.post("/api/Auth/login", json={
        "username": "alex_student",
        "password": "FinalsSprint2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Setup Kanban Board for Finals Week
    task_bst = client.post("/api/Tasks", json={
        "title": "Master Binary Search Trees & AVL",
        "description": "Understand rotations, insertion, deletion complexities",
        "priority": "High"
    }, headers=headers).json()

    task_hist = client.post("/api/Tasks", json={
        "title": "Review French Revolution Timeline",
        "description": "Memorize key dates from 1789 to 1799",
        "priority": "Medium"
    }, headers=headers).json()

    assert task_bst["status"] == "Todo"
    assert task_hist["status"] == "Todo"

    # 3. Move BST task to InProgress
    client.patch(f"/api/Tasks/{task_bst['id']}/status", json={"status": "InProgress"}, headers=headers)

    # 4. Generate AI Flashcards from Data Structures Lecture Notes
    cs_notes = (
        "A Binary Search Tree is a rooted binary tree data structure with key ordering property. "
        "In-order traversal of a BST visits nodes in ascending sorted order. "
        "AVL trees are height-balanced binary search trees with logarithmic lookup time."
    )
    ai_gen_res = client.post("/api/Flashcards/ai-generate", json={
        "notes": cs_notes,
        "topic": "Data Structures",
        "count": 3,
        "save_to_deck": True
    }, headers=headers)
    assert ai_gen_res.status_code == 200
    assert ai_gen_res.json()["saved"] is True

    # 5. Bulk import World History Flashcards
    history_cards = [
        {"front": "When did the Storming of the Bastille occur?", "back": "July 14, 1789", "category": "World History"},
        {"front": "What was the Reign of Terror?", "back": "A period of violence led by Maximilien Robespierre (1793-1794)", "category": "World History"},
        {"front": "What event brought Napoleon Bonaparte to power?", "back": "The Coup of 18 Brumaire in November 1799", "category": "World History"}
    ]
    client.post("/api/Flashcards/bulk", json={"cards": history_cards}, headers=headers)

    # 6. Move History task to InProgress
    client.patch(f"/api/Tasks/{task_hist['id']}/status", json={"status": "InProgress"}, headers=headers)

    # 7. Query entire deck
    deck = client.get("/api/Flashcards", headers=headers).json()
    assert len(deck) >= 6

    # 8. Active Spaced Repetition Review Session
    cs_cards = [c for c in deck if c["category"] == "Data Structures"]
    hist_cards = [c for c in deck if c["category"] == "World History"]

    # Review CS Cards: high mastery
    for c in cs_cards:
        rev_res = client.post(f"/api/Flashcards/{c['id']}/review", json={"rating": 4}, headers=headers)
        assert rev_res.status_code == 200
        assert rev_res.json()["difficulty"] == "Easy"

    # Review History Cards: mixed mastery (1 again, 2 good)
    client.post(f"/api/Flashcards/{hist_cards[0]['id']}/review", json={"rating": 1}, headers=headers)
    client.post(f"/api/Flashcards/{hist_cards[1]['id']}/review", json={"rating": 3}, headers=headers)
    client.post(f"/api/Flashcards/{hist_cards[2]['id']}/review", json={"rating": 3}, headers=headers)

    # 9. Verify Scheduling Logic
    updated_deck = client.get("/api/Flashcards", headers=headers).json()
    again_card = next(c for c in updated_deck if c["id"] == hist_cards[0]["id"])
    assert again_card["repetitions"] == 0
    assert again_card["interval"] == 1

    easy_card = next(c for c in updated_deck if c["id"] == cs_cards[0]["id"])
    assert easy_card["repetitions"] == 1
    assert easy_card["interval"] == 1

    # 10. Mark BST task as Completed
    comp_res = client.patch(f"/api/Tasks/{task_bst['id']}/status", json={"status": "Completed"}, headers=headers)
    assert comp_res.json()["status"] == "Completed"

    # 11. Verify Executive Progress Report
    stats = client.get("/api/Flashcards/stats", headers=headers).json()
    assert stats["total_cards"] >= 6
    assert stats["total_reviews"] >= 6
    assert "Data Structures" in stats["category_breakdown"]
    assert "World History" in stats["category_breakdown"]
    assert stats["retention_rate"] > 0


def test_high_density_bulk_and_rapid_review_stress(client, auth_headers):
    """
    TC-T4-SCENARIO-02: High-Density Bulk Ingestion & Rapid Review Session.
    Imports 15 terminology cards across Medical Science categories and conducts rapid reviews.
    """
    # 1. Bulk import 15 flashcards across 3 categories
    bulk_payload = []
    categories = ["Pharmacology", "Pathology", "Physiology"]
    for i in range(15):
        cat = categories[i % 3]
        bulk_payload.append({
            "front": f"Medical Term Question #{i+1} ({cat})",
            "back": f"Definition and clinical application #{i+1}",
            "category": cat
        })

    import_res = client.post("/api/Flashcards/bulk", json={"cards": bulk_payload}, headers=auth_headers)
    assert import_res.status_code == 201
    assert import_res.json()["imported_count"] == 15

    deck = client.get("/api/Flashcards", headers=auth_headers).json()
    assert len(deck) == 15

    # 2. Rapid sequential reviews with varying ratings
    ratings_cycle = [3, 4, 5, 2, 4, 3, 5, 1, 4, 3, 2, 5, 4, 3, 5]
    for idx, card in enumerate(deck):
        rating = ratings_cycle[idx % len(ratings_cycle)]
        rev = client.post(f"/api/Flashcards/{card['id']}/review", json={"rating": rating}, headers=auth_headers)
        assert rev.status_code == 200

    # 3. Check stats consistency
    stats = client.get("/api/Flashcards/stats", headers=auth_headers).json()
    assert stats["total_cards"] == 15
    assert stats["total_reviews"] == 15
    assert stats["category_breakdown"]["Pharmacology"] == 5
    assert stats["category_breakdown"]["Pathology"] == 5
    assert stats["category_breakdown"]["Physiology"] == 5
    # Retention rate reflects reviews with rating >= 3
    expected_success = sum(1 for r in ratings_cycle if r >= 3)
    expected_rate = round((expected_success / 15) * 100.0, 1)
    assert abs(stats["retention_rate"] - expected_rate) < 0.2
