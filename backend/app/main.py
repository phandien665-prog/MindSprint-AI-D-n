"""
MindSprint AI - Application Entrypoint
FastAPI RESTful Backend with SQLite ORM, CORS, and Static Frontend Mount.
"""

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

try:
    from backend.app.database import engine, Base
    from backend.app.routers import auth, tasks, flashcards_review, flashcards_bulk
except ImportError:
    from app.database import engine, Base
    from app.routers import auth, tasks, flashcards_review, flashcards_bulk

# Locate project root and frontend directories
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"

# Initialize FastAPI application
app = FastAPI(
    title="MindSprint AI",
    description="Intelligent Productivity & Accelerated Learning Workspace combining Kanban and Spaced Repetition",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware (Permissive for full frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Case-insensitive path normalizer middleware for API routes
@app.middleware("http")
async def normalize_api_path_middleware(request: Request, call_next):
    raw_path = request.scope.get("path", "")
    if raw_path.startswith("/api/auth"):
        request.scope["path"] = "/api/Auth" + raw_path[len("/api/auth"):]
    elif raw_path.startswith("/api/tasks"):
        request.scope["path"] = "/api/Tasks" + raw_path[len("/api/tasks"):]
    elif raw_path.startswith("/api/flashcards"):
        request.scope["path"] = "/api/Flashcards" + raw_path[len("/api/flashcards"):]

    response = await call_next(request)
    return response


# Include member-assigned routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(flashcards_review.router)
app.include_router(flashcards_bulk.router)


# Lifecycle Startup: Initialize Database Tables & Mount Frontend
@app.on_event("startup")
def on_startup():
    """Create all SQLite database tables on application launch and mount frontend assets."""
    Base.metadata.create_all(bind=engine)
    if FRONTEND_DIR.exists():
        mounted_paths = {getattr(route, "path", None) for route in getattr(app, "routes", [])}
        if "/static" not in mounted_paths:
            try:
                app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
            except Exception:
                pass


# Mount static directory immediately if already present
if FRONTEND_DIR.exists():
    try:
        app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
    except Exception:
        pass


# Health check endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service readiness."""
    return {
        "status": "healthy",
        "service": "MindSprint AI",
        "version": "1.0.0"
    }


@app.get("/", include_in_schema=False)
def serve_index():
    """Serves the frontend SPA index.html or welcome banner."""
    index_file = FRONTEND_DIR / "standalone.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return JSONResponse({
        "message": "Welcome to MindSprint AI API. Frontend index.html is being prepared.",
        "docs": "/docs",
        "health": "/api/health"
    })
