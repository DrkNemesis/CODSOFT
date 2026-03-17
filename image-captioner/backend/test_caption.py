import requests

with open('test_image.png', 'rb') as f:
    files = {'image': ('test_image.png', f, 'image/png')}
    try:
        response = requests.post('http://127.0.0.1:5000/caption', files=files)
        print("Status code:", response.status_code)
        print("Response text:", response.text)
    except Exception as e:
        print("Error:", e)
