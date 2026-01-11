import os
import json
from flask import Flask, jsonify, send_from_directory, request

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "Frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# -----------------------------
# Helpers
# -----------------------------
def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def data_path(filename):
    return os.path.join(BASE_DIR, "data", filename)

# -----------------------------
# Frontend
# -----------------------------
@app.get("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")

# -----------------------------
# APIs
# -----------------------------
@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.get("/api/profile")
def profile():
    return jsonify(read_json(data_path("profile.json")))

@app.get("/api/summary")
def summary():
    return jsonify(read_json(data_path("summary.json")))

@app.get("/api/projects")
def projects():
    return jsonify(read_json(data_path("projects.json")))

@app.get("/api/experience")
def experience():
    return jsonify(read_json(data_path("experience.json")))

@app.get("/api/skills")
def skills():
    return jsonify(read_json(data_path("skills.json")))

@app.get("/api/certifications")
def certifications():
    return jsonify(read_json(data_path("certifications.json")))

@app.get("/api/achievements")
def achievements():
    return jsonify(read_json(data_path("achievements.json")))

@app.get("/api/volunteer")
def volunteer():
    return jsonify(read_json(data_path("volunteer.json")))

@app.post("/api/contact")
def contact():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    message = payload.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"ok": False, "error": "All fields are required"}), 400

    print(f"[CONTACT] {name} | {email} | {message}")
    return jsonify({"ok": True})

# -----------------------------
# Start
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
