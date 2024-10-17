import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    },
});

export { fileManager, model };
