"""
MindSprint AI - Local Server Runner
Run with: python run_server.py
"""

import uvicorn
import os
import sys

# Ensure backend directory is in python sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting MindSprint AI server on http://{host}:{port}")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
