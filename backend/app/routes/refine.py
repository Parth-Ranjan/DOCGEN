from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import User, Project, Section, RefinementHistory
from app.schemas import RefinementCreate, RefinementFeedback, RefinementResponse
from app.auth.dependencies import get_current_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/refine", tags=["Refinement"])

@router.post("", response_model=RefinementResponse)
async def refine_section(
    refinement_data: RefinementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    section = db.query(Section).join(Project).filter(
        Section.id == refinement_data.section_id,
        Project.user_id == current_user.id
    ).first()
    
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    
    previous_content = section.content
    
    new_content = await ai_service.refine_content(
        current_content=previous_content,
        refinement_prompt=refinement_data.prompt,
        section_title=section.title
    )
    
    refinement = RefinementHistory(
        prompt=refinement_data.prompt,
        previous_content=previous_content,
        new_content=new_content,
        section_id=section.id
    )
    
    db.add(refinement)
    section.content = new_content
    db.commit()
    db.refresh(refinement)
    
    return refinement

@router.put("/{refinement_id}/feedback", response_model=RefinementResponse)
def update_refinement_feedback(
    refinement_id: int,
    feedback: RefinementFeedback,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    refinement = db.query(RefinementHistory).join(Section).join(Project).filter(
        RefinementHistory.id == refinement_id,
        Project.user_id == current_user.id
    ).first()
    
    if not refinement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Refinement not found"
        )
    
    if feedback.liked is not None:
        refinement.liked = feedback.liked
    if feedback.comment is not None:
        refinement.comment = feedback.comment
    
    db.commit()
    db.refresh(refinement)
    
    return refinement

@router.get("/section/{section_id}", response_model=List[RefinementResponse])
def get_section_refinements(
    section_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    section = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.user_id == current_user.id
    ).first()
    
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    
    refinements = db.query(RefinementHistory).filter(
        RefinementHistory.section_id == section_id
    ).order_by(RefinementHistory.created_at.desc()).all()
    
    return refinements
