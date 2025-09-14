
import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskCategory } from "../types";

// Ensure the environment variable is handled externally
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const extractTasksFromImage = async (imageFile: File): Promise<Omit<Task, 'id' | 'completed'>[]> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const textPart = {
        text: `From the provided image of handwritten notes, identify each distinct task. For each task, generate a concise description and classify it into one of the following categories: ${Object.values(TaskCategory).join(', ')}. Ensure your output is only the structured data.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The concise name of the task.',
              },
              category: {
                type: Type.STRING,
                enum: Object.values(TaskCategory),
                description: 'The category of the task.',
              },
            },
            required: ["name", "category"],
          },
        },
      },
    });
    
    const jsonString = response.text;
    if (!jsonString) {
      throw new Error("API returned an empty response. The text might be unclear.");
    }
    
    // Parse the JSON string into an array of tasks
    const parsedTasks = JSON.parse(jsonString);

    // Validate that the result is an array
    if (!Array.isArray(parsedTasks)) {
      throw new Error("Failed to parse tasks. The model did not return a valid list.");
    }

    return parsedTasks;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not process the image with the AI model. Please try again.");
  }
};
