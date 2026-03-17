import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from PIL import Image
from transformers import pipeline
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
logging.basicConfig(level=logging.INFO)

# Load the model lazily or at startup
# vit-gpt2-image-captioning is great for this task
logging.info("Loading Image Captioning model...")
captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")
logging.info("Model loaded successfully!")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/caption', methods=['POST'])
def generate_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Open image using PIL
        image = Image.open(file.stream).convert('RGB')
        
        # Generate caption
        result = captioner(image)
        
        # Result format: [{'generated_text': 'a cat sitting on a couch'}]
        caption = result[0]['generated_text']
        
        # Capitalize first letter
        caption = caption.capitalize()
        
        return jsonify({'caption': caption}), 200

    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Set FLASK_DEBUG=1 in your environment to enable debug mode locally.
    # Debug is disabled by default for safety.
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(debug=debug_mode, port=5000)
