from openai import OpenAI
from app.config import get_settings
from typing import List

settings = get_settings()

class AIService:
    def __init__(self):
        try:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.client.models.list()
            self.enabled = True
            print("OpenAI API configured")
        except Exception as e:
            print(f"OpenAI API error: {e}")
            self.client = None
            self.enabled = False
    
    async def generate_section_content(
        self,
        main_topic: str,
        section_title: str,
        document_type: str,
        context: str = ""
    ) -> str:
        if not self.enabled:
            return "AI generation is disabled. Please configure a valid OpenAI API key."
        
        if document_type == "docx":
            prompt = f"""Write professional content for a business document about: {main_topic}

Section: {section_title}
{f"Context: {context}" if context else ""}

Requirements:
- 3-4 well-structured paragraphs
- Professional business tone
- 250-350 words
- Include relevant examples or data
- Clear transitions between ideas"""
        else:
            prompt = f"""Create slide content for: {main_topic}

Slide: {section_title}
{f"Context: {context}" if context else ""}

Format:
- 4-5 bullet points
- 8-12 words per bullet
- Start each with dash (-)
- Action-oriented language
- Include data when relevant"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional business writer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a professional business writer."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=600
                )
                return response.choices[0].message.content
            except Exception:
                return "Error generating content"
    
    async def refine_content(
        self,
        current_content: str,
        refinement_prompt: str,
        section_title: str
    ) -> str:
        if not self.enabled:
            return "AI refinement disabled"
        
        prompt = f"""Refine this content for section "{section_title}":

{current_content}

Request: {refinement_prompt}

Maintain professional tone and key information."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional editor."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            # Fallback to GPT-3.5
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a professional editor."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=600
                )
                return response.choices[0].message.content
            except Exception:
                return "Error refining content"
    
    async def generate_outline(
        self,
        main_topic: str,
        document_type: str,
        num_sections: int = 5
    ) -> List[str]:
        if not self.enabled:
            return [f"Section {i+1}" for i in range(num_sections)]
        
        content_type = "document sections" if document_type == "docx" else "presentation slides"
        prompt = f"""Generate {num_sections} {content_type} titles for: {main_topic}

Return only titles, one per line, no numbering."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a content strategist."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=300
            )
            
            content = response.choices[0].message.content
            titles = [line.strip() for line in content.strip().split('\n') if line.strip()]
            titles = [title.split('. ', 1)[-1] if '. ' in title[:4] else title for title in titles]
            titles = [title.lstrip('•-* ').strip() for title in titles]
            return titles[:num_sections]
        except Exception:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a professional business consultant."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=200
                )
                
                content = response.choices[0].message.content
                titles = [line.strip() for line in content.strip().split('\n') if line.strip()]
                titles = [title.split('. ', 1)[-1] if '. ' in title[:4] else title for title in titles]
                titles = [title.lstrip('•-* ').strip() for title in titles]
                return titles[:num_sections]
            except Exception:
                return [f"Section {i+1}" for i in range(num_sections)]

ai_service = AIService()
