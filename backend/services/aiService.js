const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// List of models to try in order of preference
const MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

class AIService {
    static async generateResponse(message, history = []) {
        let lastError = null;

        for (const modelName of MODELS) {
            try {
                // console.log(`Attempting to generate response with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Sanitize history:
                // 1. Filter out invalid roles (just in case)
                // 2. Ensure history starts with 'user'. Gemini requires User -> Model -> User turn taking.
                let formattedHistory = history.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

                // Remove leading model messages
                while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
                    formattedHistory.shift();
                }

                const chat = model.startChat({
                    history: formattedHistory,
                    generationConfig: {
                        maxOutputTokens: 4096,
                    },
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                return response.text();
            } catch (error) {
                console.error(`Failed with model ${modelName}:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models fail
        console.error("All Gemini models failed.");
        if (lastError && lastError.response) {
            console.error("Last Gemini API Error Response:", lastError.response);
        }
        throw new Error("Failed to generate AI response after trying multiple models.");
    }
}

module.exports = AIService;
