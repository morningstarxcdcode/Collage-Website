import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from the environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askAdmissionsBot = async (query: string): Promise<string> => {
  if (!apiKey) return "AI Service Unavailable: API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a helpful, professional admission counselor for an Indian Institute of Technology named 'EduNexus'. 
      Answer the following query concisely and professionally. 
      If the user asks about fees, mention it ranges from 1.5L to 2.5L INR per annum depending on the course.
      If the user asks about dates, mention admissions open June 1st.
      
      Query: ${query}`,
      config: {
        systemInstruction: "Act as a helpful admission assistant.",
        thinkingConfig: { thinkingBudget: 32768 } // High budget for complex query handling
      }
    });
    
    return response.text || "I apologize, I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing high traffic. Please try again later.";
  }
};
