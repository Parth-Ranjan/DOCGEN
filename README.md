# DocuGen AI

AI-powered platform for generating professional Word documents and PowerPoint presentations.

## Features

- Generate Word documents with professional formatting
- Create PowerPoint presentations with modern layouts
- AI-powered content generation using OpenAI GPT-4
- Rich text editor for content customization
- User authentication and project management
- Export to .docx and .pptx formats

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Framer Motion  
**Backend:** FastAPI, PostgreSQL, SQLAlchemy, OpenAI API  
**Document Generation:** python-docx, python-pptx

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd docugen-ai
```

2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
alembic upgrade head
python run_with_logs.py
```

3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

## Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-api-key
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
```

## Usage

1. Register/Login
2. Create a new project (Word or PowerPoint)
3. Define sections or use AI suggestions
4. Generate content with AI
5. Edit and refine as needed
6. Export your document

## Deployment

### Frontend (Vercel)
- Connect GitHub repository
- Set `VITE_API_URL` environment variable
- Deploy

### Backend (Render)
- Create Web Service from repository
- Set environment variables
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## API Documentation

Visit `http://localhost:8000/docs` when backend is running.

## License

MIT
