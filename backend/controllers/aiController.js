const AIService = require('../services/aiService');
const AIChatLimit = require('../models/AIChatLimit');

exports.chat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Check Daily Limit
        const limitReached = await AIChatLimit.isLimitReached(userId, 5);
        if (limitReached) {
            return res.status(429).json({
                success: false,
                message: "Daily message limit reached (5/5). Please try again tomorrow or upgrade to Pro."
            });
        }

        const aiResponse = await AIService.generateResponse(message, history || []);

        // Increment usage count
        await AIChatLimit.incrementUsage(userId, today);

        res.status(200).json({
            success: true,
            message: aiResponse
        });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get response from AI Coach"
        });
    }
};

exports.estimateCalories = async (req, res) => {
    try {
        console.log("AI Estimate: Received request");
        const { image, mimeType } = req.body;
        const userId = req.user.id;

        if (!image || !mimeType) {
            console.log("AI Estimate: Missing image or mimeType");
            return res.status(400).json({
                success: false,
                message: "Image and mimeType are required"
            });
        }

        console.log(`AI Estimate: Processing image for user ${userId}, mimeType: ${mimeType}`);

        // Use same limit as chat for now (or separate if needed)
        const limitReached = await AIChatLimit.isLimitReached(userId, 10);
        console.log(`AI Estimate: Limit reached? ${limitReached}`);

        if (limitReached) {
            return res.status(429).json({
                success: false,
                message: "Daily AI limit reached. Please try again tomorrow."
            });
        }

        const estimation = await AIService.estimateCaloriesFromImage(image, mimeType);
        console.log("AI Estimate: Estimation successful", estimation);

        res.status(200).json({
            success: true,
            data: estimation
        });
    } catch (error) {
        console.error("AI Controller Estimation Error:", error.message);
        if (error.stack) console.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to estimate calories from image: " + error.message
        });
    }
};
