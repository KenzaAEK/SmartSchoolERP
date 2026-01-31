
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utilise la vision de Gemini pour extraire des données structurées d'une image/PDF (en base64)
export const extractDataFromDocument = async (base64Data: string, mimeType: string, docType: 'transcript' | 'students'): Promise<any> => {
  try {
    const prompt = docType === 'transcript' 
      ? "Extract grades from this transcript. Return a JSON array of objects with 'subject' and 'grade' (0-20)."
      : "Extract student list. Return a JSON array of objects with 'name', 'apogee_code', and 'email'.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Modèle performant pour l'extraction de texte/vision
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return null;
  }
};

export const getAIOrientationInsights = async (studentData: string): Promise<AIRecommendation[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the following student performance and interests: "${studentData}", provide 3 career path recommendations. Output must be a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              major: { type: Type.STRING },
              score: { type: Type.NUMBER, description: "Compatibility score 0-100" },
              description: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["major", "score", "description", "confidence"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [];
  }
};

export const getAIScheduleSuggestion = async (constraints: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an ERP scheduling expert, provide a concise reasoning (2 sentences max) for an optimized schedule based on these constraints: ${constraints}`,
    });
    return response.text || "Schedule optimized for student focus and teacher availability.";
  } catch (error) {
    return "Optimizing schedule logic applied.";
  }
};

export const getAIDashboardInsights = async (stats: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these school ERP statistics: ${JSON.stringify(stats)}. Provide a 3-bullet point strategic summary regarding student success and administrative risks.`,
    });
    return response.text || "Everything is operating within normal parameters.";
  } catch (error) {
    return "AI analysis currently unavailable.";
  }
};

export const getAITeacherInsights = async (classData: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a pedagogical AI assistant, analyze this class performance data: ${JSON.stringify(classData)}. Provide a brief diagnostic (2-3 sentences) on the class's strengths and one specific action the teacher should take this week.`,
    });
    return response.text || "Class performance is stable. Continue with the current lesson plan.";
  } catch (error) {
    return "Pedagogical analysis currently unavailable.";
  }
};

export const getStudentDashboardInsights = async (studentName: string, performance: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Hi Gemini, provide a short (1-2 sentences) encouraging and tactical academic advice for a student named ${studentName} with these current stats: ${JSON.stringify(performance)}. Keep it friendly and motivating.`,
    });
    return response.text || "Continue working hard on your technical modules!";
  } catch (error) {
    return "Keep pushing forward, you're doing great!";
  }
};

export const getGradeGoalSimulation = async (currentGPA: number, targetGPA: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `A student has a ${currentGPA}/20 average and wants to reach ${targetGPA}/20. In 20 words or less, tell them how many points higher their next grades should be on average.`,
    });
    return response.text || "Focus on reaching higher scores in your next high-coefficient modules.";
  } catch (error) {
    return "Target higher grades in future modules to raise your GPA.";
  }
};
