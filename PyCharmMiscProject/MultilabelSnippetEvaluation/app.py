from flask import Flask, request, jsonify
from flask_cors import CORS  # 👈 Add this
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import torch
import json
import os

# Load model and tokenizer
model_dir = r"C:\Users\dkalpeti\Downloads\Finetuned CodeBERT no kfold-20250421T130952Z-001\Finetuned CodeBERT no kfold"
tokenizer = RobertaTokenizer.from_pretrained(model_dir)
model = RobertaForSequenceClassification.from_pretrained(model_dir)
model.eval()

# Load label mapping
with open(os.path.join(model_dir, "config.json"), "r") as f:
    config = json.load(f)
id2label = {int(k): v for k, v in config["id2label"].items()}

app = Flask(__name__)
CORS(app, origins=["http://localhost:5174"])

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    js_code = data.get("code")

    if not js_code:
        return jsonify({"error": "Missing 'code' in request body"}), 400

    inputs = tokenizer(js_code, return_tensors="pt", truncation=True, padding=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.sigmoid(logits).squeeze()

    threshold = 0.5
    predicted_indices = (probs >= threshold).nonzero(as_tuple=True)[0].tolist()

    predictions = [
        {"label": id2label.get(idx, f"Label {idx}"), "confidence": round(probs[idx].item(), 3)}
        for idx in predicted_indices
    ]

    return jsonify({"predictions": predictions})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
