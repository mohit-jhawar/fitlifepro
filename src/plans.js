/**
 * FITNESS & NUTRITION ENCYCLOPEDIA - 572 TOTAL SYSTEMATIC PLANS
 * Workout: 312 combinations (13 BMI * 2 Loc * 3 Lv * 4 Goals)
 * Diet: 260 combinations (13 BMI * 4 Goals * 5 Diet Types)
 */

// --- 1. SHARED FOUNDATION ---
const BMI_LEVELS = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

const getNearestBMILevel = (bmi) => {
    if (!bmi) return 22;
    return BMI_LEVELS.reduce((prev, curr) => {
        return Math.abs(curr - bmi) < Math.abs(prev - bmi) ? curr : prev;
    });
};

// --- 2. WORKOUT ENCYCLOPEDIA (312 PLANS) ---
const WORKOUT_EXERCISES = {
    Home: {
        Beginner: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Mountain Climbers', 'Glute Bridge'],
        Intermediate: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Mountain Climbers', 'Glute Bridge', 'Jumping Jacks', 'Burpees', 'High Knees'],
        Advanced: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Mountain Climbers', 'Glute Bridge', 'Jumping Jacks', 'Burpees', 'High Knees', 'Wall Sit', 'Tricep Dips (Chair)', 'Superman Hold']
    },
    Gym: {
        Beginner: ['Bench Press', 'Leg Press', 'Lat Pulldown', 'Deadlift', 'Shoulder Press', 'Cable Row'],
        Intermediate: ['Bench Press', 'Leg Press', 'Lat Pulldown', 'Deadlift', 'Shoulder Press', 'Cable Row', 'Leg Curl', 'Bicep Curl', 'Tricep Pushdown'],
        Advanced: ['Bench Press', 'Leg Press', 'Lat Pulldown', 'Deadlift', 'Shoulder Press', 'Cable Row', 'Leg Curl', 'Bicep Curl', 'Tricep Pushdown', 'Treadmill Run', 'Rowing Machine', 'Chest Fly']
    }
};

const WORKOUT_GOALS = {
    'Weight Loss': { setsReps: '3–4 sets | 12–15 reps', rest: '30–45 sec rest', progression: 'Increase reps or reduce rest time weekly.' },
    'Weight Gain': { setsReps: '4–5 sets | 6–10 reps', rest: '90 sec rest', progression: 'Increase weight weekly by 5% if completed comfortably.' },
    'Endurance': { setsReps: '3 sets | 15–20 reps', rest: '20–30 sec rest', progression: 'Increase sets or reps weekly.' },
    'Muscle Gain': { setsReps: '4 sets | 8–12 reps', rest: '60–90 sec rest', progression: 'Focus on progressive overload weekly.' }
};

// Generate Index
const workoutEncyclopedia = {};
BMI_LEVELS.forEach(bmi => {
    workoutEncyclopedia[bmi] = {};
    ['Home', 'Gym'].forEach(loc => {
        ['Beginner', 'Intermediate', 'Advanced'].forEach(lv => {
            ['Weight Loss', 'Weight Gain', 'Endurance', 'Muscle Gain'].forEach(goal => {
                workoutEncyclopedia[bmi][`${loc}_${lv}_${goal}`] = {
                    exercises: WORKOUT_EXERCISES[loc][lv],
                    structure: WORKOUT_GOALS[goal]
                };
            });
        });
    });
});

// --- 3. DIET ENCYCLOPEDIA (260 PLANS - 6 MEALS) ---
const DIET_TYPES = ['Standard', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];
const DIET_TEMPLATES = {
    'Standard': [
        'Greek Yogurt with Berries & Granola',
        'Apple with Almond Butter',
        'Grilled Chicken Breast with Quinoa & Steamed Broccoli',
        'Handful of Almonds & Walnuts',
        'Baked Salmon with Sweet Potato & Asparagus',
        'Whey Protein Shake or Cottage Cheese'
    ],
    'Vegetarian': [
        'Oats + Peanut Butter + Milk',
        'Greek Yogurt + Berries',
        'Paneer + Brown Rice',
        'Boiled Eggs + Toast',
        'Dal + Rice',
        'Protein Shake'
    ],
    'Vegan': [
        'Oats + Almond Butter + Banana',
        'Tofu Scramble + Whole Grain Toast',
        'Lentil & Quinoa Bowl',
        'Mixed Nuts + Fruit',
        'Chickpea Salad',
        'Plant Protein Smoothie'
    ],
    'Gluten-Free': [
        'Egg Omelet + Fruits',
        'Rice Cakes + Peanut Butter',
        'Grilled Chicken + Rice',
        'Nuts + Yogurt',
        'Fish + Quinoa',
        'Cottage Cheese'
    ],
    'Dairy-Free': [
        'Oats + Almond Milk',
        'Eggs + Avocado',
        'Grilled Chicken + Sweet Potato',
        'Fruit + Nuts',
        'Rice + Beans',
        'Plant Protein Shake'
    ]
};

const getDietKcalData = (bmi, goal) => {
    // Base calories at Level 16 (from PDF)
    const base = { 'Muscle Building': 2578, 'Fat Loss': 1778, 'Endurance': 2378, 'Weight Gain': 2678 };
    const bmiFactor = (bmi - 16) / 2;
    // Systemic scaling identified: +89.5 - 90 kcal per 2 BMI points
    const kcal = Math.round(base[goal] + (bmiFactor * 89.6));

    // Macro ratios per goal
    let p = 0.30, c = 0.45, f = 0.25;
    if (goal === 'Fat Loss') { p = 0.35; c = 0.35; f = 0.30; }
    if (goal === 'Endurance') { p = 0.25; c = 0.50; f = 0.25; }

    return { kcal, p: Math.round((kcal * p) / 4), c: Math.round((kcal * c) / 4), f: Math.round((kcal * f) / 9) };
};

// --- 4. EXPORTED API ---

export const getWorkoutPlan = (category, weight, height, preferences = {}) => {
    const { workoutLocation = 'gym', fitnessLevel = 'intermediate', goalType = 'maintenance' } = preferences;
    const bmiValue = weight && height ? (weight / Math.pow(height / 100, 2)) : 22;
    const bmi = getNearestBMILevel(bmiValue);

    const loc = workoutLocation.charAt(0).toUpperCase() + workoutLocation.slice(1).toLowerCase();
    const lv = fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1).toLowerCase();

    let goal = 'Endurance';
    if (goalType === 'weight-loss') goal = 'Weight Loss';
    else if (goalType === 'weight-gain') goal = 'Weight Gain';
    else if (goalType === 'muscle-building') goal = 'Muscle Gain';

    const planData = workoutEncyclopedia[bmi][`${loc}_${lv}_${goal}`];

    // Index mapping for visibility
    const bmiIdx = BMI_LEVELS.indexOf(bmi);
    const locIdx = loc === 'Home' ? 0 : 1;
    const lvIdx = ['Beginner', 'Intermediate', 'Advanced'].indexOf(lv);
    const goalIdx = ['Weight Loss', 'Weight Gain', 'Endurance', 'Muscle Gain'].indexOf(goal);
    const planNo = (bmiIdx * 24) + (locIdx * 12) + (lvIdx * 4) + goalIdx + 1;

    return {
        goal: `${goal} Program - Encyclopedia Plan #${planNo}`,
        frequency: '5 days per week',
        routine: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => ({
            day, focus: goal, exercises: planData.exercises.map(ex => `${ex}: ${planData.structure.setsReps}`)
        })),
        tips: [
            `Structure: ${planData.structure.setsReps} | ${planData.structure.rest}`,
            `Progression: ${planData.structure.progression}`,
            `BMI Level alignment: ${bmi}`
        ]
    };
};

export const getDietPlan = (category, weight, height, preferences = {}) => {
    const { goalType = 'maintenance', dietaryRestrictions = [] } = preferences;
    const bmiValue = weight && height ? (weight / Math.pow(height / 100, 2)) : 22;
    const bmi = getNearestBMILevel(bmiValue);

    let goal = 'Endurance';
    if (goalType === 'weight-loss') goal = 'Fat Loss';
    else if (goalType === 'weight-gain') goal = 'Weight Gain';
    else if (goalType === 'muscle-building') goal = 'Muscle Building';

    // 2. Resolve Diet Type (use Standard if no restrictions)
    let type = 'Standard';
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        const valid = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];
        for (const r of dietaryRestrictions) {
            if (valid.includes(r)) {
                type = r;
                break;
            }
        }
    }

    const stats = getDietKcalData(bmi, goal);
    const meals = DIET_TEMPLATES[type];

    // Diet Index Logic (13 BMI * 20 combo per BMI)
    const bmiIdx = BMI_LEVELS.indexOf(bmi);
    const goalIdx = ['Muscle Building', 'Fat Loss', 'Endurance', 'Weight Gain'].indexOf(goal);
    const dietIdx = DIET_TYPES.indexOf(type);
    const planNo = (bmiIdx * 20) + (goalIdx * 5) + dietIdx + 1;

    return {
        goal: `${goal} (${type === 'Standard' ? 'Balanced' : type}) - Encyclopedia Plan #${planNo}`,
        dailyCalories: stats.kcal,
        macros: { p: `${stats.p}g`, c: `${stats.c}g`, f: `${stats.f}g` },
        meals: meals.map((item, i) => ({
            meal: i === 0 ? 'Breakfast' : i === 2 ? 'Lunch' : i === 4 ? `Dinner` : `Snack ${i === 1 ? 1 : i === 3 ? 2 : 3}`,
            time: ['08:00', '10:30', '13:00', '16:00', '18:30', '21:00'][i],
            items: [item],
            calories: Math.round(stats.kcal / 6)
        })),
        tips: [
            `Balanced for BMI Level ${bmi}`,
            `Macros: Protein ${stats.p}g | Carbs ${stats.c}g | Fats ${stats.f}g`,
            'Follow a strict 6-meal structure as per Encyclopedia.'
        ]
    };
};
