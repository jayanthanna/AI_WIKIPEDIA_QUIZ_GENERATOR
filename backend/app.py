# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from database import SessionLocal, Quiz, init_db
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz

app = Flask(__name__)
CORS(app)
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
if FRONTEND_URL == "*":
    CORS(app)
else:
    CORS(app, origins=[FRONTEND_URL])

init_db()

@app.route("/")
def home():
    return {"message": "AI Wiki Quiz Generator API is running"}

@app.route("/generate_quiz", methods=["POST"])
def generate_quiz_api():
    try:
        data = request.get_json()
        url = data.get("url")

        if not url:
            return jsonify({"error": "URL is required"}), 400

        scraped = scrape_wikipedia(url)
        if not scraped:
            return jsonify({"error": "Failed to scrape Wikipedia"}), 500

        ai_output = generate_quiz(scraped["content"], scraped["title"])

        if not ai_output:
            return jsonify({"error": "Quiz generation failed"}), 500

        # Safely parse AI output to JSON
        try:
            quiz_json = json.loads(ai_output)
        except json.JSONDecodeError:
            print("AI returned invalid JSON. Raw output:", ai_output)
            return jsonify({"error": "AI returned invalid JSON"}), 500

        # Save quiz to database
        db = SessionLocal()
        new_quiz = Quiz(
            url=url,
            title=scraped["title"],
            scraped_content=scraped["content"],
            full_quiz_data=ai_output
        )
        db.add(new_quiz)
        db.commit()

        return jsonify(quiz_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/history", methods=["GET"])
def get_history():
    db = SessionLocal()
    quizzes = db.query(Quiz).all()
    history = [
        {"id": q.id, "url": q.url, "title": q.title, "date": q.date_generated}
        for q in quizzes
    ]
    return jsonify(history)


@app.route("/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz_by_id(quiz_id):
    db = SessionLocal()
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify(json.loads(quiz.full_quiz_data))

@app.route("/delete_quiz/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):
    db = SessionLocal()
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    db.delete(quiz)
    db.commit()
    return jsonify({"message": f"Quiz {quiz_id} deleted successfully"})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
