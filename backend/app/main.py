from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import auth, projects, sections, generate, refine, export
from app.db.database import engine, Base
from app.config import get_settings
import traceback

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DocuGen AI API",
    description="AI-powered document generation platform",
    version="1.0.0"
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(sections.router)
app.include_router(generate.router)
app.include_router(refine.router)
app.include_router(export.router)

@app.get("/")
def root():
    return {
        "name": "DocuGen AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
