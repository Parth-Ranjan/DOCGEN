from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Project, Section
from app.schemas import SectionUpdate, SectionResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/sections", tags=["Sections"])

@router.get("/{section_id}", response_model=SectionResponse)
def get_section(
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
    
    return section

@router.put("/{section_id}", response_model=SectionResponse)
def update_section(
    section_id: int,
    section_data: SectionUpdate,
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
    
    if section_data.title is not None:
        section.title = section_data.title
    if section_data.content is not None:
        section.content = section_data.content
    if section_data.order is not None:
        section.order = section_data.order
    
    db.commit()
    db.refresh(section)
    
    return section

@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_section(
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
    
    db.delete(section)
    db.commit()
    
    return None
