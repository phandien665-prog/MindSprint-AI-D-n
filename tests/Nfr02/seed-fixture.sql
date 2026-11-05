DO $$
DECLARE
    account_count integer;
    system_card_count integer;
BEGIN
    SELECT count(*) INTO account_count
    FROM "Users"
    WHERE "Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';
    IF account_count <> 50 THEN
        RAISE EXCEPTION 'Expected 50 isolated test accounts for run {{RUN_ID}}, found %', account_count;
    END IF;
    SELECT count(*) INTO system_card_count FROM "Flashcards" WHERE "OwnerId" IS NULL;
    IF system_card_count > 1814 THEN
        RAISE EXCEPTION 'Expected at most 1814 system flashcards for the documented profile, found %', system_card_count;
    END IF;
END $$;

-- The profile document calls for 1,814 system cards. Keep the fixture volume
-- stable when the checked-in seed is smaller by padding only the disposable DB.
INSERT INTO "Flashcards" ("ExternalId", "Category", "SubCategory", "Question", "Answer", "Example", "OwnerId", "UpdatedAt", "Version")
SELECT 'nfr02-{{RUN_ID}}-system-card-' || n,
       'general', 'issue-43-load-fixture',
       'Synthetic system card ' || n,
       'Synthetic answer ' || n,
       NULL, NULL, now(), 1
FROM generate_series(1, GREATEST(0, 1814 - (SELECT count(*) FROM "Flashcards" WHERE "OwnerId" IS NULL))) AS n;

INSERT INTO "Flashcards" ("ExternalId", "Category", "SubCategory", "Question", "Answer", "Example", "OwnerId", "UpdatedAt", "Version")
SELECT 'nfr02-{{RUN_ID}}-u' || u."Id" || '-card-' || n,
       'general', 'issue-43-load',
       'Synthetic NFR-02 question ' || n,
       'Synthetic NFR-02 answer ' || n,
       NULL, u."Id", now(), 1
FROM "Users" AS u
CROSS JOIN generate_series(1, 500) AS n
WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';

INSERT INTO "Tasks" ("UserId", "Title", "Description", "Priority", "Status", "Position", "DueDate", "CreatedAt")
SELECT u."Id", 'nfr02-{{RUN_ID}}-u' || u."Id" || '-task-' || n,
       'Synthetic NFR-02 task fixture', 'Medium', 0, n - 1, NULL, now()
FROM "Users" AS u
CROSS JOIN generate_series(1, 100) AS n
WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';

INSERT INTO "Notebooks" ("UserId", "Title", "CreatedAt")
SELECT u."Id", 'nfr02-{{RUN_ID}}-u' || u."Id" || '-nb-' || n, now()
FROM "Users" AS u
CROSS JOIN generate_series(1, 10) AS n
WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';

INSERT INTO "NotebookSources" ("NotebookId", "Title", "Type", "Origin", "Content", "CreatedAt")
SELECT nb."Id", 'Synthetic source ' || src.n, 'text', NULL, repeat('x', 5000), now()
FROM "Notebooks" AS nb
JOIN "Users" AS u ON u."Id" = nb."UserId"
CROSS JOIN generate_series(1, 5) AS src(n)
WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid'
  AND nb."Title" LIKE 'nfr02-{{RUN_ID}}-%';

DO $$
DECLARE
    card_count integer;
    task_count integer;
    notebook_count integer;
    source_count integer;
BEGIN
    SELECT count(*) INTO card_count FROM "Flashcards" AS f
    JOIN "Users" AS u ON u."Id" = f."OwnerId"
    WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';
    SELECT count(*) INTO task_count FROM "Tasks" AS t
    JOIN "Users" AS u ON u."Id" = t."UserId"
    WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';
    SELECT count(*) INTO notebook_count FROM "Notebooks" AS n
    JOIN "Users" AS u ON u."Id" = n."UserId"
    WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';
    SELECT count(*) INTO source_count FROM "NotebookSources" AS s
    JOIN "Notebooks" AS n ON n."Id" = s."NotebookId"
    JOIN "Users" AS u ON u."Id" = n."UserId"
    WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid';
    IF card_count <> 25000 OR task_count <> 5000 OR notebook_count <> 500 OR source_count <> 2500 THEN
        RAISE EXCEPTION 'Fixture count mismatch: cards %, tasks %, notebooks %, sources %', card_count, task_count, notebook_count, source_count;
    END IF;
END $$;

SELECT 'fixture-ready' AS status,
       (SELECT count(*) FROM "Flashcards" WHERE "OwnerId" IS NULL) AS system_flashcards,
       (SELECT count(*) FROM "Flashcards" AS f JOIN "Users" AS u ON u."Id" = f."OwnerId" WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid') AS user_flashcards,
       (SELECT count(*) FROM "Tasks" AS t JOIN "Users" AS u ON u."Id" = t."UserId" WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid') AS tasks,
       (SELECT count(*) FROM "Notebooks" AS n JOIN "Users" AS u ON u."Id" = n."UserId" WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid') AS notebooks,
       (SELECT count(*) FROM "NotebookSources" AS s JOIN "Notebooks" AS n ON n."Id" = s."NotebookId" JOIN "Users" AS u ON u."Id" = n."UserId" WHERE u."Email" LIKE 'nfr02-{{RUN_ID}}-vu%@issue43.invalid') AS sources;
