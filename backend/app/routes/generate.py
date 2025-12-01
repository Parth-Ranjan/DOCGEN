from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Project, Section
from app.schemas import GenerateContentRequest, AIOutlineRequest
from app.auth.dependencies import get_current_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/generate", tags=["AI Generation"])

@router.post("/content")
async def generate_content(
    request: GenerateContentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == request.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    sections = db.query(Section).filter(
        Section.project_id == project.id
    ).order_by(Section.order).all()
    
    if not sections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No sections found in project"
        )
    
    context = ""
    for section in sections:
        content = await ai_service.generate_section_content(
            main_topic=project.main_topic,
            section_title=section.title,
            document_type=project.document_type.value,
            context=context
        )
        
        section.content = content
        context += f"\n{section.title}: {content[:200]}..."
    
    db.commit()
    
    return {"message": "Content generated successfully", "project_id": project.id}

@router.post("/outline")
async def generate_outline(
    request: AIOutlineRequest,
    current_user: User = Depends(get_current_user)
):
    titles = await ai_service.generate_outline(
        main_topic=request.main_topic,
        document_type=request.document_type,
        num_sections=request.num_sections or 5
    )
    
    return {"titles": titles}
