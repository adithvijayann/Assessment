
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, HttpUrl
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import string
import random
import sqlite3


DATABASE_FILE = "urls.db"

def init_db():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS urls (
        code TEXT PRIMARY KEY,
        original_url TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def insert_url(code: str, url: str):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO urls (code, original_url) VALUES (?, ?)", (code, url))
    conn.commit()
    conn.close()

def get_url_by_code(code: str):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT original_url FROM urls WHERE code = ?", (code,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

def get_code_by_url(url: str):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT code FROM urls WHERE original_url = ?", (url,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None


# FastAPI app

app = FastAPI(title="URL Shortener API", version="1.0")

# Enable CORS for frontend

app.add_middleware(
    CORSMiddleware,
     allow_origins=["http://localhost:8080"],  # Change to your frontend URL
    # allow_origins=["https://assessment-1-g0d3.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: HttpUrl

def generate_short_code(length=6):
    """Generate a unique short code."""
    while True:
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
        if not get_url_by_code(code):
            return code

@app.on_event("startup")
async def startup_event():
    init_db()

@app.post("/shorten")
async def shorten_url(request_data: URLRequest, request: Request):
    # Check if URL already shortened
    existing_code = get_code_by_url(str(request_data.url))
    if existing_code:
        return {
            "short_url": f"{request.base_url}{existing_code}",
            "original_url": request_data.url,
            "code": existing_code
        }

    # Create new short code
    code = generate_short_code()
    insert_url(code, str(request_data.url))

    return {
        "short_url": f"{request.base_url}{code}",
        "original_url": request_data.url,
        "code": code
    }

@app.get("/{code}")
async def redirect_url(code: str):
    url = get_url_by_code(code)
    if url:
        return RedirectResponse(url=url)
    raise HTTPException(status_code=404, detail="URL not found")
