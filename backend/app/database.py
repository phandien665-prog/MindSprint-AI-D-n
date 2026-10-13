"""
MindSprint AI - Database Configuration and Session Management
SQLite Engine with Foreign Key Enforcement & SQLAlchemy ORM
"""

import os
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configurable database URL (default to local SQLite mindsprint.db)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mindsprint.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

# Enforce foreign key constraints in SQLite
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enable SQLite foreign key support on new connections."""
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    except Exception:
        # Pass silently for non-SQLite engines
        pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI Dependency for per-request database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
