const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'backend/.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VISION_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro"];

async function testModels() {
    console.log("Testing Gemini Vision Models...");
    for (const modelName of VISION_MODELS) {
        try {
            console.log(`Checking model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Just a tiny test to see if it even initializes and accepts a basic prompt
            const result = await model.generateContent("Hello. Say 'OK' if you can see this.");
            const response = await result.response;
            console.log(`✅ Success for ${modelName}:`, response.text().trim());
        } catch (error) {
            console.log(`❌ Failed for ${modelName}:`, error.message);
        }
    }
}

testModels();
