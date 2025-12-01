from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.models.project import DocumentType

class SectionBase(BaseModel):
    title: str
    order: int

class SectionCreate(SectionBase):
    pass

class SectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    order: Optional[int] = None

class SectionResponse(SectionBase):
    id: int
    content: str
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    document_type: DocumentType
    main_topic: str
    sections: List[SectionCreate]

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    main_topic: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    document_type: DocumentType
    main_topic: str
    created_at: datetime
    updated_at: datetime
    user_id: int
    sections: List[SectionResponse] = []
    
    class Config:
        from_attributes = True
