# Backup & Restore Runbook — MindSprint AI

## Overview
This runbook documents the backup and restore procedures for the PostgreSQL database used by MindSprint AI.

## RPO/RTO Targets
- **RPO (Recovery Point Objective):** ≤ 24 hours
- **RTO (Recovery Time Objective):** ≤ 60 minutes
- **Retention:** Minimum 7 daily backups

## Backup Procedure

### Automated Daily Backup (PostgreSQL)
```bash
# Daily backup via pg_dump
pg_dump -h <host> -U <user> -d <database> -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Verify backup
pg_restore --list backup_*.dump | head -20
```

### Backup Schedule
- **Frequency:** Daily at 02:00 Asia/Saigon (UTC+7)
- **Retention:** 7 daily backups, 4 weekly backups, 3 monthly backups
- **Storage:** Encrypted cloud storage (AWS S3 / Azure Blob / GCS)
- **Access:** Restricted to DBA role only

### Backup Verification Checklist
- [ ] Backup file exists and is non-zero size
- [ ] `pg_restore --list` succeeds without errors
- [ ] Backup contains all required tables: Users, Flashcards, CardProgresses, Tasks, Notebooks, NotebookSources, NotebookNotes, UserStudyDays, StudySchedules, RefreshTokens
- [ ] Row counts match expected baseline

## Restore Procedure

### Full Restore
```bash
# 1. Create new database
createdb -h <host> -U <user> mindsprint_restore

# 2. Restore from backup
pg_restore -h <host> -U <user> -d mindsprint_restore --clean --if-exists backup_*.dump

# 3. Verify row counts
psql -h <host> -U <user> -d mindsprint_restore -c "SELECT 'Flashcards' as table, COUNT(*) FROM Flashcards UNION ALL SELECT 'Tasks', COUNT(*) FROM Tasks UNION ALL SELECT 'Notebooks', COUNT(*) FROM Notebooks UNION ALL SELECT 'NotebookSources', COUNT(*) FROM NotebookSources UNION ALL SELECT 'NotebookNotes', COUNT(*) FROM NotebookNotes UNION ALL SELECT 'UserStudyDays', COUNT(*) FROM UserStudyDays;"
```

### Smoke Test After Restore
1. Login with test account
2. Verify flashcards load correctly
3. Verify Kanban tasks display properly
4. Verify notebook sources and notes are intact
5. Verify study stats match pre-backup state

## Data Scope
### Included in Backup
- All server-side data: Users, Flashcards (system + personal), CardProgresses, KanbanTasks, Notebooks, NotebookSources, NotebookNotes, NotebookGenerationCaches, UserStudyDays, StudySchedules, RefreshTokens, WeakAreas

### NOT Included in Backup (Client-Side Only)
- localStorage data (flashcard progress not yet synced)
- Service worker cache
- Browser session state
- Any data created offline that has not been synced to server

**Important:** Data stored only in localStorage is NOT recoverable from server backup. Users must sync data before relying on backup recovery.

## RPO/RTO Measurement
- **RPO:** Time between last successful backup and failure event (≤ 24h)
- **RTO:** Time from failure detection to full service restoration (≤ 60min)
- Measure from backup creation timestamp to restore completion timestamp

## Limitations
- Cloud demo instances may not have automated backup enabled by default
- Backup storage costs and retention policies depend on hosting provider
- Point-in-time recovery requires WAL archiving configuration