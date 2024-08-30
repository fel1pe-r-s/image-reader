import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function filesCreateImage(nameImage) {
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
  const uploadResult = await fileManager.uploadFile(
    `${path.resolve(__dirname, "..", "..", "tmp", "uploads")}/${nameImage}`,
    {
      mimeType: "image/png",
      displayName: nameImage,
    }
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Extract the current meter reading and label it as measure_consumption.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
  const text = result.response.text();

  return {
    text,
  };
}
