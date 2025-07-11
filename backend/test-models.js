import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const models = await genAI.listModels();
  models.models.forEach((model) => {
    console.log(model.name, model.supportedGenerationMethods);
  });
}

listModels();
