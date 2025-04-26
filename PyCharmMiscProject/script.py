from transformers import RobertaTokenizer, RobertaForSequenceClassification
import torch
import json

# Load tokenizer and model
model_dir = r"C:\Users\dkalpeti\Downloads\Finetuned CodeBERT no kfold-20250421T130952Z-001\Finetuned CodeBERT no kfold"
tokenizer = RobertaTokenizer.from_pretrained(model_dir)
model = RobertaForSequenceClassification.from_pretrained(model_dir)
model.eval()

# Optional: load label mapping from config or external file
# If your config.json has id2label, you can use:
with open(f"{model_dir}/config.json", "r") as f:
    config = json.load(f)
id2label = {int(k): v for k, v in config["id2label"].items()}

# JavaScript code snippet to evaluate
js_code = """
async function fetchData(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
"""

# Tokenize input
inputs = tokenizer(js_code, return_tensors="pt", truncation=True, padding=True, max_length=512)

# Run inference
with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.sigmoid(logits).squeeze()

# Thresholding (adjust if needed)
threshold = 0.5
predicted_indices = (probs >= threshold).nonzero(as_tuple=True)[0].tolist()

# Display results
print("Predicted Labels:")
for idx in predicted_indices:
    label = id2label.get(idx, f"Label {idx}")
    confidence = probs[idx].item()
    print(f"  {label}: {confidence:.3f}")
