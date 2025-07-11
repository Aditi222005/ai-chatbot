import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED: added "models/" prefix
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });


app.post("/api/chatbot", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const result = await model.generateContent(userMessage);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ response: "⚠️ Error processing your message." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
