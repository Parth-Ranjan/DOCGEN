from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RefinementCreate(BaseModel):
    prompt: str
    section_id: int

class RefinementFeedback(BaseModel):
    liked: Optional[bool] = None
    comment: Optional[str] = ""

class RefinementResponse(BaseModel):
    id: int
    prompt: str
    previous_content: Optional[str]
    new_content: Optional[str]
    liked: Optional[bool]
    comment: str
    created_at: datetime
    section_id: int
    
    class Config:
        from_attributes = True

class GenerateContentRequest(BaseModel):
    project_id: int

class AIOutlineRequest(BaseModel):
    main_topic: str
    document_type: str
    num_sections: Optional[int] = 5
