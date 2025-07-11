// routes/chatbot.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const prompt = `You are an art assistant. A seller said: "${message}".
Please suggest:
1. A title for the artwork
2. A short description
3. Suitable category (e.g., Digital Art, Painting, Sketch, etc.)
4. Beginner-friendly estimated price in INR`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or use "gpt-3.5-turbo" if gpt-4 is not accessible
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
  } catch (error) {
    console.error("OpenAI Error:", error.message || error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

export default router;
