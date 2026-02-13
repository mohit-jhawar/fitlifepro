/**
 * FITNESS & NUTRITION ENCYCLOPEDIA
 * Advanced 4-Week Progressive Programming
 */

// --- 1. SHARED UTILS ---
const BMI_LEVELS = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

export const getNearestBMILevel = (bmi) => {
    if (!bmi) return 22;
    return BMI_LEVELS.reduce((prev, curr) => {
        return Math.abs(curr - bmi) < Math.abs(prev - bmi) ? curr : prev;
    });
};

// --- 2. STATIC PLANS DATABASE ---
const STATIC_PLANS = [
    {
        "inputSummary": {
            "bmiCategory": "Underweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Beginner single muscle group per day allows mastery of movement patterns and adequate recovery. 6-day frequency ensures each major muscle group is trained twice per week for optimal hypertrophy in underweight individuals.",
            "whyThisVolume": "8-10 sets per muscle per week distributed across 2 sessions. Conservative volume allows neural adaptation while building work capacity for underweight trainees who may have limited training history.",
            "whyThisExerciseSelection": "Home-based bodyweight and dumbbell exercises emphasize compound movements to maximize muscle recruitment. Focus on calorie-efficient exercises that build mass across multiple muscle groups.",
            "progressionStrategy": "Increase reps from 8 to 12, then add resistance (weighted vest, heavier dumbbells). Progress tempo (3-1-3) for increased time under tension. Add 1 set every 2 weeks until reaching intermediate volume."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR (reps in reserve)",
                        "reasonIncluded": "Foundational pressing movement, scalable difficulty, builds baseline upper body strength"
                    },
                    {
                        "name": "Dumbbell Floor Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pressing without bench, protects shoulders, allows progressive overload with dumbbells"
                    },
                    {
                        "name": "Incline Push-ups",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Targets upper chest, easier variation for volume accumulation"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Dumbbell Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary horizontal pulling movement, builds lat width and thickness"
                    },
                    {
                        "name": "Reverse Snow Angels (floor)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Scapular retraction and rear delt development, improves posture"
                    },
                    {
                        "name": "Superman Holds",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "20-30 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Lower back and erector engagement, core stability for compound lifts"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Goblet Squats",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Teaches squat pattern, loads quads and glutes, scalable with dumbbell weight"
                    },
                    {
                        "name": "Bulgarian Split Squats",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral leg development, addresses imbalances, high glute activation"
                    },
                    {
                        "name": "Romanian Deadlifts (Dumbbell)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring and glute hypertrophy, hip hinge pattern development"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Dumbbell Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary overhead pressing for deltoid mass and strength"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Isolates medial deltoid for shoulder width"
                    },
                    {
                        "name": "Pike Push-ups",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bodyweight overhead pressing variation, anterior deltoid emphasis"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Dumbbell Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct bicep stimulation, fundamental curl pattern"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Long head tricep stretch and activation"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Brachialis and brachioradialis development for arm thickness"
                    },
                    {
                        "name": "Diamond Push-ups",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "8-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Tricep-focused pressing movement using bodyweight"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
                "exercises": [
                    {
                        "name": "Reverse Lunges",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Knee-friendly lunge variation, quad and glute development"
                    },
                    {
                        "name": "Glute Bridges",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Glute isolation, hip extension strength"
                    },
                    {
                        "name": "Single-Leg Romanian Deadlifts",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral hamstring work, balance and stability"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Gastrocnemius development for lower leg mass"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Underweight",
            "trainingLocation": "Gym",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group focus allows beginners to learn proper barbell and machine technique. 6-day frequency with gym equipment accelerates muscle gain through optimal protein synthesis frequency.",
            "whyThisVolume": "8-12 sets per muscle per week. Gym equipment allows heavier loading than home training, stimulating greater mechanical tension for underweight individuals seeking mass gain.",
            "whyThisExerciseSelection": "Compound barbell movements form the foundation (squat, bench, deadlift variations). Machines provide stability for isolation work. Exercise selection prioritizes movements that allow progressive overload tracking.",
            "progressionStrategy": "Linear progression: add 2.5-5lbs per week to compound lifts. Track all lifts in logbook. Increase reps before adding weight. Deload every 4th week by reducing volume 40%."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Barbell Bench Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "King of chest exercises, allows heaviest loading, maximum mechanical tension"
                    },
                    {
                        "name": "Incline Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest development, greater ROM than barbell, unilateral stability"
                    },
                    {
                        "name": "Cable Flyes",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension on pectorals, metabolic stress stimulus"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Conventional Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full posterior chain development, highest testosterone response, total body mass builder"
                    },
                    {
                        "name": "Lat Pulldown",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling for lat width, progression toward pull-ups"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pulling for mid-back thickness, constant tension"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Barbell Back Squat",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "King of leg exercises, maximum lower body mass development, hormonal response"
                    },
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-volume quad work without spinal loading, allows heavy weight safely"
                    },
                    {
                        "name": "Lying Leg Curl",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct hamstring isolation, knee flexion strength, injury prevention"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Barbell Overhead Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary overhead pressing movement, full deltoid development, core stability"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear deltoid and upper back health, shoulder stability, posture"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Barbell Curl",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Heaviest bicep loading possible, maximum tension on biceps brachii"
                    },
                    {
                        "name": "Close-Grip Bench Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Tricep mass builder, allows heavy weight, compound pressing pattern"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension on triceps, elbow extension isolation"
                    },
                    {
                        "name": "Incline Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Bicep long head stretch, varied stimulus angle"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Front Squat",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Quad-dominant squat variation, upper back strength, different stimulus than back squat"
                    },
                    {
                        "name": "Romanian Deadlift",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring and glute hypertrophy without back fatigue from conventional deadlifts"
                    },
                    {
                        "name": "Leg Extensions",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Quad isolation, knee extension strength, pump and metabolic stress"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development, complements standing calf work"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Normal",
            "trainingLocation": "Home",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Intermediate level uses 2 muscle groups per day for increased volume and training efficiency. Push/Pull/Legs split repeated twice weekly optimizes recovery and protein synthesis for normal BMI individuals.",
            "whyThisVolume": "12-16 sets per muscle per week. Intermediate trainees can handle higher volumes with proper recovery. Home equipment requires creative exercise selection to achieve adequate volume.",
            "whyThisExerciseSelection": "Advanced bodyweight progressions (tempo, pauses, isometric holds) combined with dumbbell work. Exercise variety prevents adaptation and maintains stimulus despite limited equipment.",
            "progressionStrategy": "Double progression: increase reps to top of range, then add load or difficulty. Incorporate tempo manipulation (4-0-1 eccentric emphasis). Add pauses and isometric holds. Progress to single-arm/leg variations."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push (Chest + Shoulders)",
                "muscleGroups": ["Pectorals", "Anterior/Medial Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Decline Push-ups (feet elevated)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR, add weight vest if needed",
                        "reasonIncluded": "Increased load on upper chest and shoulders vs regular push-ups"
                    },
                    {
                        "name": "Dumbbell Floor Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pressing for chest mass"
                    },
                    {
                        "name": "Pike Push-ups (feet elevated)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Progressive overhead pressing for deltoid development"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep long head emphasis, completes push day"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Pull-up or Inverted Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR, add weight if doing 10+ reps",
                        "reasonIncluded": "Primary vertical pulling movement for lat development"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pull, unilateral work prevents imbalances"
                    },
                    {
                        "name": "Dumbbell Pullovers",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lat stretch and serratus engagement, unique stimulus"
                    },
                    {
                        "name": "Dumbbell Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct bicep work for arm development"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis and forearm thickness"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Bulgarian Split Squats",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary unilateral leg builder, high quad and glute activation"
                    },
                    {
                        "name": "Goblet Squats (tempo 3-0-1)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bilateral quad work with tempo for increased TUT"
                    },
                    {
                        "name": "Single-Leg Romanian Deadlifts",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral hamstring and glute work, balance component"
                    },
                    {
                        "name": "Nordic Curls (eccentric focus)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "4-6",
                        "restSeconds": "90",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Eccentric hamstring strength, injury prevention, unique stimulus"
                    },
                    {
                        "name": "Single-Leg Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral calf development for balance and size"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push (Chest + Shoulders)",
                "muscleGroups": ["Pectorals", "Anterior/Medial Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Archer Push-ups",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8 per side",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced push-up variation with unilateral emphasis, progression toward one-arm push-ups"
                    },
                    {
                        "name": "Dumbbell Incline Press (on stability ball)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest focus with stability challenge"
                    },
                    {
                        "name": "Dumbbell Arnold Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full deltoid rotation and engagement through extended ROM"
                    },
                    {
                        "name": "Dumbbell Front Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Anterior deltoid isolation, complements pressing"
                    },
                    {
                        "name": "Diamond Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Tricep-focused pressing for arm development"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Weighted Pull-ups or Inverted Rows (tempo 3-0-3)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy vertical pulling with tempo manipulation"
                    },
                    {
                        "name": "Bent-Over Dumbbell Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bilateral horizontal pulling for back thickness"
                    },
                    {
                        "name": "Renegade Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 per side",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Anti-rotation core work with pulling pattern"
                    },
                    {
                        "name": "Zottman Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Biceps and forearm development with rotation component"
                    },
                    {
                        "name": "Concentration Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Peak bicep contraction, isolation finish"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Pistol Squats (assisted if needed)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "5-8 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced unilateral strength, full quad engagement"
                    },
                    {
                        "name": "Dumbbell Step-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Functional leg power, glute activation"
                    },
                    {
                        "name": "Dumbbell Romanian Deadlifts (single-leg progression)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring volume accumulation"
                    },
                    {
                        "name": "Glute-Ham Raises (or Nordic Curl negatives)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "6-8",
                        "restSeconds": "90",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Advanced hamstring exercise, eccentric strength"
                    },
                    {
                        "name": "Seated Calf Raises (dumbbell on knees)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus focus for complete calf development"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Normal",
            "trainingLocation": "Gym",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Classic Push/Pull/Legs split run twice weekly. Intermediate lifters benefit from 2x frequency per muscle group for optimal hypertrophy. Gym access allows optimal exercise variety and loading.",
            "whyThisVolume": "14-16 sets per muscle per week. Normal BMI with gym access supports higher volume training. Volume split across 2 sessions per muscle group per week optimizes recovery.",
            "whyThisExerciseSelection": "Combination of heavy compound lifts (3-6 rep range) and hypertrophy-focused accessories (8-15 reps). Machines provide stability for pushing intensity safely. Free weights for functional strength.",
            "progressionStrategy": "Wave loading on compounds: Week 1-3 linear progression, Week 4 deload. Use RPE 7-8 on main lifts. Add reps/weight when hitting top of rep range for 2 consecutive sessions. Periodize intensity every 4 weeks."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Barbell Bench Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary horizontal pressing for chest and tricep mass"
                    },
                    {
                        "name": "Incline Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest development with greater ROM than barbell"
                    },
                    {
                        "name": "Standing Barbell Overhead Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy overhead pressing for anterior and medial deltoid strength"
                    },
                    {
                        "name": "Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension on medial deltoid for width"
                    },
                    {
                        "name": "Rope Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lateral head tricep isolation with cable tension"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Conventional Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Total posterior chain development, maximum back thickness"
                    },
                    {
                        "name": "Weighted Pull-ups",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling for lat width and upper back strength"
                    },
                    {
                        "name": "Barbell Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pulling for mid-back thickness"
                    },
                    {
                        "name": "Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear deltoid and upper back health, shoulder stability"
                    },
                    {
                        "name": "Barbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Heavy bicep loading for mass"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Barbell Back Squat",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary leg mass builder, maximum lower body strength"
                    },
                    {
                        "name": "Romanian Deadlift",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring and glute hypertrophy without back fatigue"
                    },
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-volume quad work without spinal compression"
                    },
                    {
                        "name": "Lying Leg Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Hamstring isolation for complete posterior chain development"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Gastrocnemius development for lower leg size"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Incline Barbell Bench Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest emphasis with heavy loading"
                    },
                    {
                        "name": "Machine Chest Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Stable pressing platform for pushing intensity safely"
                    },
                    {
                        "name": "Seated Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Deltoid hypertrophy with bilateral loading"
                    },
                    {
                        "name": "Cable Rear Delt Flyes",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Posterior deltoid balance and shoulder health"
                    },
                    {
                        "name": "Overhead Cable Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Long head tricep emphasis under constant tension"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Lat Pulldown (wide grip)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling volume for lat width"
                    },
                    {
                        "name": "T-Bar Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pull with supported position for back thickness"
                    },
                    {
                        "name": "Straight-Arm Pulldowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lat isolation without bicep involvement"
                    },
                    {
                        "name": "Incline Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Bicep long head stretch and activation"
                    },
                    {
                        "name": "Cable Hammer Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis development and forearm thickness"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Front Squat",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Quad-dominant squat variation with upper back engagement"
                    },
                    {
                        "name": "Walking Lunges (barbell)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral leg work with dynamic stability component"
                    },
                    {
                        "name": "Leg Extensions",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Quad isolation for complete development"
                    },
                    {
                        "name": "Seated Leg Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Different hamstring angle than lying variation"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus targeting for complete calf development"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Overweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day for beginners with 6-day frequency allows high movement frequency for skill acquisition while keeping individual session stress low. Critical for overweight individuals who may have joint concerns.",
            "whyThisVolume": "8-10 sets per muscle per week. Conservative volume allows adaptation without excessive fatigue. Overweight individuals benefit from frequent, lower-volume sessions to manage recovery and joint stress.",
            "whyThisExerciseSelection": "Joint-friendly exercises prioritized. Bodyweight progressions scaled to current capacity. Emphasis on controlled tempos and stability. Avoiding high-impact movements that stress knees and ankles.",
            "progressionStrategy": "Master movement quality first. Progress: bodyweight → tempo manipulation → partial ROM → full ROM → added resistance. Focus on 3-second eccentrics for joint safety. Increase difficulty when form is perfect for 12+ reps."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Incline Push-ups (hands elevated)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR, focus on control",
                        "reasonIncluded": "Reduced load on shoulder joints, scalable progression, builds pressing foundation"
                    },
                    {
                        "name": "Dumbbell Floor Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Limited ROM protects shoulders, stable pressing platform"
                    },
                    {
                        "name": "Wall Push-ups",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Very low load chest activation, perfect for building work capacity"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Supported Dumbbell Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Removes lower back stress, allows focus on back muscles, unilateral work"
                    },
                    {
                        "name": "Inverted Rows (elevated bar, knees bent)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "6-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Scalable bodyweight pull, horizontal pulling pattern, joint-friendly"
                    },
                    {
                        "name": "Prone Y-Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Scapular stability, upper back activation, posture improvement"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Box Squats (or chair squats)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Depth control, reduces knee stress, builds confidence in squat pattern"
                    },
                    {
                        "name": "Glute Bridges",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "No knee stress, glute activation, hip extension strength"
                    },
                    {
                        "name": "Wall Sit",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 seconds",
                        "restSeconds": "90",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Isometric quad strength, joint-friendly, builds endurance"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Lower leg development, simple movement pattern"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Seated Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Seated position reduces core/balance demands, shoulder development"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Medial deltoid isolation, light weight suitable for beginners"
                    },
                    {
                        "name": "Band Pull-Aparts",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear deltoid and scapular health, very joint-friendly"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Seated Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eliminates momentum, isolated bicep work"
                    },
                    {
                        "name": "Overhead Dumbbell Tricep Extension (seated)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Seated stability, tricep long head stretch"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Brachialis and forearm work, joint-friendly grip"
                    },
                    {
                        "name": "Bench Dips (feet on floor)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "8-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bodyweight tricep work, scalable by foot position"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Step-ups (low box)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral leg work, scalable height, functional movement"
                    },
                    {
                        "name": "Dumbbell Deadlifts (Romanian style)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Hip hinge pattern with light weight, hamstring engagement"
                    },
                    {
                        "name": "Lying Leg Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Core engagement without spinal loading"
                    },
                    {
                        "name": "Seated Calf Raises (dumbbell on knees)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Soleus development, seated reduces balance demands"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Overweight",
            "trainingLocation": "Gym",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Upper/Lower split repeated 3x weekly allows optimal frequency for intermediate lifters while managing fatigue. For overweight individuals, splitting upper and lower reduces per-session joint stress while maintaining adequate volume.",
            "whyThisVolume": "12-14 sets per muscle per week. Moderate-high volume appropriate for intermediate level but adjusted downward slightly to account for increased recovery demands in overweight individuals.",
            "whyThisExerciseSelection": "Machine emphasis reduces stabilization demands and joint stress. Compound movements selected for reduced impact (e.g., leg press over back squat). Includes more seated/supported variations to manage systemic fatigue.",
            "progressionStrategy": "Progressive overload via controlled increases: +5lbs upper body compounds every 2 weeks, +10lbs lower body when hitting 12 reps for 2 sessions. Emphasize rest periods (fully recover). RPE 7-8 maximum to prevent overreaching."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Upper Body A (Horizontal Push/Pull Focus)",
                "muscleGroups": ["Chest", "Back", "Shoulders", "Arms"],
                "exercises": [
                    {
                        "name": "Chest Press Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Stable pressing platform reduces shoulder stress, allows progressive loading safely"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Supported horizontal pull, constant tension, spares lower back"
                    },
                    {
                        "name": "Dumbbell Incline Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest work with free weight pattern, moderate loading"
                    },
                    {
                        "name": "Lat Pulldown (neutral grip)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pull without bodyweight stress, shoulder-friendly grip"
                    },
                    {
                        "name": "Machine Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Deltoid isolation with fixed movement path"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Lower Body A (Quad Emphasis)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
                "exercises": [
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary lower body builder without spinal loading, accommodates body position easily"
                    },
                    {
                        "name": "Machine Leg Extensions",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct quad isolation, allows control of knee stress through weight selection"
                    },
                    {
                        "name": "Seated Leg Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Hamstring development in supported position"
                    },
                    {
                        "name": "Hip Abduction Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Glute medius strength for hip stability and injury prevention"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development without balance demands"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Upper Body B (Vertical Push/Pull Focus)",
                "muscleGroups": ["Shoulders", "Back", "Chest", "Arms"],
                "exercises": [
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Overhead pressing with stable seated platform, reduces core demands"
                    },
                    {
                        "name": "Assisted Pull-ups or Lat Pulldown",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling scaled to current strength, lat width development"
                    },
                    {
                        "name": "Pec Deck Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Chest fly movement without shoulder instability concerns"
                    },
                    {
                        "name": "Cable Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear deltoid and rotator cuff health, posture correction"
                    },
                    {
                        "name": "Cable Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension bicep work"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Lower Body B (Hip Hinge Emphasis)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps", "Lower Back"],
                "exercises": [
                    {
                        "name": "Trap Bar Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hip hinge with reduced lower back stress vs conventional, more upright position"
                    },
                    {
                        "name": "Leg Press (high foot placement)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Glute and hamstring emphasis through foot position"
                    },
                    {
                        "name": "Lying Leg Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Different hamstring angle than seated variation"
                    },
                    {
                        "name": "Machine Hip Adduction",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Inner thigh strength, hip stability, complements abduction work"
                    },
                    {
                        "name": "Standing Calf Raises (machine)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Gastrocnemius development with machine support"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Upper Body C (Arm/Delt Emphasis)",
                "muscleGroups": ["Arms", "Shoulders", "Chest", "Back"],
                "exercises": [
                    {
                        "name": "Machine Chest Flye",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Pec isolation without elbow stress"
                    },
                    {
                        "name": "Seated Cable Rows (wide grip)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Back width focus with grip variation"
                    },
                    {
                        "name": "Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Medial deltoid volume under constant tension"
                    },
                    {
                        "name": "EZ-Bar Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Wrist-friendly curl variation, allows heavier loading than dumbbells"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lateral tricep head emphasis, constant tension"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Lower Body C (High Rep Metabolic)",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Hack Squat Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Supported squat pattern, reduced spinal loading, quad focus"
                    },
                    {
                        "name": "Smith Machine Romanian Deadlift",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled bar path, hamstring stretch, stability assistance"
                    },
                    {
                        "name": "Goblet Squats",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "High rep metabolic work, torso upright, joint-friendly"
                    },
                    {
                        "name": "Glute-Ham Developer or Back Extensions",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Posterior chain strength without heavy loading"
                    },
                    {
                        "name": "Calf Press on Leg Press",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "High rep calf work using leg press apparatus"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Obese",
            "trainingLocation": "Home",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day with 6-day frequency provides maximum distribution of training stress. For obese beginners, this minimizes per-session fatigue while building consistent exercise habits and movement competency.",
            "whyThisVolume": "6-8 sets per muscle per week. Very conservative volume prioritizes form mastery, joint health, and sustainable progression. Focus is on establishing routine and building work capacity gradually.",
            "whyThisExerciseSelection": "Exclusively low-impact, joint-protective exercises. Seated and supported variations dominate. No jumping, running, or high-impact movements. Bodyweight exercises scaled significantly. Equipment needs minimal (chair, light dumbbells, resistance bands).",
            "progressionStrategy": "Form-first approach: 4 weeks perfecting movement patterns before adding any resistance. Progress by increasing reps (8→12→15), then time under tension (add 1-2 second pauses), then finally light resistance. Rest as needed between sets (90-180 seconds)."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Wall Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "3-4 RIR, focus on full ROM and control",
                        "reasonIncluded": "Minimal joint load, teaches pressing pattern, completely scalable by body angle"
                    },
                    {
                        "name": "Seated Dumbbell Chest Press (very light)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "3 RIR",
                        "reasonIncluded": "Supported position eliminates balance concerns, allows focus on chest contraction"
                    },
                    {
                        "name": "Resistance Band Chest Press",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Light resistance, constant tension, extremely joint-friendly"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids"],
                "exercises": [
                    {
                        "name": "Seated Resistance Band Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Supported seated position, scalable resistance, teaches rowing pattern"
                    },
                    {
                        "name": "Wall Slides",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "Focus on scapular movement",
                        "reasonIncluded": "Scapular mobility and activation, posture correction, zero load"
                    },
                    {
                        "name": "Prone I-Y-T Raises (on bed/bench)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "8-10 each position",
                        "restSeconds": "60",
                        "intensityGuideline": "Bodyweight only",
                        "reasonIncluded": "Upper back activation without standing or load, shoulder health"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes"],
                "exercises": [
                    {
                        "name": "Chair Sit-to-Stands",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "3 RIR, use arms if needed",
                        "reasonIncluded": "Functional movement, teaches squat pattern, completely safe, scalable by chair height"
                    },
                    {
                        "name": "Wall Sit",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-30 seconds",
                        "restSeconds": "90",
                        "intensityGuideline": "Until moderate burn",
                        "reasonIncluded": "Isometric quad strength, no dynamic load on joints"
                    },
                    {
                        "name": "Seated Marches",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "20 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "Controlled tempo",
                        "reasonIncluded": "Hip flexor activation, core engagement, zero impact"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower leg strength without standing balance demands"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Seated Resistance Band Overhead Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Light overhead pressing in stable position"
                    },
                    {
                        "name": "Seated Dumbbell Lateral Raises (very light)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Shoulder width development with minimal weight, seated eliminates compensation"
                    },
                    {
                        "name": "Resistance Band Face Pulls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "Light resistance",
                        "reasonIncluded": "Rear delt and upper back, posture, extremely safe"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Seated Dumbbell Curls (light)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Isolated bicep work without momentum or standing fatigue"
                    },
                    {
                        "name": "Seated Overhead Dumbbell Tricep Extension (light)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Tricep development in stable, supported position"
                    },
                    {
                        "name": "Resistance Band Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Additional bicep volume with minimal equipment"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Core & Light Movement",
                "muscleGroups": ["Core", "Full Body"],
                "exercises": [
                    {
                        "name": "Seated Knee Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Core activation without spinal loading"
                    },
                    {
                        "name": "Dead Bugs (modified if needed)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-10 per side",
                        "restSeconds": "60",
                        "intensityGuideline": "Focus on control",
                        "reasonIncluded": "Core stability and coordination, completely safe"
                    },
                    {
                        "name": "Seated Torso Rotations",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15 per side",
                        "restSeconds": "60",
                        "intensityGuideline": "Light movement",
                        "reasonIncluded": "Rotational mobility, gentle core engagement"
                    },
                    {
                        "name": "Gentle Full Body Stretching",
                        "type": "Isolation",
                        "sets": "1",
                        "reps": "5-10 minutes",
                        "restSeconds": "N/A",
                        "intensityGuideline": "Comfortable stretch, never pain",
                        "reasonIncluded": "Mobility maintenance, recovery, mind-body connection"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Obese",
            "trainingLocation": "Gym",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Upper/Lower split repeated 3x weekly. Intermediate obese individuals can handle split routines but benefit from distributing stress across multiple sessions. Upper/lower split prevents excessive lower body fatigue common with PPL variations.",
            "whyThisVolume": "10-12 sets per muscle per week. Below typical intermediate volume to account for higher recovery demands. Gym machines allow higher intensity with lower injury risk than home training.",
            "whyThisExerciseSelection": "Heavy machine bias (70% machines, 30% free weights). Machines provide stability and reduce injury risk for heavier individuals. Selected exercises minimize joint compression and allow safe progressive overload. Seated variations prioritized.",
            "progressionStrategy": "Machine-focused linear progression: add 5-10lbs when achieving 12 reps for 2 consecutive sessions. Emphasize full rest periods (minimum). Use RPE 7-8 maximum. Deload every 4th week (reduce volume 50%). Track all workouts for accountability."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Upper Body A (Push Emphasis)",
                "muscleGroups": ["Chest", "Shoulders", "Triceps", "Back"],
                "exercises": [
                    {
                        "name": "Chest Press Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Stable pressing platform, accommodates body position, progressive overload without shoulder stress"
                    },
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Overhead pressing with back support, removes core stability demands"
                    },
                    {
                        "name": "Assisted Dip Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Tricep and chest development with adjustable assistance"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pulling without lower back fatigue"
                    },
                    {
                        "name": "Machine Lateral Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Deltoid isolation with guided movement path"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Lower Body A (Quad Focus)",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
                "exercises": [
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary lower body developer, no spinal compression, seat accommodates larger body sizes"
                    },
                    {
                        "name": "Leg Extension Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct quad isolation, controlled knee stress"
                    },
                    {
                        "name": "Seated Leg Curl Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Hamstring development in supported position"
                    },
                    {
                        "name": "Hip Abduction Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Glute medius strength for hip and knee stability"
                    },
                    {
                        "name": "Seated Calf Raise Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development without balance concerns"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Upper Body B (Pull Emphasis)",
                "muscleGroups": ["Back", "Biceps", "Rear Delts"],
                "exercises": [
                    {
                        "name": "Lat Pulldown Machine (wide grip)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling without bodyweight load, lat width development"
                    },
                    {
                        "name": "Chest-Supported Row Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eliminates lower back stress completely, allows heavy loading safely"
                    },
                    {
                        "name": "Machine Rear Delt Flye",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Posterior deltoid isolation, posture correction"
                    },
                    {
                        "name": "Cable Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Constant tension bicep work"
                    },
                    {
                        "name": "Cable Face Pulls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rotator cuff health, upper back thickness"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Lower Body B (Hip Hinge Focus)",
                "muscleGroups": ["Hamstrings", "Glutes", "Lower Back"],
                "exercises": [
                    {
                        "name": "Smith Machine Romanian Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled bar path for hip hinge, reduced balance demands, teaches deadlift pattern safely"
                    },
                    {
                        "name": "Lying Leg Curl Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Different hamstring angle than seated, prone position comfortable"
                    },
                    {
                        "name": "Hip Thrust Machine or Glute Drive",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum glute activation without back stress"
                    },
                    {
                        "name": "Hip Adduction Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Inner thigh strength, hip stability balance"
                    },
                    {
                        "name": "Standing Calf Raise Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Gastrocnemius development with machine support"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Upper Body C (Balanced)",
                "muscleGroups": ["Chest", "Back", "Shoulders", "Arms"],
                "exercises": [
                    {
                        "name": "Incline Chest Press Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest focus with machine stability"
                    },
                    {
                        "name": "Lat Pulldown (neutral grip)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Shoulder-friendly vertical pull variation"
                    },
                    {
                        "name": "Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension medial deltoid work"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Elbow-friendly tricep isolation"
                    },
                    {
                        "name": "Machine Preacher Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Supported bicep work, eliminates momentum"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Lower Body C (High Rep/Metabolic)",
                "muscleGroups": ["Full Lower Body"],
                "exercises": [
                    {
                        "name": "Leg Press (moderate weight, higher reps)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Metabolic lower body work, maintains strength with reduced load"
                    },
                    {
                        "name": "Goblet Squat (light)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full ROM squat pattern with light loading"
                    },
                    {
                        "name": "Leg Extension (single leg)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral quad work, addresses imbalances"
                    },
                    {
                        "name": "Leg Curl (single leg)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral hamstring work"
                    },
                    {
                        "name": "Calf Press on Leg Press",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "High volume calf work for endurance and size"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Normal",
            "trainingLocation": "Gym",
            "fitnessLevel": "Advanced",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Arnold split (Chest/Back, Shoulders/Arms, Legs) run twice weekly. Advanced trainees benefit from antagonist supersets and higher frequency per muscle group. This split allows maximum volume and intensity per session.",
            "whyThisVolume": "16-20 sets per muscle per week. Advanced normal-BMI individuals can recover from and benefit from high volumes. Each muscle trained 2x weekly with varied rep ranges and exercise selection.",
            "whyThisExerciseSelection": "Advanced variations and techniques: paused reps, tempo manipulation, cluster sets, partial reps. Includes less common but highly effective exercises. Mix of strength (4-6 reps), hypertrophy (8-12), and metabolic (15-20) ranges.",
            "progressionStrategy": "Undulating periodization: vary intensity weekly (Heavy/Moderate/Light). Use advanced techniques: rest-pause sets, drop sets on final set, mechanical drop sets. Auto-regulate using RPE 8-9. Deload every 5th week. Track volume landmarks and progressive overload metrics."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest + Back",
                "muscleGroups": ["Pectorals", "Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Barbell Bench Press (paused reps)",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "4-6",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR, 2-second pause at chest",
                        "reasonIncluded": "Maximum chest and tricep strength development with pause eliminating stretch reflex"
                    },
                    {
                        "name": "Weighted Pull-ups (tempo 3-0-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Heavy vertical pull with eccentric emphasis for lat development"
                    },
                    {
                        "name": "Incline Dumbbell Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest hypertrophy with greater ROM than barbell"
                    },
                    {
                        "name": "Pendlay Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Explosive horizontal pull from dead stop, back thickness and power"
                    },
                    {
                        "name": "Cable Flyes (high, mid, low)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR, mechanical drop set",
                        "reasonIncluded": "Three angles hit entire pectoral complex, constant tension"
                    },
                    {
                        "name": "Chest-Supported T-Bar Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Mid-back thickness without lower back fatigue"
                    },
                    {
                        "name": "Straight-Arm Cable Pulldowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lat isolation and stretch, finisher with metabolic stress"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Shoulders + Arms",
                "muscleGroups": ["Deltoids", "Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Standing Barbell Overhead Press",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "5-7",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum overhead pressing strength, full-body tension and stability"
                    },
                    {
                        "name": "Weighted Dips (chest-focused lean)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy tricep and lower chest development"
                    },
                    {
                        "name": "Arnold Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full deltoid rotation through extended ROM"
                    },
                    {
                        "name": "Lu Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unique medial and anterior delt stimulus from Chinese weightlifting, builds overhead strength"
                    },
                    {
                        "name": "Bayesian Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Leaning away from cable provides resistance curve matching medial delt strength curve"
                    },
                    {
                        "name": "Barbell Drag Curls",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Emphasizes long head bicep by keeping bar close to body, reduces front delt involvement"
                    },
                    {
                        "name": "JM Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hybrid between close-grip bench and skull crusher, maximum tricep overload"
                    },
                    {
                        "name": "Cable Overhead Tricep Extensions (rope)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR, drop set on final set",
                        "reasonIncluded": "Long head emphasis with constant tension, metabolic finisher"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quad Emphasis)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
                "exercises": [
                    {
                        "name": "High Bar Back Squat",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "4-6",
                        "restSeconds": "240",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum quad development and lower body strength, upright torso position"
                    },
                    {
                        "name": "Front Squat (tempo 3-0-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eccentric emphasis on quads with upright positioning"
                    },
                    {
                        "name": "Hatfield Squat (Safety Squat Bar)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Allows self-spotting with handles, quad emphasis without upper back stress"
                    },
                    {
                        "name": "Sissy Squats (weighted)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Advanced quad isolation with knee flexion emphasis, unique stimulus"
                    },
                    {
                        "name": "Leg Extensions (1.5 reps)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Extended time under tension through partial rep technique"
                    },
                    {
                        "name": "Nordic Curls",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Maximum eccentric hamstring strength, injury prevention"
                    },
                    {
                        "name": "Tibialis Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Anterior shin development, ankle health, often neglected muscle"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Chest + Back",
                "muscleGroups": ["Pectorals", "Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Deficit Push-ups (hands on plates, chest to floor)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR, weighted vest if needed",
                        "reasonIncluded": "Increased ROM for pec stretch, bodyweight pressing variation"
                    },
                    {
                        "name": "One-Arm Dumbbell Rows (Kroc style)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "15-20",
                        "restSeconds": "90",
                        "intensityGuideline": "1 RIR, allow controlled body English",
                        "reasonIncluded": "High rep back thickness work, grip and forearm development"
                    },
                    {
                        "name": "Guillotine Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bar to upper chest/neck increases pec stretch and upper chest activation"
                    },
                    {
                        "name": "Meadows Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per side",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Barbell landmine row with unilateral emphasis, unique pulling angle"
                    },
                    {
                        "name": "Pec Minor Dips (elbows tucked)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Targets often-neglected pec minor for complete chest development"
                    },
                    {
                        "name": "Kelso Shrugs",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Prone shrug variation eliminates momentum, pure trap contraction"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Shoulders + Arms",
                "muscleGroups": ["Deltoids", "Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Bradford Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Continuous tension overhead press (front to back), constant deltoid engagement"
                    },
                    {
                        "name": "Seated Behind-Neck Press (controlled ROM)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum medial and posterior deltoid engagement, requires shoulder mobility"
                    },
                    {
                        "name": "Powell Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lateral raise variation emphasizing medial delt peak contraction"
                    },
                    {
                        "name": "Rear Delt Cable Rows (elbows flared)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "High-rep rear delt volume with constant cable tension"
                    },
                    {
                        "name": "Bayesian Curls",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Cable curl while leaning away, provides resistance in stretched position"
                    },
                    {
                        "name": "Waiter Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Dumbbell held vertically targets bicep peak contraction and brachialis"
                    },
                    {
                        "name": "California Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Close-grip press lowered to upper chest, reduces shoulder stress vs skull crushers"
                    },
                    {
                        "name": "Cross-Body Cable Tricep Extensions",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15 per arm",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unique angle targets long head with constant tension"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Posterior Chain Emphasis)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps", "Calves"],
                "exercises": [
                    {
                        "name": "Sumo Deadlift",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "3-5",
                        "restSeconds": "240",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum posterior chain and glute development, wide stance variation"
                    },
                    {
                        "name": "Romanian Deadlift (deficit, standing on plates)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Increased hamstring stretch through greater ROM"
                    },
                    {
                        "name": "Barbell Hip Thrusts",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum glute activation and hypertrophy"
                    },
                    {
                        "name": "Walking Lunges (barbell)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Dynamic unilateral leg work with glute stretch emphasis"
                    },
                    {
                        "name": "Glute-Ham Raises",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR, weighted if needed",
                        "reasonIncluded": "Complete hamstring and glute development through full knee flexion to hip extension"
                    },
                    {
                        "name": "Single-Leg Press (1.5 reps)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral quad work with extended time under tension"
                    },
                    {
                        "name": "Seated Calf Raises (3-second pause at bottom)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus emphasis with pause for maximum stretch and contraction"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Underweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Advanced",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Push/Pull/Legs split twice weekly optimized for home training. Advanced underweight individuals need maximum muscle stimulus with limited equipment. High frequency (2x per muscle per week) supports mass gain goals.",
            "whyThisVolume": "18-20 sets per muscle per week. Higher end of advanced volume to maximize hypertrophy stimulus. Underweight trainees typically recover well and need high volume to overcome metabolic challenges.",
            "whyThisExerciseSelection": "Advanced bodyweight progressions, tempo work, and creative dumbbell exercises. Incorporates calisthenics strength skills (planche work, front lever progressions, pistol squat variations). Emphasizes compound movements for mass building.",
            "progressionStrategy": "Progressive difficulty: master one-arm/one-leg variations, add pauses/tempo, increase ROM, add external load. Pursue calisthenics milestones. Add 1-2 reps or 2.5-5lbs dumbbells weekly. Prioritize eating in surplus (500+ calorie surplus required)."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push A (Strength Focus)",
                "muscleGroups": ["Chest", "Shoulders", "Triceps"],
                "exercises": [
                    {
                        "name": "Pseudo Planche Push-ups",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "6-10",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Advanced horizontal pressing with shoulder protraction, progression toward planche"
                    },
                    {
                        "name": "Deficit Pike Push-ups (feet elevated, hands on parallettes)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum shoulder ROM and loading, progression toward handstand push-ups"
                    },
                    {
                        "name": "Single-Arm Dumbbell Floor Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral chest pressing with anti-rotation core demand"
                    },
                    {
                        "name": "Archer Push-ups (full ROM to sides)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 per side",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Single-arm push-up progression, lateral chest development"
                    },
                    {
                        "name": "Dumbbell Arnold Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full deltoid rotation through extended ROM"
                    },
                    {
                        "name": "Pike Push-ups (diamond hand position)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep-emphasized overhead pressing variation"
                    },
                    {
                        "name": "Dumbbell Skull Crushers (floor, elbows over head)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Maximum tricep stretch and long head activation"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull A (Strength Focus)",
                "muscleGroups": ["Back", "Biceps"],
                "exercises": [
                    {
                        "name": "Weighted Pull-ups (tempo 4-0-1)",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Heavy eccentric emphasis on vertical pulling, maximum lat engagement"
                    },
                    {
                        "name": "Front Lever Progressions (tuck/advanced tuck holds)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15 second holds",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Advanced horizontal pulling position, lat and core integration"
                    },
                    {
                        "name": "One-Arm Dumbbell Rows (Meadows style, perpendicular)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy unilateral pulling with unique angle for lat stretch"
                    },
                    {
                        "name": "Typewriter Pull-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "6-8 total",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Side-to-side pull-up variation, lat width and unilateral strength"
                    },
                    {
                        "name": "Dumbbell Pullovers (cross-bench)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum lat stretch with ribcage expansion"
                    },
                    {
                        "name": "Dumbbell Kroc Rows (high rep, controlled momentum)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "20-25 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Metabolic back work with grip and forearm emphasis"
                    },
                    {
                        "name": "Zottman Curls",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Biceps and forearm development with rotation component"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs A (Quad Emphasis)",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Pistol Squats (full ROM, weighted)",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "5-8 per leg",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum unilateral leg strength and quad development"
                    },
                    {
                        "name": "Bulgarian Split Squats (rear foot elevated, front foot forward)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Deep quad stretch and glute activation"
                    },
                    {
                        "name": "Dumbbell Goblet Squat (tempo 5-2-1)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Extended time under tension with eccentric emphasis"
                    },
                    {
                        "name": "Shrimp Squats",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced single-leg variation with posterior chain emphasis"
                    },
                    {
                        "name": "Nordic Curls (full ROM negatives)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Maximum eccentric hamstring overload"
                    },
                    {
                        "name": "Single-Leg Romanian Deadlifts (tempo 3-1-1)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral posterior chain with balance component"
                    },
                    {
                        "name": "Single-Leg Calf Raises (straight leg)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "15-20 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral gastrocnemius development"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push B (Hypertrophy Focus)",
                "muscleGroups": ["Chest", "Shoulders", "Triceps"],
                "exercises": [
                    {
                        "name": "Decline Push-ups (feet elevated 24+ inches)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR, add weight if needed",
                        "reasonIncluded": "Upper chest loading with metabolic emphasis"
                    },
                    {
                        "name": "Dumbbell Squeeze Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Constant inner pec tension from pressing dumbbells together"
                    },
                    {
                        "name": "Pike Push-ups to Downward Dog",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Shoulder pressing with dynamic ROM variation"
                    },
                    {
                        "name": "Dumbbell 6-Ways (front, lateral, rear raises circuit)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-10 per direction",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Complete deltoid development in single giant set"
                    },
                    {
                        "name": "Lalanne Push-ups (hands in prayer position)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Advanced tricep-emphasized push-up with narrow hand position"
                    },
                    {
                        "name": "Dumbbell Tate Press",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unique lateral tricep head emphasis, elbows flared"
                    },
                    {
                        "name": "Close-Grip Push-up Holds (bottom position)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Isometric tricep overload in stretched position"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull B (Hypertrophy Focus)",
                "muscleGroups": ["Back", "Biceps"],
                "exercises": [
                    {
                        "name": "Australian Pull-ups (feet elevated, tempo 3-1-3)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Horizontal pull with tempo for time under tension"
                    },
                    {
                        "name": "Commando Pull-ups",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 total (alternating sides)",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Parallel grip vertical pull with alternating sides for unilateral emphasis"
                    },
                    {
                        "name": "Renegade Rows (with push-up between reps)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Anti-rotation core with horizontal pulling, full body integration"
                    },
                    {
                        "name": "Dumbbell Seal Rows (lying face down on bench)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Eliminates lower back and momentum, pure lat and rhomboid contraction"
                    },
                    {
                        "name": "L-Sit Pull-ups or L-Sit Holds",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "5-8 or 15-20 sec holds",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Core and lat integration, gymnastic strength element"
                    },
                    {
                        "name": "Incline Dumbbell Curls (chest on incline bench)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum bicep stretch position"
                    },
                    {
                        "name": "Spider Curls (chest against bench)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Eliminates all momentum, constant tension on biceps"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs B (Posterior Chain Emphasis)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps"],
                "exercises": [
                    {
                        "name": "Single-Leg Dumbbell Deadlifts (deficit on plate)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Increased ROM for hamstring stretch, unilateral posterior chain"
                    },
                    {
                        "name": "Dumbbell Hip Thrusts (single leg)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Maximum unilateral glute activation"
                    },
                    {
                        "name": "Skater Squats",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Single-leg squat variation with posterior chain emphasis"
                    },
                    {
                        "name": "Glute-Ham Raises or Nordic Curl Eccentrics (5-second lower)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Slow eccentric for maximum hamstring damage and growth"
                    },
                    {
                        "name": "Dumbbell Walking Lunges (long stride)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High rep metabolic leg work with glute emphasis from stride length"
                    },
                    {
                        "name": "Copenhagen Planks",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 seconds per side",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Adductor strength and groin injury prevention"
                    },
                    {
                        "name": "Tibialis Raises + Seated Calf Raises (superset)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20 each",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Complete lower leg development, anterior and posterior"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Overweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Advanced",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Upper/Lower split 3x weekly allows high training frequency while managing joint stress. Advanced overweight trainees can handle volume but benefit from distributed sessions to minimize per-session fatigue and joint loading.",
            "whyThisVolume": "14-16 sets per muscle per week. Slightly reduced from typical advanced volume to account for recovery demands and joint considerations. Home equipment requires creative programming to achieve adequate volume.",
            "whyThisExerciseSelection": "Advanced bodyweight progressions with joint-protective modifications. Tempo work, isometric holds, and pause reps increase difficulty without additional load. Minimal impact on knees/ankles. Seated and supported variations where possible.",
            "progressionStrategy": "Increase difficulty through: (1) tempo manipulation (eccentric emphasis), (2) isometric holds, (3) range of motion progression, (4) unilateral work, (5) strategic weight addition. Focus on quality over quantity. Deload every 4th week."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Upper Body A (Push Emphasis)",
                "muscleGroups": ["Chest", "Shoulders", "Triceps", "Back"],
                "exercises": [
                    {
                        "name": "Decline Push-ups (tempo 4-1-2)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eccentric emphasis reduces joint impact while maximizing muscle tension"
                    },
                    {
                        "name": "Single-Arm Dumbbell Press (floor, alternating)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral pressing with anti-rotation core demand, limited ROM protects shoulders"
                    },
                    {
                        "name": "Seated Dumbbell Arnold Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Seated position reduces systemic fatigue, full deltoid rotation"
                    },
                    {
                        "name": "Inverted Rows (elevated feet, tempo 3-2-1)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pull with tempo for back development, bodyweight scaled to capacity"
                    },
                    {
                        "name": "Dumbbell Lateral Raises (seated, 21s protocol)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "7+7+7",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated stability, 21s method (partial reps) increases TUT without joint stress"
                    },
                    {
                        "name": "Dumbbell Skull Crushers (floor, slow eccentric)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep isolation with controlled eccentric, floor provides safety"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Lower Body A (Quad Emphasis)",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Bulgarian Split Squats (tempo 3-1-3)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Slow tempo increases muscle damage without additional load, unilateral work addresses imbalances"
                    },
                    {
                        "name": "Goblet Squats (1.5 rep method)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Extended TUT through partial reps, upright torso protects back"
                    },
                    {
                        "name": "Single-Leg Romanian Deadlifts (pause at bottom)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Pause eliminates momentum, maximum hamstring stretch and balance work"
                    },
                    {
                        "name": "Wall Sit (weighted)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "45-60 seconds",
                        "restSeconds": "90",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Isometric quad overload without joint impact"
                    },
                    {
                        "name": "Nordic Curl Negatives (5-second eccentric)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "5-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Eccentric hamstring strength without loading joints"
                    },
                    {
                        "name": "Single-Leg Calf Raises (3-second pause at top)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Isometric pause increases difficulty, unilateral addresses imbalances"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Upper Body B (Pull Emphasis)",
                "muscleGroups": ["Back", "Biceps", "Rear Delts"],
                "exercises": [
                    {
                        "name": "Pull-ups or Inverted Rows (weighted, tempo 4-0-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eccentric emphasis on vertical pull, scaled to current capacity"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows (Kroc style, controlled)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "High-rep back thickness work with slight body English allowed"
                    },
                    {
                        "name": "Dumbbell Pullovers (tempo 3-1-2)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lat stretch with slow tempo, minimal shoulder stress"
                    },
                    {
                        "name": "Face Pulls with Band (high volume)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear delt and upper back health, high reps for endurance and posture"
                    },
                    {
                        "name": "Dumbbell Hammer Curls (seated, alternating)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated eliminates momentum, brachialis emphasis"
                    },
                    {
                        "name": "Zottman Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Biceps and forearm development with rotation, unique stimulus"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Lower Body B (Posterior Chain)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps"],
                "exercises": [
                    {
                        "name": "Dumbbell Romanian Deadlifts (single-leg, pause)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral posterior chain with pause for maximum hamstring engagement"
                    },
                    {
                        "name": "Glute Bridge (single-leg, tempo 1-3-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "3-second squeeze at top maximizes glute contraction, unilateral work"
                    },
                    {
                        "name": "Step-ups (tempo 3-1-1, higher box)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled eccentric reduces knee stress, functional movement pattern"
                    },
                    {
                        "name": "Slider Leg Curls or Glute-Ham Raise Negatives",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring isolation using sliders or eccentric-only advanced exercise"
                    },
                    {
                        "name": "Copenhagen Plank",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 seconds per side",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Adductor strength for hip stability and injury prevention"
                    },
                    {
                        "name": "Seated Calf Raises (dumbbell, 2-2-2 tempo)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development with controlled tempo, seated reduces balance demand"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Upper Body C (Balanced Volume)",
                "muscleGroups": ["Chest", "Back", "Shoulders", "Arms"],
                "exercises": [
                    {
                        "name": "Push-up Variations Circuit (regular, wide, diamond)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 each variation",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR total",
                        "reasonIncluded": "Multiple angles hit entire chest and triceps, circuit format for efficiency"
                    },
                    {
                        "name": "Renegade Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Anti-rotation core with horizontal pulling, full body integration"
                    },
                    {
                        "name": "Dumbbell W-Raises (lying prone)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Scapular retraction and rear delt, minimal load for high reps"
                    },
                    {
                        "name": "Dumbbell Shoulder Complex (front, lateral, rear raises)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10 each direction",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Complete deltoid development in single giant set"
                    },
                    {
                        "name": "Close-Grip Push-ups (tempo 3-0-3)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep emphasis with slow tempo for TUT"
                    },
                    {
                        "name": "Incline Dumbbell Curls (strict form)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Bicep stretch position, incline support reduces momentum"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Lower Body C (Metabolic/Endurance)",
                "muscleGroups": ["Full Lower Body"],
                "exercises": [
                    {
                        "name": "Goblet Squat (high rep, moderate weight)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Metabolic leg work, upright torso, cardiovascular component"
                    },
                    {
                        "name": "Walking Lunges (bodyweight or light dumbbells)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "20-30 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-rep unilateral work, functional movement, low impact"
                    },
                    {
                        "name": "Glute Bridge March",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 total",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Glute activation with alternating legs for endurance"
                    },
                    {
                        "name": "Bodyweight Squat Pulses (bottom position)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "30-45 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Isometric quad work at most challenging position"
                    },
                    {
                        "name": "Calf Raise Circuit (seated, single-leg, both legs)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15 each variation",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Complete calf development with varied positions"
                    },
                    {
                        "name": "Dead Bug Variations + Bird Dogs",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15 per side each",
                        "restSeconds": "45",
                        "intensityGuideline": "Focus on control",
                        "reasonIncluded": "Core stability without spinal loading, recovery and mobility emphasis"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Underweight",
            "trainingLocation": "Gym",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Push/Pull/Legs repeated twice weekly. Intermediate underweight individuals need high frequency and volume to stimulate growth. Gym equipment allows maximum loading and progressive overload for mass gain.",
            "whyThisVolume": "14-16 sets per muscle per week. Upper-middle range for intermediates. Underweight trainees typically have faster metabolisms and can handle more volume while eating in caloric surplus.",
            "whyThisExerciseSelection": "Heavy compound movements form the foundation (barbell bench, squat, deadlift variations). Machines provide additional volume safely. Mix of strength (5-8 reps) and hypertrophy (8-15 reps) ranges. Emphasizes mass-building exercises.",
            "progressionStrategy": "Linear progression on main compounds: add 2.5-5lbs upper, 5-10lbs lower when hitting rep targets. Use double progression on accessories (reps then weight). Track all lifts. Prioritize caloric surplus (500+ calories). Deload every 4th week."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Barbell Bench Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary horizontal pressing for maximum chest and tricep mass"
                    },
                    {
                        "name": "Incline Dumbbell Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest development with greater ROM and stretch"
                    },
                    {
                        "name": "Barbell Overhead Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy overhead pressing for deltoid mass and core stability"
                    },
                    {
                        "name": "Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Dips (weighted if possible)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower chest and tricep development with bodyweight progression"
                    },
                    {
                        "name": "Overhead Cable Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Long head tricep emphasis under constant tension"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Conventional Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Total posterior chain mass builder, maximum anabolic stimulus"
                    },
                    {
                        "name": "Weighted Pull-ups or Lat Pulldown",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling for lat width, progressive overload via weight or assistance"
                    },
                    {
                        "name": "Barbell Rows (underhand grip)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pull for back thickness with bicep involvement"
                    },
                    {
                        "name": "Seated Cable Rows (wide grip)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Mid-back thickness with constant tension"
                    },
                    {
                        "name": "Barbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Heavy bicep loading for mass development"
                    },
                    {
                        "name": "Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear deltoid and upper back health, shoulder stability"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
                "exercises": [
                    {
                        "name": "Barbell Back Squat",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "King of leg exercises, maximum lower body mass and strength"
                    },
                    {
                        "name": "Romanian Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring and glute hypertrophy without back fatigue from conventional deadlifts"
                    },
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High volume quad work without spinal compression"
                    },
                    {
                        "name": "Lying Leg Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Direct hamstring isolation"
                    },
                    {
                        "name": "Walking Lunges (barbell or dumbbells)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral leg development and functional strength"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Gastrocnemius development for lower leg mass"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Incline Barbell Bench Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest emphasis with heavy loading"
                    },
                    {
                        "name": "Flat Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Greater chest stretch and ROM than barbell"
                    },
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Stable pressing platform for pushing intensity safely"
                    },
                    {
                        "name": "Cable Flyes (low to high)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Upper chest isolation with constant tension"
                    },
                    {
                        "name": "Dumbbell Front Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Anterior deltoid isolation"
                    },
                    {
                        "name": "Close-Grip Bench Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy tricep work with compound movement"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Lat Pulldown (wide grip)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Vertical pulling volume for lat width"
                    },
                    {
                        "name": "T-Bar Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pull with supported position"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral back work with full ROM and stretch"
                    },
                    {
                        "name": "Straight-Arm Pulldowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lat isolation without bicep involvement"
                    },
                    {
                        "name": "Incline Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Bicep stretch position for long head emphasis"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis and forearm development"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Front Squat",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Quad-dominant squat variation with different stimulus"
                    },
                    {
                        "name": "Stiff-Leg Deadlift",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum hamstring stretch and development"
                    },
                    {
                        "name": "Bulgarian Split Squats",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral leg work with glute emphasis"
                    },
                    {
                        "name": "Leg Extensions",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Quad isolation for complete development"
                    },
                    {
                        "name": "Glute-Ham Raises or Nordic Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced hamstring exercise for strength and size"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development for complete calf training"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Normal",
            "trainingLocation": "Home",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day for beginners with 6-day frequency allows skill acquisition through repetition while keeping individual sessions manageable. Normal BMI individuals can handle daily training without excessive recovery concerns.",
            "whyThisVolume": "8-12 sets per muscle per week. Entry-level volume allows adaptation to resistance training stimulus. 6-day split distributes volume across multiple sessions for optimal recovery.",
            "whyThisExerciseSelection": "Home-based bodyweight and basic dumbbell exercises. Progressive bodyweight movements teach fundamental patterns. Emphasis on form mastery before adding significant load. Scalable exercises suitable for limited equipment.",
            "progressionStrategy": "Master bodyweight movements first (perfect form for 12+ reps). Progress by: (1) increasing reps 8→12→15, (2) adding tempo (2-1-2), (3) adding pause at peak contraction, (4) finally adding dumbbell load. Add 1 set every 2-3 weeks."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Foundational horizontal pressing movement, scalable difficulty"
                    },
                    {
                        "name": "Incline Push-ups (hands elevated)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Easier variation allows volume accumulation, upper chest emphasis"
                    },
                    {
                        "name": "Dumbbell Floor Press",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Introduces external load safely, limited ROM protects shoulders"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Dumbbell Rows (single-arm)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary horizontal pulling movement, unilateral work prevents imbalances"
                    },
                    {
                        "name": "Inverted Rows (or Table Rows)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "6-10",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Bodyweight horizontal pull, scalable by body angle"
                    },
                    {
                        "name": "Superman Holds",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "20-30 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Lower back and posterior chain activation"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Goblet Squats",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-15",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Teaches squat pattern with counterbalance, quad and glute development"
                    },
                    {
                        "name": "Reverse Lunges",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Knee-friendly lunge variation, unilateral leg work"
                    },
                    {
                        "name": "Glute Bridges",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Glute isolation without knee stress"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lower leg development"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Dumbbell Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary overhead pressing for deltoid development"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Pike Push-ups",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bodyweight overhead pressing variation"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Dumbbell Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Fundamental bicep exercise"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Long head tricep emphasis"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Brachialis and forearm development"
                    },
                    {
                        "name": "Bench Dips",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bodyweight tricep exercise"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Full Body",
                "muscleGroups": ["Full Body"],
                "exercises": [
                    {
                        "name": "Bodyweight Squats",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Movement pattern reinforcement, light leg work"
                    },
                    {
                        "name": "Push-ups (varied hand positions)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Additional chest volume with variation"
                    },
                    {
                        "name": "Bird Dogs",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12 per side",
                        "restSeconds": "60",
                        "intensityGuideline": "Focus on control",
                        "reasonIncluded": "Core stability and coordination"
                    },
                    {
                        "name": "Plank Holds",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "30-45 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Core endurance and stability"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Obese",
            "trainingLocation": "Gym",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day with 6-day frequency distributes training stress optimally. For obese beginners, this prevents excessive fatigue while building consistent habits. Gym machines provide stability and safety.",
            "whyThisVolume": "6-10 sets per muscle per week. Conservative volume prioritizes movement quality and joint health over volume. Focus on establishing proper patterns and sustainable training routine.",
            "whyThisExerciseSelection": "Machine-dominant programming (80% machines). Machines provide support, guided movement paths, and eliminate balance concerns. All exercises are low-impact and joint-protective. Seated variations prioritized to manage systemic fatigue.",
            "progressionStrategy": "Form mastery is priority #1. Progress by: (1) perfect movement for 4 weeks, (2) increase reps 8→10→12, (3) add light weight when form stays perfect at 12 reps. Rest fully between sets (120-180 seconds). Deload every 3rd week."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Chest Press Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "3 RIR, focus on controlled movement",
                        "reasonIncluded": "Stable pressing platform, accommodates body size, teaches pressing pattern safely"
                    },
                    {
                        "name": "Pec Deck Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Guided fly movement, no shoulder instability concerns"
                    },
                    {
                        "name": "Incline Chest Press Machine",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "3 RIR",
                        "reasonIncluded": "Upper chest emphasis with machine support"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids"],
                "exercises": [
                    {
                        "name": "Lat Pulldown Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "3 RIR",
                        "reasonIncluded": "Vertical pulling without bodyweight requirement, adjustable resistance"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Supported horizontal pull, no lower back stress"
                    },
                    {
                        "name": "Back Extension Machine (light)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower back strength in supported position"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Leg Press Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "150",
                        "intensityGuideline": "3 RIR",
                        "reasonIncluded": "Primary leg exercise without spinal loading, seat accommodates body size"
                    },
                    {
                        "name": "Leg Extension Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Quad isolation with controlled knee stress"
                    },
                    {
                        "name": "Seated Leg Curl Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Hamstring development in stable seated position"
                    },
                    {
                        "name": "Seated Calf Raise Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower leg work without balance demands"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "3 RIR",
                        "reasonIncluded": "Overhead pressing with back support, removes core demands"
                    },
                    {
                        "name": "Machine Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Medial deltoid isolation with fixed movement path"
                    },
                    {
                        "name": "Machine Rear Delt Flye",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Posterior deltoid development, posture support"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Machine Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Supported bicep work eliminates momentum"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Simple tricep movement with constant tension"
                    },
                    {
                        "name": "Cable Hammer Curls (rope)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Forearm and brachialis work"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Light Full Body",
                "muscleGroups": ["Full Body"],
                "exercises": [
                    {
                        "name": "Recumbent Bike or Elliptical",
                        "type": "Compound",
                        "sets": "1",
                        "reps": "15-20 minutes",
                        "restSeconds": "N/A",
                        "intensityGuideline": "Light to moderate effort, conversational pace",
                        "reasonIncluded": "Low-impact cardiovascular work, active recovery"
                    },
                    {
                        "name": "Hip Abduction Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hip stability and glute medius strength"
                    },
                    {
                        "name": "Hip Adduction Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Inner thigh strength for hip stability"
                    },
                    {
                        "name": "Assisted Ab Crunch Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Core strength without spinal loading"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Overweight",
            "trainingLocation": "Gym",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day allows beginners to focus on movement quality. 6-day frequency distributes volume to minimize per-session joint stress while building exercise habits. Ideal for overweight individuals establishing routines.",
            "whyThisVolume": "8-10 sets per muscle per week. Beginner-appropriate volume with emphasis on form development. Overweight individuals benefit from moderate volume distributed across multiple sessions for recovery.",
            "whyThisExerciseSelection": "Mix of machines (60%) and free weights (40%). Machines provide stability for learning while free weights teach foundational patterns. Joint-friendly exercise selection with controlled movements. Seated variations reduce systemic fatigue.",
            "progressionStrategy": "Master form for 3-4 weeks before progression. Add reps from 8→12, then increase weight by smallest increment. Full rest periods (90-120 seconds). Focus on controlled tempo (2-1-2). Track all workouts for accountability."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Chest Press Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Stable pressing platform teaches pattern, adjustable seat accommodates body size"
                    },
                    {
                        "name": "Dumbbell Incline Press (moderate angle)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest focus with free weight pattern, moderate incline reduces shoulder stress"
                    },
                    {
                        "name": "Cable Flyes (light weight)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Chest isolation with constant tension, teaches fly movement safely"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Lat Pulldown (neutral grip)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Vertical pulling with shoulder-friendly grip, scalable resistance"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Supported horizontal pull, constant tension, no lower back stress"
                    },
                    {
                        "name": "Dumbbell Rows (supported on bench)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral pulling with chest support, prevents lower back fatigue"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "150",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Primary lower body exercise without spinal compression, safe for learning"
                    },
                    {
                        "name": "Leg Extension Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Quad isolation with controlled loading"
                    },
                    {
                        "name": "Seated Leg Curl",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring work in stable position"
                    },
                    {
                        "name": "Calf Press on Leg Press",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower leg development using leg press apparatus"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Supported overhead pressing, removes balance and core demands"
                    },
                    {
                        "name": "Dumbbell Lateral Raises (light)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Cable Face Pulls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Rear deltoid and upper back health, posture correction"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Cable Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Constant tension bicep work, teaches curl pattern"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Simple tricep isolation, elbow-friendly"
                    },
                    {
                        "name": "Dumbbell Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Brachialis and forearm development"
                    },
                    {
                        "name": "Overhead Cable Tricep Extension",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Long head tricep emphasis with cable tension"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Light Active Recovery",
                "muscleGroups": ["Full Body"],
                "exercises": [
                    {
                        "name": "Recumbent Bike",
                        "type": "Compound",
                        "sets": "1",
                        "reps": "20-25 minutes",
                        "restSeconds": "N/A",
                        "intensityGuideline": "Light effort, able to hold conversation",
                        "reasonIncluded": "Low-impact cardio, promotes recovery, builds work capacity"
                    },
                    {
                        "name": "Hip Abduction Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hip stability and glute medius activation"
                    },
                    {
                        "name": "Ab Crunch Machine",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Core strength in supported position"
                    },
                    {
                        "name": "Stretching and Mobility Work",
                        "type": "Isolation",
                        "sets": "1",
                        "reps": "10-15 minutes",
                        "restSeconds": "N/A",
                        "intensityGuideline": "Comfortable stretch, no pain",
                        "reasonIncluded": "Flexibility maintenance, recovery enhancement"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Obese",
            "trainingLocation": "Home",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Upper/Lower split 3x weekly balances training frequency with recovery needs. Intermediate obese individuals can handle split routines but benefit from distributing stress. Home setting requires creative exercise selection.",
            "whyThisVolume": "10-12 sets per muscle per week. Moderate volume appropriate for intermediate level adjusted for higher recovery demands. Home equipment necessitates higher sets with lighter loads for equivalent stimulus.",
            "whyThisExerciseSelection": "Joint-protective exercises with tempo and pause variations to increase difficulty. Seated and supported movements prioritized. Resistance bands and dumbbells provide scalable resistance. No high-impact movements.",
            "progressionStrategy": "Progress through: (1) tempo manipulation (slower eccentrics), (2) isometric holds at peak contraction, (3) pause reps, (4) increased reps, (5) added resistance. Emphasize rest periods (full recovery). RPE 7-8 maximum."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Upper Body A (Push Focus)",
                "muscleGroups": ["Chest", "Shoulders", "Triceps", "Back"],
                "exercises": [
                    {
                        "name": "Incline Push-ups (tempo 3-1-2)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled tempo increases difficulty without joint stress, scalable angle"
                    },
                    {
                        "name": "Seated Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Seated position reduces systemic fatigue, shoulder development"
                    },
                    {
                        "name": "Dumbbell Floor Press (pause at bottom)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Limited ROM protects shoulders, pause eliminates momentum"
                    },
                    {
                        "name": "Resistance Band Rows (seated)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pulling in stable position, constant band tension"
                    },
                    {
                        "name": "Dumbbell Lateral Raises (seated)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated eliminates compensation patterns, medial deltoid focus"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Lower Body A",
                "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings"],
                "exercises": [
                    {
                        "name": "Goblet Squats (box/chair for depth control)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Box provides depth guide and confidence, reduces knee stress"
                    },
                    {
                        "name": "Step-ups (low box, tempo 2-1-2)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled tempo reduces impact, unilateral work, functional movement"
                    },
                    {
                        "name": "Single-Leg Glute Bridges (3-second hold)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Isometric hold maximizes glute contraction, zero knee stress"
                    },
                    {
                        "name": "Wall Sit (isometric hold)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "30-45 seconds",
                        "restSeconds": "90",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Quad strength without dynamic loading on joints"
                    },
                    {
                        "name": "Seated Calf Raises (dumbbell)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development without standing balance demands"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Upper Body B (Pull Focus)",
                "muscleGroups": ["Back", "Biceps", "Rear Delts"],
                "exercises": [
                    {
                        "name": "Inverted Rows (elevated bar, knees bent)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Scalable bodyweight pull, adjustable difficulty by body angle"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows (supported)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Chest support eliminates lower back stress, heavy pulling"
                    },
                    {
                        "name": "Dumbbell Pullovers (tempo 3-1-2)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lat stretch with slow tempo, minimal shoulder stress"
                    },
                    {
                        "name": "Resistance Band Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear delt and upper back health, extremely joint-friendly"
                    },
                    {
                        "name": "Seated Dumbbell Curls (alternating)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated eliminates momentum, alternating allows focus per arm"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Lower Body B",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps"],
                "exercises": [
                    {
                        "name": "Dumbbell Romanian Deadlifts (moderate weight)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hip hinge pattern with manageable loading, hamstring development"
                    },
                    {
                        "name": "Reverse Lunges (bodyweight or light dumbbells)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Knee-friendly lunge variation, backward motion reduces stress"
                    },
                    {
                        "name": "Glute Bridge (both legs, pause at top)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "2-second squeeze maximizes glute activation"
                    },
                    {
                        "name": "Slider Leg Curls or Towel Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring isolation using household items, eccentric emphasis"
                    },
                    {
                        "name": "Single-Leg Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral calf work addresses imbalances"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Upper Body C (Balanced)",
                "muscleGroups": ["Chest", "Back", "Shoulders", "Arms"],
                "exercises": [
                    {
                        "name": "Push-up Variations (wide, regular, close)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8-10 each variation",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Multiple angles for complete chest development, circuit format"
                    },
                    {
                        "name": "Dumbbell Rows (both arms, bent over)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bilateral rowing for back thickness"
                    },
                    {
                        "name": "Dumbbell Shoulder Complex (front/lateral/rear)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10 each direction",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Complete deltoid coverage in single giant set"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Long head tricep emphasis"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis and forearm development"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Lower Body C (Metabolic)",
                "muscleGroups": ["Full Lower Body"],
                "exercises": [
                    {
                        "name": "Bodyweight Squats (high rep)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Metabolic leg work, movement pattern reinforcement"
                    },
                    {
                        "name": "Walking Lunges (bodyweight)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "20-30 total",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-rep unilateral work for endurance"
                    },
                    {
                        "name": "Glute Bridge March (alternating legs)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-30 total",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Dynamic glute work with core stability"
                    },
                    {
                        "name": "Bodyweight Calf Raises (both legs)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "High-rep calf endurance"
                    },
                    {
                        "name": "Seated Core Work (knee raises, twists)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "45",
                        "intensityGuideline": "Focus on control",
                        "reasonIncluded": "Core activation without spinal loading"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Underweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Push/Pull/Legs split repeated twice weekly maximizes frequency for muscle growth. Intermediate underweight individuals need high training stimulus to overcome fast metabolism and build mass with limited home equipment.",
            "whyThisVolume": "14-16 sets per muscle per week. Upper-middle intermediate range appropriate for mass-gaining goals. Home setting requires creative exercise selection and tempo work to achieve adequate volume.",
            "whyThisExerciseSelection": "Advanced bodyweight progressions combined with strategic dumbbell work. Tempo manipulation, pause reps, and unilateral variations increase difficulty. Emphasizes compound movements for maximum muscle recruitment.",
            "progressionStrategy": "Progressive overload via: (1) increase reps 8→12→15, (2) add tempo (4-second eccentrics), (3) add pauses (2-second holds), (4) progress to harder variations (archer push-ups), (5) add dumbbell weight. Requires caloric surplus."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Decline Push-ups (feet elevated, tempo 3-0-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Increased load on chest with eccentric emphasis, upper chest focus"
                    },
                    {
                        "name": "Dumbbell Floor Press (pause at bottom)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pressing with pause eliminating stretch reflex"
                    },
                    {
                        "name": "Pike Push-ups (feet elevated)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Progressive overhead pressing for deltoid development"
                    },
                    {
                        "name": "Dumbbell Arnold Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Full deltoid rotation through extended ROM"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Diamond Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep-focused pressing variation"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Pull-ups or Inverted Rows (weighted, tempo 3-1-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy vertical pulling with tempo for lat development"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pull with full ROM and stretch"
                    },
                    {
                        "name": "Dumbbell Pullovers",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lat stretch and serratus engagement"
                    },
                    {
                        "name": "Renegade Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Anti-rotation core with horizontal pulling"
                    },
                    {
                        "name": "Dumbbell Bicep Curls (tempo 2-1-2)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Controlled tempo for bicep development"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis and forearm thickness"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Bulgarian Split Squats",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per leg",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Primary unilateral leg builder, high quad and glute activation"
                    },
                    {
                        "name": "Goblet Squats (tempo 4-1-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eccentric emphasis for increased time under tension"
                    },
                    {
                        "name": "Single-Leg Romanian Deadlifts",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral hamstring and glute work with balance component"
                    },
                    {
                        "name": "Reverse Lunges (weighted)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Additional unilateral volume, knee-friendly variation"
                    },
                    {
                        "name": "Nordic Curls (eccentric focus)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "5-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Advanced hamstring exercise with eccentric emphasis"
                    },
                    {
                        "name": "Single-Leg Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20 per leg",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Unilateral calf development"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Archer Push-ups",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8 per side",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced push-up variation with unilateral emphasis"
                    },
                    {
                        "name": "Dumbbell Incline Press (on stability ball)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest with stability challenge"
                    },
                    {
                        "name": "Handstand Push-ups (wall-assisted) or Pike Push-ups",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "6-10",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced overhead pressing progression"
                    },
                    {
                        "name": "Dumbbell Front Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Anterior deltoid isolation"
                    },
                    {
                        "name": "Close-Grip Push-ups (tempo 3-1-1)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Tricep-focused pressing with tempo"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Long head tricep emphasis with stretch"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Negative Pull-ups (5-second eccentric)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "5-8",
                        "restSeconds": "150",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Maximum eccentric overload for lat development"
                    },
                    {
                        "name": "Bent-Over Dumbbell Rows",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bilateral horizontal pulling for back thickness"
                    },
                    {
                        "name": "Inverted Rows (tempo 2-2-2)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Time under tension with controlled tempo"
                    },
                    {
                        "name": "Dumbbell Shrugs",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Trap development for upper back mass"
                    },
                    {
                        "name": "Zottman Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Biceps and forearm with rotation component"
                    },
                    {
                        "name": "Incline Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Bicep stretch position for long head emphasis"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Pistol Squats (assisted if needed)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8 per leg",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Advanced single-leg squat for maximum quad development"
                    },
                    {
                        "name": "Dumbbell Step-ups (higher box)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Functional leg power with increased ROM"
                    },
                    {
                        "name": "Dumbbell Romanian Deadlifts",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring volume accumulation"
                    },
                    {
                        "name": "Walking Lunges (dumbbell)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Dynamic unilateral leg work for endurance and size"
                    },
                    {
                        "name": "Glute-Ham Raises or Nordic Curl Negatives",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "6-8",
                        "restSeconds": "120",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Advanced hamstring exercise"
                    },
                    {
                        "name": "Seated Calf Raises (dumbbell on knees)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development for complete calf training"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Obese",
            "trainingLocation": "Gym",
            "fitnessLevel": "Advanced",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Upper/Lower split 3x weekly allows high training frequency while managing systemic fatigue. Advanced obese individuals can handle complex programming but benefit from distributed stress and recovery-focused structure.",
            "whyThisVolume": "12-16 sets per muscle per week. Moderate-high volume adjusted for recovery demands. Advanced techniques used strategically to maximize stimulus while protecting joints.",
            "whyThisExerciseSelection": "Strategic mix of machines (50%) and free weights (50%). Machines for heavy work and joint protection, free weights for skill maintenance. Advanced techniques: cluster sets, rest-pause, drop sets. All exercises selected for minimal joint stress.",
            "progressionStrategy": "Undulating periodization: Heavy (85-90%), Moderate (75-80%), Light (65-70%) days rotated. Use RPE 8-9 on heavy days, 7-8 on moderate. Deload every 4th week. Prioritize recovery: sleep, nutrition, stress management."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Upper Body A (Heavy Compounds)",
                "muscleGroups": ["Chest", "Back", "Shoulders"],
                "exercises": [
                    {
                        "name": "Chest Press Machine (cluster sets)",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "4-6 (3 mini-sets, 15 sec rest)",
                        "restSeconds": "180",
                        "intensityGuideline": "1-2 RIR on final cluster",
                        "reasonIncluded": "Heavy pressing with intra-set rest allows maximum load safely"
                    },
                    {
                        "name": "Chest-Supported Row Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy horizontal pull without lower back stress"
                    },
                    {
                        "name": "Smith Machine Overhead Press",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "6-8",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Guided bar path for heavy overhead pressing, seated reduces fatigue"
                    },
                    {
                        "name": "Lat Pulldown (wide grip, rest-pause)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "8+3+2",
                        "restSeconds": "120",
                        "intensityGuideline": "1-2 RIR on main set",
                        "reasonIncluded": "Rest-pause extends set for lat development without additional heavy sets"
                    },
                    {
                        "name": "Cable Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Constant tension medial deltoid work"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Lower Body A (Heavy)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Leg Press (heavy, cluster sets)",
                        "type": "Compound",
                        "sets": "5",
                        "reps": "5-8",
                        "restSeconds": "180",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum lower body loading without spinal compression"
                    },
                    {
                        "name": "Smith Machine Romanian Deadlift",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-10",
                        "restSeconds": "150",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled bar path for heavy hip hinge, hamstring emphasis"
                    },
                    {
                        "name": "Hack Squat Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Supported squat pattern with quad focus"
                    },
                    {
                        "name": "Lying Leg Curl (drop set on final set)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR, then drop 30%",
                        "reasonIncluded": "Hamstring isolation with metabolic finisher"
                    },
                    {
                        "name": "Standing Calf Raises (heavy)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Heavy gastrocnemius work"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Upper Body B (Moderate Volume)",
                "muscleGroups": ["Chest", "Back", "Arms"],
                "exercises": [
                    {
                        "name": "Incline Chest Press Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upper chest development with stable platform"
                    },
                    {
                        "name": "Cable Rows (varied grips)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Moderate horizontal pulling with constant tension"
                    },
                    {
                        "name": "Pec Deck (mechanical drop set)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Chest isolation with advanced technique"
                    },
                    {
                        "name": "Straight-Arm Pulldowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Lat isolation without bicep fatigue"
                    },
                    {
                        "name": "EZ-Bar Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Wrist-friendly bicep work"
                    },
                    {
                        "name": "Cable Tricep Pushdowns (drop set)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR, then drop 30%",
                        "reasonIncluded": "Tricep isolation with metabolic finisher"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Lower Body B (Moderate)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps"],
                "exercises": [
                    {
                        "name": "Hip Thrust Machine",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Maximum glute activation in supported position"
                    },
                    {
                        "name": "Leg Press (high foot placement)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Glute and hamstring emphasis through foot positioning"
                    },
                    {
                        "name": "Seated Leg Curl",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Hamstring isolation from different angle"
                    },
                    {
                        "name": "Leg Extension (1.5 reps)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Extended TUT through partial rep technique"
                    },
                    {
                        "name": "Seated Calf Raises (rest-pause)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12+5+3",
                        "restSeconds": "90",
                        "intensityGuideline": "1-2 RIR on main set",
                        "reasonIncluded": "Soleus development with advanced technique"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Upper Body C (Hypertrophy Focus)",
                "muscleGroups": ["Shoulders", "Back", "Arms"],
                "exercises": [
                    {
                        "name": "Machine Shoulder Press (tempo 3-1-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Eccentric emphasis for deltoid development"
                    },
                    {
                        "name": "Lat Pulldown (close neutral grip)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Shoulder-friendly lat development"
                    },
                    {
                        "name": "Machine Lateral Raises (double drop set)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15+8+5",
                        "restSeconds": "90",
                        "intensityGuideline": "0 RIR on final drop",
                        "reasonIncluded": "Medial deltoid metabolic stress"
                    },
                    {
                        "name": "Face Pulls (high volume)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear delt and rotator cuff health"
                    },
                    {
                        "name": "Cable Curls (21s method)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "7+7+7",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Complete bicep ROM stimulation"
                    },
                    {
                        "name": "Overhead Cable Tricep Extension",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Long head tricep emphasis with high reps"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Lower Body C (Metabolic/Pump)",
                "muscleGroups": ["Full Lower Body"],
                "exercises": [
                    {
                        "name": "Leg Press (high rep, moderate weight)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Metabolic leg work for endurance and pump"
                    },
                    {
                        "name": "Smith Machine Goblet Squat",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Upright squat pattern with light loading"
                    },
                    {
                        "name": "Leg Curl (high rep, short rest)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "20-25",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Hamstring pump and metabolic stress"
                    },
                    {
                        "name": "Leg Extension (high rep, short rest)",
                        "type": "Isolation",
                        "sets": "4",
                        "reps": "20-25",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Quad pump and metabolic conditioning"
                    },
                    {
                        "name": "Hip Abduction + Adduction Superset",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20 each",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Complete hip stability and metabolic finish"
                    },
                    {
                        "name": "Calf Press on Leg Press (very high rep)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "30-40",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Calf endurance and pump finish"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Normal",
            "trainingLocation": "Gym",
            "fitnessLevel": "Beginner",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Single muscle group per day for beginners with 6-day frequency allows mastery of movement patterns through repetition. Normal BMI individuals can handle frequent training with proper recovery protocols.",
            "whyThisVolume": "8-12 sets per muscle per week. Entry-level volume appropriate for adaptation to resistance training. Gym equipment allows proper progression and form development.",
            "whyThisExerciseSelection": "Foundation-building exercises using both machines and free weights. Machines teach movement patterns safely while free weights develop stabilizer muscles. Progressive difficulty from simple to complex exercises.",
            "progressionStrategy": "Linear progression protocol: master movement patterns for 2-3 weeks, increase reps from 8→10→12, then add weight (2.5-5lbs upper, 5-10lbs lower). Rest fully (90-120 seconds). Deload every 4th week by reducing volume 40%."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Chest",
                "muscleGroups": ["Pectorals"],
                "exercises": [
                    {
                        "name": "Chest Press Machine",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Teaches horizontal pressing pattern with stable platform"
                    },
                    {
                        "name": "Dumbbell Bench Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Introduces free weight pressing with greater ROM"
                    },
                    {
                        "name": "Cable Flyes",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Chest isolation with constant tension, teaches fly pattern"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Back",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius"],
                "exercises": [
                    {
                        "name": "Lat Pulldown",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Vertical pulling pattern without bodyweight requirement"
                    },
                    {
                        "name": "Seated Cable Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pulling with back support, teaches rowing pattern"
                    },
                    {
                        "name": "Dumbbell Rows",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral pulling with free weight"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Leg Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "120",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Teaches leg pressing pattern safely without spinal loading"
                    },
                    {
                        "name": "Goblet Squat",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Introduces squat pattern with counterbalance"
                    },
                    {
                        "name": "Leg Curl Machine",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hamstring isolation and development"
                    },
                    {
                        "name": "Calf Raises (machine)",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lower leg development with machine support"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Shoulders",
                "muscleGroups": ["Deltoids"],
                "exercises": [
                    {
                        "name": "Machine Shoulder Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2-3 RIR",
                        "reasonIncluded": "Overhead pressing with back support"
                    },
                    {
                        "name": "Dumbbell Lateral Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Medial deltoid isolation for shoulder width"
                    },
                    {
                        "name": "Cable Face Pulls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Rear deltoid and upper back health"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Arms",
                "muscleGroups": ["Biceps", "Triceps"],
                "exercises": [
                    {
                        "name": "Cable Bicep Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Constant tension bicep work, teaches curl pattern"
                    },
                    {
                        "name": "Cable Tricep Pushdowns",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Simple tricep isolation movement"
                    },
                    {
                        "name": "Dumbbell Hammer Curls",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Brachialis and forearm development"
                    },
                    {
                        "name": "Overhead Dumbbell Tricep Extension",
                        "type": "Isolation",
                        "sets": "2",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Long head tricep emphasis"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Full Body Conditioning",
                "muscleGroups": ["Full Body"],
                "exercises": [
                    {
                        "name": "Bodyweight Squats",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Movement pattern reinforcement"
                    },
                    {
                        "name": "Push-ups (modified if needed)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "10-15",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Bodyweight pressing skill development"
                    },
                    {
                        "name": "Plank Holds",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "30-45 seconds",
                        "restSeconds": "60",
                        "intensityGuideline": "Technical failure",
                        "reasonIncluded": "Core stability and endurance"
                    },
                    {
                        "name": "Light Cardio (bike/elliptical)",
                        "type": "Compound",
                        "sets": "1",
                        "reps": "15-20 minutes",
                        "restSeconds": "N/A",
                        "intensityGuideline": "Conversational pace",
                        "reasonIncluded": "Active recovery and cardiovascular conditioning"
                    }
                ]
            }
        ]
    },
    {
        "inputSummary": {
            "bmiCategory": "Overweight",
            "trainingLocation": "Home",
            "fitnessLevel": "Intermediate",
            "daysPerWeek": 6
        },
        "programRationale": {
            "whyThisSplit": "Push/Pull/Legs split repeated twice weekly balances training frequency with recovery. Intermediate overweight individuals can handle split routines with proper exercise selection for joint protection.",
            "whyThisVolume": "12-14 sets per muscle per week. Moderate intermediate volume adjusted for higher recovery demands. Home equipment requires volume distribution across varied exercises.",
            "whyThisExerciseSelection": "Joint-protective progressions with tempo and pause variations. Seated/supported movements prioritized. Bodyweight exercises scaled appropriately. Resistance bands and dumbbells provide sufficient stimulus.",
            "progressionStrategy": "Progress via: (1) tempo manipulation (4-second eccentrics), (2) pause reps (2-second holds), (3) increased ROM, (4) rep progression 8→12→15, (5) weight addition. Emphasize recovery and form over load."
        },
        "weeklyStructure": [
            {
                "day": 1,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Push-ups (tempo 3-1-2, elevated if needed)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Controlled tempo increases difficulty without added load"
                    },
                    {
                        "name": "Dumbbell Floor Press (pause at bottom)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Limited ROM protects shoulders, pause removes momentum"
                    },
                    {
                        "name": "Seated Dumbbell Press",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Seated reduces fatigue, shoulder development"
                    },
                    {
                        "name": "Dumbbell Lateral Raises (seated)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated stability for medial deltoid focus"
                    },
                    {
                        "name": "Close-Grip Push-ups or Bench Dips",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Tricep-focused pressing"
                    }
                ]
            },
            {
                "day": 2,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Inverted Rows (tempo 3-1-1)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "8-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Horizontal pull with tempo, scalable difficulty"
                    },
                    {
                        "name": "Single-Arm Dumbbell Rows (supported)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Chest support eliminates lower back stress"
                    },
                    {
                        "name": "Dumbbell Pullovers (slow eccentric)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Lat stretch with controlled tempo"
                    },
                    {
                        "name": "Resistance Band Face Pulls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Rear delt and upper back health"
                    },
                    {
                        "name": "Seated Dumbbell Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Seated eliminates momentum"
                    }
                ]
            },
            {
                "day": 3,
                "focus": "Legs (Quads + Hamstrings + Glutes)",
                "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes"],
                "exercises": [
                    {
                        "name": "Goblet Squats (box for depth control)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "10-12",
                        "restSeconds": "120",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Box provides confidence and consistent depth"
                    },
                    {
                        "name": "Step-ups (low box, controlled tempo)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Low impact unilateral work"
                    },
                    {
                        "name": "Dumbbell Romanian Deadlifts (light)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Hip hinge pattern with manageable load"
                    },
                    {
                        "name": "Glute Bridges (single-leg progression)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Glute activation without joint stress"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Soleus development seated"
                    }
                ]
            },
            {
                "day": 4,
                "focus": "Push (Chest + Shoulders + Triceps)",
                "muscleGroups": ["Pectorals", "Deltoids", "Triceps"],
                "exercises": [
                    {
                        "name": "Incline Push-ups (tempo 2-2-2)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Time under tension with moderate difficulty"
                    },
                    {
                        "name": "Dumbbell Chest Press (on bench/stability ball)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Free weight pressing with full ROM"
                    },
                    {
                        "name": "Pike Push-ups (feet elevated moderately)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Overhead pressing progression"
                    },
                    {
                        "name": "Dumbbell Front Raises",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Anterior deltoid isolation"
                    },
                    {
                        "name": "Dumbbell Overhead Tricep Extension (seated)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Long head tricep in stable position"
                    }
                ]
            },
            {
                "day": 5,
                "focus": "Pull (Back + Biceps)",
                "muscleGroups": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps"],
                "exercises": [
                    {
                        "name": "Resistance Band Rows (seated, varied grips)",
                        "type": "Compound",
                        "sets": "4",
                        "reps": "12-15",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Constant tension horizontal pulling"
                    },
                    {
                        "name": "Renegade Rows",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per arm",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Anti-rotation core with pulling"
                    },
                    {
                        "name": "Dumbbell Shrugs",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "15-20",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Trap development for upper back"
                    },
                    {
                        "name": "Resistance Band Pull-Aparts",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Scapular retraction and rear deltoid"
                    },
                    {
                        "name": "Hammer Curls",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "12-15",
                        "restSeconds": "60",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Brachialis and forearm work"
                    }
                ]
            },
            {
                "day": 6,
                "focus": "Legs (Posterior Chain + Metabolic)",
                "muscleGroups": ["Hamstrings", "Glutes", "Quadriceps"],
                "exercises": [
                    {
                        "name": "Single-Leg Romanian Deadlifts (light)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "10-12 per leg",
                        "restSeconds": "90",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "Unilateral posterior chain with balance"
                    },
                    {
                        "name": "Reverse Lunges (bodyweight or light dumbbells)",
                        "type": "Compound",
                        "sets": "3",
                        "reps": "15-20 per leg",
                        "restSeconds": "75",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-rep unilateral work, knee-friendly"
                    },
                    {
                        "name": "Glute Bridge (both legs, high rep)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "20-25",
                        "restSeconds": "60",
                        "intensityGuideline": "1-2 RIR",
                        "reasonIncluded": "Metabolic glute work"
                    },
                    {
                        "name": "Bodyweight Squats (continuous)",
                        "type": "Compound",
                        "sets": "2",
                        "reps": "30-40",
                        "restSeconds": "60",
                        "intensityGuideline": "2 RIR",
                        "reasonIncluded": "High-rep conditioning"
                    },
                    {
                        "name": "Calf Raises (bodyweight, high rep)",
                        "type": "Isolation",
                        "sets": "3",
                        "reps": "25-30",
                        "restSeconds": "45",
                        "intensityGuideline": "1 RIR",
                        "reasonIncluded": "Calf endurance"
                    }
                ]
            }
        ]
    }
]


export const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

export const getWorkoutPlan = (category, weight, height, preferences = {}) => { // category arg is legacy, ignore
    const { workoutLocation = 'gym', fitnessLevel = 'intermediate' } = preferences;

    // 1. Calculate BMI & Category
    const bmiVal = weight && height ? (weight / ((height / 100) ** 2)) : 22;
    const bmiCat = getBMICategory(bmiVal);

    const location = workoutLocation.charAt(0).toUpperCase() + workoutLocation.slice(1).toLowerCase(); // 'Home' or 'Gym'
    const level = fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1).toLowerCase(); // 'Beginner', 'Intermediate', 'Advanced'

    // 2. Find Strategy
    // Tries to find exact match. If not, falls back to available plans for that BMI/Location.
    let strategy = STATIC_PLANS.find(p =>
        p.inputSummary.bmiCategory === bmiCat &&
        p.inputSummary.trainingLocation === location &&
        p.inputSummary.fitnessLevel === level
    );

    // Fallback 1: Same BMI & Location, any Level (prefer Intermediate > Beginner > Advanced)
    if (!strategy) {
        const fallbacks = STATIC_PLANS.filter(p =>
            p.inputSummary.bmiCategory === bmiCat &&
            p.inputSummary.trainingLocation === location
        );
        if (fallbacks.length > 0) {
            // Pick 'Intermediate' if avail, else first one
            strategy = fallbacks.find(p => p.inputSummary.fitnessLevel === 'Intermediate') || fallbacks[0];
        }
    }

    // Fallback 2: Same BMI, any Location (e.g. if Gym plan missing, give Home plan?) - Maybe weak fallback.
    // Let's default to a "Safe" options: Normal/Home/Intermediate if absolute failure.
    if (!strategy) {
        strategy = STATIC_PLANS.find(p =>
            p.inputSummary.bmiCategory === 'Normal' &&
            p.inputSummary.trainingLocation === 'Home' &&
            p.inputSummary.fitnessLevel === 'Intermediate'
        ) || STATIC_PLANS[0];
    }

    // 3. Map to App Structure
    // The static JSON has `weeklyStructure`. We need to generate `weeks` array (4 weeks) with progression.

    const week1Days = strategy.weeklyStructure.map((d, i) => ({
        dayNumber: i + 1,
        dayName: d.day === 7 ? 'Rest' : `Day ${d.day}`, // JSON has day: 1..6. 
        focus: d.focus,
        estimatedDurationMinutes: 45, // default
        exercises: d.exercises.map(ex => ({
            name: ex.name,
            muscleGroup: ex.muscleGroups ? ex.muscleGroups[0] : 'General',
            type: ex.type || 'Strength',
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: parseInt(ex.restSeconds) || 60,
            tempo: "2-0-2", // Default unless in JSON
            intensity: ex.intensityGuideline || "Moderate",
            instructions: ex.reasonIncluded || "Focus on form",
            progression: "Establish baseline"
        }))
    }));

    // Add specific 'Rest' day if only 6 days
    if (week1Days.length === 6) {
        week1Days.push({
            dayNumber: 7,
            dayName: 'Sunday',
            focus: 'Rest & Recovery',
            exercises: []
        });
    }

    // Apply Progression specific to this static plan's strategy
    const applyProgression = (weekNum, days) => {
        const weekDays = JSON.parse(JSON.stringify(days));
        if (weekNum === 1) return weekDays;

        weekDays.forEach(day => {
            day.exercises?.forEach(ex => {
                if (weekNum === 2) {
                    ex.progression = "Increase weight or reps slightly";
                    ex.intensity = "Moderate-High";
                } else if (weekNum === 3) {
                    ex.progression = "Push close to failure";
                    ex.intensity = "High";
                } else if (weekNum === 4) {
                    ex.progression = "Deload: Reduce volume by 50%";
                    ex.sets = Math.max(2, Math.floor(parseInt(ex.sets || 3) * 0.5));
                }
            });
        });
        return weekDays;
    };

    const weeks = [];
    for (let i = 1; i <= 4; i++) {
        weeks.push({
            weekNumber: i,
            focus: i === 4 ? "Recovery" : `Week ${i} Progression`,
            days: applyProgression(i, week1Days)
        });
    }

    return {
        planName: `${bmiCat} ${location} ${level} Program`,
        description: strategy.programRationale.whyThisSplit,
        goal: 'Muscle Building', // Forced goal
        difficulty: level,
        durationWeeks: 4,
        daysPerWeek: strategy.inputSummary.daysPerWeek,
        createdAt: new Date().toISOString(),
        weeks: weeks,
        // Legacy
        routine: weeks[0].days.map(d => ({
            day: d.dayName,
            focus: d.focus,
            exercises: d.exercises.map(e => `${e.name}: ${e.sets} x ${e.reps}`)
        })),
        tips: [
            strategy.programRationale.progressionStrategy,
            "Hydrate well",
            "Prioritize sleep"
        ]
    };
};

// --- DIET PLAN (KEPT AS IS) ---
const DIET_TEMPLATES = {
    'Standard': ['Greek Yogurt', 'Chicken Wrap', 'Salmon + Rice', 'Almonds', 'Oatmeal', 'Protein Shake'],
    'Vegetarian': ['Oats', 'Paneer Wrap', 'Lentil Soup', 'Nuts', 'Yogurt', 'Protein Shake'],
    'Vegan': ['Oats + Soy Milk', 'Tofu Stir-fry', 'Chickpea Salad', 'Nuts', 'Lentil Curry', 'Vegan Shake'],
    'Gluten-Free': ['Eggs', 'Rice Bowl', 'Chicken Salad', 'Fruit', 'Fish + Quinoa', 'Yogurt'],
    'Dairy-Free': ['Oats (Water)', 'Chicken + Veg', 'Avocado Toast', 'Nuts', 'Steak + Potato', 'Fruit']
};

export const getDietPlan = (category, weight, height, preferences = {}) => {
    const { goalType = 'maintenance', dietaryRestrictions = [] } = preferences;

    let goal = 'Maintenance';
    if (goalType === 'weight-loss') goal = 'Fat Loss';
    else if (goalType === 'muscle-building') goal = 'Muscle Building';
    else if (goalType === 'weight-gain') goal = 'Weight Gain';

    let type = 'Standard';
    if (dietaryRestrictions.includes('Vegetarian')) type = 'Vegetarian';
    if (dietaryRestrictions.includes('Vegan')) type = 'Vegan';

    const kcal = 2000;

    return {
        goal: `${goal} Diet`,
        dailyCalories: kcal,
        macros: { p: '150g', c: '200g', f: '60g' },
        meals: DIET_TEMPLATES[type].map((m, i) => ({
            meal: ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner', 'Snack 3'][i],
            time: '08:00',
            items: [m],
            calories: 300
        })),
        tips: ["Drink water", "Eat slowly"]
    };
};
