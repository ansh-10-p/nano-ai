
// To run this code, run these in your terminal:
// npm install @google/generativeai

import { GoogleGenAI } from '@google/genai';

// Use import.meta.env to access your Vite variable
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

async function runChat(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error occurred. Check the console.";
  }
}

export default runChat;