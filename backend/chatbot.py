from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Flask app setup
app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_input = data.get("message", "")

    try:
        response = model.generate_content(user_input)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=3000)
