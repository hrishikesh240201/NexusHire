import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: API Key not found.")
else:
    print(f"API Key found: {api_key[:10]}...")

    try:
        genai.configure(api_key=api_key)
        
        # CHANGED: Using 'gemini-2.0-flash' from your available list
        model = genai.GenerativeModel('gemini-2.0-flash')

        print("Contacting Gemini...")
        response = model.generate_content("Hello! Are you ready to recruit tech talent?")
        
        print("\n--- AI RESPONSE ---")
        print(response.text)
        print("-------------------")
        print("SUCCESS: The AI connection is working!")

    except Exception as e:
        print(f"\nError: {e}")