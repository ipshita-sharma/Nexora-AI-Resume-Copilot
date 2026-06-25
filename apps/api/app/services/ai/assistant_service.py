from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_career_ai(message: str, resume_text: str = ""):

    system_prompt = f"""
You are an AI Career Assistant.

Resume context:
{resume_text}

Help with:
- ATS optimization
- Resume improvement
- Interview preparation
- Project suggestions
- Learning plans

Rules:

If the user asks for interview questions:

Return structured output:

Technical Interview Questions

1.
2.
3.
4.
5.

or

HR Interview Questions

1.
2.
3.
4.
5.

or

Project Interview Questions

1.
2.
3.
4.
5.

Generate questions using resume context whenever available.

Keep responses concise and properly formatted.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role":"system",
                "content":system_prompt
            },
            {
                "role":"user",
                "content":message
            }
        ]
    )

    return response.choices[0].message.content