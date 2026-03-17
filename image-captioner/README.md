# 🖼️ Image Captioning AI

A beginner-friendly AI project that automatically generates captions for images. It combines a **Vision Transformer (ViT)** encoder with a **GPT-2** decoder via the HuggingFace Transformers library, served through a clean Flask web app.

## ✨ Features

- Upload any image (JPG, PNG, WEBP) via drag-and-drop or file browser
- Automatically generates a natural language caption using `nlpconnect/vit-gpt2-image-captioning`
- Clean, minimal UI with smooth animations

## 🗂️ Project Structure

```
image-captioner/
└── backend/
    ├── app.py               # Flask API server
    ├── requirements.txt     # Python dependencies
    ├── templates/
    │   └── index.html       # Frontend HTML
    └── static/
        ├── style.css        # Styling
        └── script.js        # Frontend logic
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/image-captioner.git
cd image-captioner/backend
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

> **Note:** The model (`nlpconnect/vit-gpt2-image-captioning`) will be automatically downloaded from HuggingFace on the first run (~900 MB). Subsequent runs use the local cache.

### 3. Run the app

```bash
python app.py
```

Open your browser and go to: **http://127.0.0.1:5000**

## 🛠️ Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Backend   | Python, Flask, Flask-CORS                 |
| AI Model  | HuggingFace Transformers (ViT + GPT-2)    |
| Frontend  | HTML, CSS, Vanilla JavaScript             |

## 📋 Requirements

- Python 3.8+
- ~2 GB disk space (for model cache)
- See `requirements.txt` for Python packages

## 📝 License

This project was built as part of a beginner AI internship project. Feel free to use and modify it.
