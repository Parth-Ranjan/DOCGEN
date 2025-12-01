from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Project, Section
from app.auth.dependencies import get_current_user
from app.services.document_service import document_service

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/{project_id}/docx")
def export_docx(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.document_type.value != "docx":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project is not a Word document"
        )
    
    sections = db.query(Section).filter(
        Section.project_id == project.id
    ).order_by(Section.order).all()
    
    buffer = document_service.create_docx(project, sections)
    
    filename = f"{project.title.replace(' ', '_')}.docx"
    
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{project_id}/pptx")
def export_pptx(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.document_type.value != "pptx":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project is not a PowerPoint presentation"
        )
    
    sections = db.query(Section).filter(
        Section.project_id == project.id
    ).order_by(Section.order).all()
    
    buffer = document_service.create_pptx(project, sections)
    
    filename = f"{project.title.replace(' ', '_')}.pptx"
    
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
