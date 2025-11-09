# backend/llm_quiz_generator.py
import google.generativeai as genai
import os
import re
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"

def extract_json(text):
    """Extract only the JSON portion from the AI's response text."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return match.group(0) if match else text

def generate_quiz(article_text, article_title):
    prompt = f"""
You are a helpful educational AI. 
Generate a JSON quiz strictly following this structure — DO NOT include explanations outside JSON, no markdown, no backticks:

{{
  "title": "{article_title}",
  "summary": "A short summary of the article.",
  "quiz": [
    {{
      "question": "Question text",
      "options": ["A","B","C","D"],
      "answer": "Correct answer",
      "difficulty": "easy|medium|hard",
      "explanation": "Short explanation"
    }}
  ],
  "related_topics": ["topic1","topic2","topic3"]
}}

Only output valid JSON — no text before or after it.

Article content:
{article_text[:4000]}
"""

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        json_text = extract_json(response.text.strip())
        return json_text
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return None
