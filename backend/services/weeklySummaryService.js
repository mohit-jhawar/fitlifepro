const { GoogleGenAI } = require('@google/genai');
const WeeklySummary = require('../models/WeeklySummarySchema');
const WorkoutLog = require('../models/WorkoutLogSchema');
const MealLogModel = require('../models/MealLogSchema');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const AI_MODEL = 'gemini-2.5-flash';
const AI_MODEL_FALLBACK = 'gemini-2.0-flash-lite';

class WeeklySummaryService {

    /**
     * Returns the last completed Mon–Sun week range.
     * Always anchors to the most recent Sunday, regardless of today's day.
     */
    static getLastWeekRange() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon … 6=Sat

        // Last Sunday (= today if Sunday, otherwise rewind to last Sunday)
        const lastSunday = new Date(now);
        lastSunday.setDate(now.getDate() - dayOfWeek);
        lastSunday.setHours(23, 59, 59, 999);

        // Monday 6 days before that Sunday
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);
        lastMonday.setHours(0, 0, 0, 0);

        return { weekStart: lastMonday, weekEnd: lastSunday };
    }

    /**
     * Returns the Mon–Sun range for the week before the given weekStart.
     */
    static getPrevWeekRange(weekStart) {
        const prevEnd = new Date(weekStart);
        prevEnd.setDate(weekStart.getDate() - 1);
        prevEnd.setHours(23, 59, 59, 999);

        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevEnd.getDate() - 6);
        prevStart.setHours(0, 0, 0, 0);

        return { weekStart: prevStart, weekEnd: prevEnd };
    }

    /**
     * Main entry point: generate or return existing summary for the last
     * completed week. Returns null if no activity data exists at all.
     */
    static async generateForLastWeek(userId) {
        const { weekStart, weekEnd } = WeeklySummaryService.getLastWeekRange();

        // Never duplicate — idempotent by (userId, weekStartDate)
        const existing = await WeeklySummary.findOne({ userId, weekStartDate: weekStart });
        if (existing) return existing;

        // ── Workout data ──────────────────────────────────────────────────────
        const workoutLogs = await WorkoutLog.find({
            user_id: userId,
            workout_date: { $gte: weekStart, $lte: weekEnd },
            completed: true
        }).lean();

        // Target: 5 sessions per week
        const TARGET_SESSIONS = 5;
        const workoutConsistency = Math.min(
            100,
            Math.round((workoutLogs.length / TARGET_SESSIONS) * 100)
        );

        // ── Nutrition data ────────────────────────────────────────────────────
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            days.push(d.toISOString().split('T')[0]);
        }

        const mealLogs = await MealLogModel.find({
            user_id: userId,
            log_date: { $in: days }
        }).lean();

        // Macro compliance: weighted average of calorie (60%) + protein (40%) ratios
        let macroCompliance = 0;
        if (mealLogs.length > 0) {
            const dailyCompliances = mealLogs.map(log => {
                const allItems = [
                    ...(log.breakfast || []),
                    ...(log.lunch || []),
                    ...(log.dinner || []),
                    ...(log.snacks || [])
                ];
                const totalCalories = allItems.reduce((s, i) => s + (i.calories || 0), 0);
                const totalProtein = allItems.reduce((s, i) => s + (i.protein || 0), 0);
                const calorieRatio = Math.min(1, totalCalories / (log.calorie_goal || 2000));
                const proteinRatio = Math.min(1, totalProtein / (log.protein_goal || 150));
                return (calorieRatio * 0.6 + proteinRatio * 0.4) * 100;
            });
            macroCompliance = Math.round(
                dailyCompliances.reduce((s, v) => s + v, 0) / dailyCompliances.length
            );
        }

        // ── Strength improvement: total sets this week vs previous week ───────
        const prevRange = WeeklySummaryService.getPrevWeekRange(weekStart);
        const prevLogs = await WorkoutLog.find({
            user_id: userId,
            workout_date: { $gte: prevRange.weekStart, $lte: prevRange.weekEnd },
            completed: true
        }).lean();

        const calcTotalSets = (logs) =>
            logs.reduce((sum, log) => {
                const exs = Array.isArray(log.exercises) ? log.exercises : [];
                return sum + exs.reduce((s, ex) => s + (ex.sets || 1), 0);
            }, 0);

        const thisWeekSets = calcTotalSets(workoutLogs);
        const prevWeekSets = calcTotalSets(prevLogs);

        let strengthImprovement = 0;
        if (prevWeekSets > 0) {
            strengthImprovement = Math.round(
                ((thisWeekSets - prevWeekSets) / prevWeekSets) * 100
            );
        } else if (thisWeekSets > 0) {
            strengthImprovement = 100; // First week of tracking
        }

        // ── Streak continuity: consecutive days with workouts ending at weekEnd
        const workoutDates = new Set(
            workoutLogs.map(l => new Date(l.workout_date).toISOString().split('T')[0])
        );
        let streak = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekEnd);
            d.setDate(weekEnd.getDate() - i);
            d.setHours(12, 0, 0, 0);
            if (workoutDates.has(d.toISOString().split('T')[0])) {
                streak++;
            } else {
                break;
            }
        }
        const streakScore = Math.round((streak / 7) * 100);

        // ── Areas to improve ──────────────────────────────────────────────────
        const areasToImprove = [];
        if (workoutConsistency < 60) areasToImprove.push('Increase workout frequency');
        if (macroCompliance < 70) areasToImprove.push('Improve protein and calorie tracking');
        if (strengthImprovement < 0) areasToImprove.push('Rebuild strength consistency');
        if (mealLogs.length < 3) areasToImprove.push('Log meals daily for accurate nutrition data');
        if (streak < 2 && workoutLogs.length > 0) areasToImprove.push('Build workout streak momentum');

        // ── Weighted score (0–100) ────────────────────────────────────────────
        // Strength score: center at 50 so 0% improvement → 50, +10% → ~55, -10% → ~45
        const strengthScore = Math.max(0, Math.min(100, 50 + strengthImprovement * 0.5));
        const score = Math.round(
            workoutConsistency * 0.40 +
            macroCompliance    * 0.30 +
            strengthScore      * 0.20 +
            streakScore        * 0.10
        );

        // ── AI insight ────────────────────────────────────────────────────────
        let aiInsight = '';
        try {
            aiInsight = await WeeklySummaryService.generateAIInsight({
                workoutConsistency,
                macroCompliance,
                strengthImprovement,
                areasToImprove
            });
        } catch (e) {
            console.error('WeeklySummaryService: AI insight failed:', e.message);
            // Deterministic fallback so we never block the summary
            aiInsight = `This week you achieved ${workoutConsistency}% workout consistency and ${macroCompliance}% macro compliance. ${areasToImprove.length > 0 ? 'Priority area: ' + areasToImprove[0] + '.' : 'Excellent work — keep pushing!'}`;
        }

        // ── Persist ───────────────────────────────────────────────────────────
        const summary = await WeeklySummary.create({
            userId,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            workoutConsistency,
            macroCompliance,
            strengthImprovement,
            areasToImprove,
            aiInsight,
            score
        });

        return summary;
    }

    /**
     * Call Gemini to generate a motivational, structured weekly insight.
     */
    static async generateAIInsight({ workoutConsistency, macroCompliance, strengthImprovement, areasToImprove }) {
        const prompt = `Generate a short motivational weekly performance summary based on:
Workout consistency: ${workoutConsistency}%
Macro compliance: ${macroCompliance}%
Strength change: ${strengthImprovement}%
Areas to improve: ${areasToImprove.join(', ') || 'None identified'}

Keep response under 120 words.
Encourage improvement but remain realistic.`;

        const modelsToTry = [AI_MODEL, AI_MODEL_FALLBACK];
        for (const modelName of modelsToTry) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                return response.text.trim();
            } catch (e) {
                console.error(`WeeklySummaryService: ${modelName} failed:`, e.message);
            }
        }
        throw new Error('All AI models failed for weekly insight');
    }
}

module.exports = WeeklySummaryService;
