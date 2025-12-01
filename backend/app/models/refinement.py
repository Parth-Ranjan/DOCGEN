from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class RefinementHistory(Base):
    __tablename__ = "refinement_history"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text, nullable=False)
    previous_content = Column(Text)
    new_content = Column(Text)
    liked = Column(Boolean, default=None, nullable=True)
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    
    section = relationship("Section", back_populates="refinements")
