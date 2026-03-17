import torch
from PIL import Image
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer

print("Loading model...")
model_name = "nlpconnect/vit-gpt2-image-captioning"
model = VisionEncoderDecoderModel.from_pretrained(model_name)
feature_extractor = ViTImageProcessor.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
print("Model loaded.")

image = Image.open('test_image.png').convert('RGB')
print("Image opened.")

try:
    pixel_values = feature_extractor(images=[image], return_tensors="pt").pixel_values
    output_ids = model.generate(pixel_values, max_length=50, num_beams=4)
    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    print("Result:", preds[0].strip())
except Exception as e:
    import traceback
    traceback.print_exc()
