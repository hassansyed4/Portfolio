import os
import json
from flask import Flask, jsonify, send_from_directory, request

# Serve frontend files
FRONTEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend")
)

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ---------- API ROUTES ----------

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.get("/api/profile")
def profile():
    data_path = os.path.join(os.path.dirname(__file__), "data", "profile.json")
    return jsonify(read_json(data_path))

@app.get("/api/projects")
def projects():
    data_path = os.path.join(os.path.dirname(__file__), "data", "projects.json")
    return jsonify(read_json(data_path))

@app.get("/api/summary")
def summary():
    data_path = os.path.join(os.path.dirname(__file__), "data", "summary.json")
    return jsonify(read_json(data_path))

@app.post("/api/contact")
def contact():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"ok": False, "error": "All fields are required."}), 400

    print(f"[CONTACT] {name} | {email} | {message}")
    return jsonify({"ok": True, "message": "Message received"})

@app.get("/api/experience")
def experience():
    data_path = os.path.join(os.path.dirname(__file__), "data", "experience.json")
    return jsonify(read_json(data_path))

@app.get("/api/skills")
def skills():
    data_path = os.path.join(os.path.dirname(__file__), "data", "skills.json")
    return jsonify(read_json(data_path))

@app.get("/api/certifications")
def certifications():
    data_path = os.path.join(os.path.dirname(__file__), "data", "certifications.json")
    return jsonify(read_json(data_path))

@app.get("/api/achievements")
def achievements():
    data_path = os.path.join(os.path.dirname(__file__), "data", "achievements.json")
    return jsonify(read_json(data_path))

@app.get("/api/volunteer")
def volunteer():
    data_path = os.path.join(os.path.dirname(__file__), "data", "volunteer.json")
    return jsonify(read_json(data_path))


# ---------- FRONTEND ROUTES ----------

@app.get("/")
def serve_home():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.get("/<path:filename>")
def serve_frontend(filename):
    return send_from_directory(FRONTEND_DIR, filename)

# ---------- START SERVER ----------

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
