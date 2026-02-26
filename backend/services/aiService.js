const { GoogleGenAI } = require("@google/genai");

// Initialize new Gemini SDK
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing.");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Confirmed available on this API key (from ListModels)
const AI_MODEL = "gemini-2.5-flash";          // Primary
const AI_MODEL_FALLBACK = "gemini-2.0-flash-lite"; // Fallback (different quota)

class AIService {
    static async generateResponse(message, history = []) {
        // Format history for new SDK
        const formattedHistory = history
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
            .filter((_, i, arr) => !(i === 0 && arr[0].role === 'model')); // strip leading model msg

        const chat = ai.chats.create({
            model: AI_MODEL,
            history: formattedHistory,
        });

        const response = await chat.sendMessage({ message });
        return response.text;
    }

    static async estimateCaloriesFromImage(base64Image, mimeType) {
        const modelsToTry = [AI_MODEL, AI_MODEL_FALLBACK];

        const prompt = `Analyze this meal photo and estimate its nutritional content.
Return ONLY a raw JSON object (no markdown, no code blocks) with exactly these fields:
{"food_name":"name of dish","calories":0,"protein":0,"carbs":0,"fat":0}`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`AIService: Estimating with ${modelName}`);

                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: prompt },
                                { inlineData: { mimeType, data: base64Image } }
                            ]
                        }
                    ]
                });

                const text = response.text;
                console.log(`AIService: Response from ${modelName}:`, text?.substring(0, 150));

                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON in response");

                const parsed = JSON.parse(jsonMatch[0]);
                console.log(`AIService: ✅ Success with ${modelName}:`, parsed);
                return parsed;
            } catch (error) {
                console.error(`AIService: ${modelName} failed:`, error.message);
                // Continue to fallback
            }
        }

        throw new Error("Vision estimation failed. All available models returned errors.");
    }
}

module.exports = AIService;
