from flask import Flask, request, jsonify
from flask_cors import CORS
from frames import kb

app = Flask(__name__)
CORS(app)

@app.get("/api/frames")
def get_frames():
    return jsonify(kb.to_graph())

@app.get("/api/diseases")
def get_diseases():
    return jsonify([f.name for f in kb.diseases()])

@app.get("/api/symptoms")
def get_symptoms():
    return jsonify(kb.all_symptoms())

@app.post("/api/diagnose")
def post_diagnose():
    data = request.get_json(force=True) or {}
    symptoms = set(map(str.lower, data.get("symptoms", [])))
    results, details = kb.diagnose(symptoms)
    return jsonify({
        "ranked": [{"disease": d, "score": s} for d, s in results],
        "details": details
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
