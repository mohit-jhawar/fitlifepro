// Workout Templates Data
export const workoutTemplates = [
    {
        id: 'template_beginner_fullbody',
        name: 'Beginner Full Body',
        difficulty: 'Beginner',
        duration: '45 min',
        daysPerWeek: 3,
        equipment: 'Dumbbells',
        description: 'Perfect for beginners. Works all major muscle groups 3x per week.',
        goals: ['Build Strength', 'Lose Weight', 'General Fitness'],
        image: '💪',
        weeks: 4,
        workouts: [
            {
                day: 'Monday',
                focus: 'Full Body',
                exercises: [
                    { name: 'Squats', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Push-ups', sets: 3, reps: '8-10', rest: '60s' },
                    { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
                    { name: 'Plank', sets: 3, reps: '30-45s', rest: '45s' },
                    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '60s' }
                ]
            },
            {
                day: 'Wednesday',
                focus: 'Full Body',
                exercises: [
                    { name: 'Deadlifts', sets: 3, reps: '8-10', rest: '90s' },
                    { name: 'Bench Press', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Pull-ups (Assisted)', sets: 3, reps: '6-8', rest: '60s' },
                    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '45s' },
                    { name: 'Tricep Dips', sets: 3, reps: '8-10', rest: '45s' }
                ]
            },
            {
                day: 'Friday',
                focus: 'Full Body',
                exercises: [
                    { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Incline Push-ups', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Step-ups', sets: 3, reps: '10 each leg', rest: '60s' },
                    { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45s' },
                    { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_ppl',
        name: 'Push/Pull/Legs',
        difficulty: 'Intermediate',
        duration: '60 min',
        daysPerWeek: 6,
        equipment: 'Full Gym',
        description: 'Classic bodybuilding split. Train each muscle group twice per week.',
        goals: ['Build Muscle', 'Gain Strength'],
        image: '🏋️',
        weeks: 8,
        workouts: [
            {
                day: 'Monday - Push',
                focus: 'Chest, Shoulders, Triceps',
                exercises: [
                    { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '75s' },
                    { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45s' },
                    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45s' },
                    { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '45s' }
                ]
            },
            {
                day: 'Tuesday - Pull',
                focus: 'Back, Biceps',
                exercises: [
                    { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '120s' },
                    { name: 'Pull-ups', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '75s' },
                    { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
                    { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '45s' }
                ]
            },
            {
                day: 'Wednesday - Legs',
                focus: 'Quads, Hamstrings, Glutes, Calves',
                exercises: [
                    { name: 'Squats', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
                    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '75s' },
                    { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s' },
                    { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s' }
                ]
            },
            {
                day: 'Thursday - Push',
                focus: 'Chest, Shoulders, Triceps',
                exercises: [
                    { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Cable Lateral Raises', sets: 3, reps: '12-15', rest: '45s' },
                    { name: 'Close-Grip Bench', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '45s' }
                ]
            },
            {
                day: 'Friday - Pull',
                focus: 'Back, Biceps',
                exercises: [
                    { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '90s' },
                    { name: 'T-Bar Rows', sets: 4, reps: '8-10', rest: '75s' },
                    { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Cable Rows', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Preacher Curls', sets: 3, reps: '10-12', rest: '45s' },
                    { name: 'Cable Curls', sets: 3, reps: '12-15', rest: '45s' }
                ]
            },
            {
                day: 'Saturday - Legs',
                focus: 'Quads, Hamstrings, Glutes',
                exercises: [
                    { name: 'Front Squats', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', rest: '75s' },
                    { name: 'Leg Press', sets: 3, reps: '15-20', rest: '60s' },
                    { name: 'Hamstring Curls', sets: 4, reps: '12-15', rest: '60s' },
                    { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s' },
                    { name: 'Seated Calf Raises', sets: 4, reps: '15-20', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_hiit',
        name: 'HIIT Cardio Blast',
        difficulty: 'Intermediate',
        duration: '30 min',
        daysPerWeek: 4,
        equipment: 'None',
        description: 'High-intensity interval training for fat loss and conditioning.',
        goals: ['Lose Weight', 'Improve Cardio', 'Burn Fat'],
        image: '🔥',
        weeks: 4,
        workouts: [
            {
                day: 'Monday',
                focus: 'Full Body HIIT',
                exercises: [
                    { name: 'Burpees', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Mountain Climbers', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Jump Squats', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'High Knees', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Plank Jacks', sets: 4, reps: '30s work / 30s rest', rest: '0s' }
                ]
            },
            {
                day: 'Wednesday',
                focus: 'Cardio & Core',
                exercises: [
                    { name: 'Jumping Jacks', sets: 4, reps: '45s work / 15s rest', rest: '0s' },
                    { name: 'Bicycle Crunches', sets: 4, reps: '45s work / 15s rest', rest: '0s' },
                    { name: 'Box Jumps', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Russian Twists', sets: 4, reps: '45s work / 15s rest', rest: '0s' },
                    { name: 'Sprint in Place', sets: 4, reps: '30s work / 30s rest', rest: '0s' }
                ]
            },
            {
                day: 'Friday',
                focus: 'Lower Body HIIT',
                exercises: [
                    { name: 'Jump Lunges', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Squat Jumps', sets: 4, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'Skaters', sets: 4, reps: '45s work / 15s rest', rest: '0s' },
                    { name: 'Wall Sit', sets: 4, reps: '45s hold', rest: '15s' },
                    { name: 'Butt Kicks', sets: 4, reps: '45s work / 15s rest', rest: '0s' }
                ]
            },
            {
                day: 'Saturday',
                focus: 'Total Body Burn',
                exercises: [
                    { name: 'Burpee to Push-up', sets: 5, reps: '40s work / 20s rest', rest: '0s' },
                    { name: 'Plank to Downward Dog', sets: 5, reps: '40s work / 20s rest', rest: '0s' },
                    { name: 'Tuck Jumps', sets: 5, reps: '30s work / 30s rest', rest: '0s' },
                    { name: 'V-ups', sets: 5, reps: '40s work / 20s rest', rest: '0s' }
                ]
            }
        ]
    },
    {
        id: 'template_home_noequip',
        name: 'Home Workout - No Equipment',
        difficulty: 'Beginner',
        duration: '40 min',
        daysPerWeek: 4,
        equipment: 'None',
        description: 'Effective bodyweight workout you can do anywhere, anytime.',
        goals: ['Build Strength', 'Lose Weight', 'Stay Active'],
        image: '🏠',
        weeks: 6,
        workouts: [
            {
                day: 'Monday - Upper Body',
                focus: 'Chest, Back, Arms',
                exercises: [
                    { name: 'Push-ups', sets: 4, reps: '12-15', rest: '60s' },
                    { name: 'Pike Push-ups', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Tricep Dips (Chair)', sets: 3, reps: '12-15', rest: '45s' },
                    { name: 'Superman Holds', sets: 3, reps: '30s', rest: '45s' },
                    { name: 'Diamond Push-ups', sets: 3, reps: '8-10', rest: '60s' }
                ]
            },
            {
                day: 'Tuesday - Lower Body',
                focus: 'Legs, Glutes',
                exercises: [
                    { name: 'Bodyweight Squats', sets: 4, reps: '15-20', rest: '60s' },
                    { name: 'Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
                    { name: 'Glute Bridges', sets: 4, reps: '15-20', rest: '45s' },
                    { name: 'Single-Leg Deadlifts', sets: 3, reps: '10 each', rest: '60s' },
                    { name: 'Calf Raises', sets: 4, reps: '20-25', rest: '30s' }
                ]
            },
            {
                day: 'Thursday - Core & Cardio',
                focus: 'Abs, Conditioning',
                exercises: [
                    { name: 'Plank', sets: 3, reps: '45-60s', rest: '45s' },
                    { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: '30s' },
                    { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '45s' },
                    { name: 'Burpees', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Leg Raises', sets: 3, reps: '12-15', rest: '45s' }
                ]
            },
            {
                day: 'Saturday - Full Body',
                focus: 'Total Body Workout',
                exercises: [
                    { name: 'Jump Squats', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Wide Push-ups', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Reverse Lunges', sets: 3, reps: '12 each', rest: '60s' },
                    { name: 'Plank to Push-up', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Side Plank', sets: 3, reps: '30s each side', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_core_abs',
        name: 'Core & Abs Focus',
        difficulty: 'All Levels',
        duration: '25 min',
        daysPerWeek: 5,
        equipment: 'Mat',
        description: 'Dedicated core training for a strong, defined midsection.',
        goals: ['Build Core Strength', 'Get Abs', 'Improve Posture'],
        image: '💎',
        weeks: 4,
        workouts: [
            {
                day: 'Daily Routine',
                focus: 'Core & Abs',
                exercises: [
                    { name: 'Plank', sets: 3, reps: '60s', rest: '30s' },
                    { name: 'Crunches', sets: 3, reps: '20-25', rest: '30s' },
                    { name: 'Russian Twists', sets: 3, reps: '30 total', rest: '30s' },
                    { name: 'Leg Raises', sets: 3, reps: '15-20', rest: '45s' },
                    { name: 'Bicycle Crunches', sets: 3, reps: '30 total', rest: '30s' },
                    { name: 'Side Plank', sets: 3, reps: '45s each', rest: '30s' },
                    { name: 'Dead Bug', sets: 3, reps: '12 each side', rest: '30s' },
                    { name: 'Hollow Hold', sets: 3, reps: '30-45s', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_upper_lower',
        name: 'Upper/Lower Split',
        difficulty: 'Intermediate',
        duration: '55 min',
        daysPerWeek: 4,
        equipment: 'Full Gym',
        description: 'Train upper body and lower body on separate days for optimal recovery.',
        goals: ['Build Muscle', 'Gain Strength', 'Improve Performance'],
        image: '⚡',
        weeks: 8,
        workouts: [
            {
                day: 'Monday - Upper Body',
                focus: 'Chest, Back, Shoulders, Arms',
                exercises: [
                    { name: 'Bench Press', sets: 4, reps: '6-8', rest: '120s' },
                    { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s' },
                    { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '75s' },
                    { name: 'Dumbbell Curls', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' }
                ]
            },
            {
                day: 'Tuesday - Lower Body',
                focus: 'Quads, Hamstrings, Glutes',
                exercises: [
                    { name: 'Squats', sets: 4, reps: '6-8', rest: '150s' },
                    { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90s' },
                    { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s' }
                ]
            },
            {
                day: 'Thursday - Upper Body',
                focus: 'Chest, Back, Shoulders, Arms',
                exercises: [
                    { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Lat Pulldowns', sets: 4, reps: '10-12', rest: '75s' },
                    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '75s' },
                    { name: 'Cable Rows', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s' }
                ]
            },
            {
                day: 'Friday - Lower Body',
                focus: 'Quads, Hamstrings, Glutes',
                exercises: [
                    { name: 'Deadlifts', sets: 4, reps: '5-6', rest: '180s' },
                    { name: 'Front Squats', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', rest: '90s' },
                    { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Seated Calf Raises', sets: 4, reps: '15-20', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_yoga',
        name: 'Yoga & Flexibility',
        difficulty: 'All Levels',
        duration: '30 min',
        daysPerWeek: 3,
        equipment: 'Mat',
        description: 'Improve mobility, balance, and mental clarity with this flow.',
        goals: ['Flexibility', 'Recovery', 'Balance'],
        image: '🧘',
        weeks: 4,
        workouts: [
            {
                day: 'Monday - Sun Salutations',
                focus: 'Full Body Flow',
                exercises: [
                    { name: 'Mountain Pose', sets: 1, reps: '1 min', rest: '0s' },
                    { name: 'Downward Facing Dog', sets: 3, reps: '5 breaths', rest: '15s' },
                    { name: 'Warrior I', sets: 3, reps: '30s per side', rest: '15s' },
                    { name: 'Warrior II', sets: 3, reps: '30s per side', rest: '15s' },
                    { name: 'Child\'s Pose', sets: 2, reps: '1 min', rest: '30s' }
                ]
            },
            {
                day: 'Wednesday - Hip Opening',
                focus: 'lower Body Mobility',
                exercises: [
                    { name: 'Pigeon Pose', sets: 3, reps: '1 min per side', rest: '15s' },
                    { name: 'Lizard Lunge', sets: 3, reps: '45s per side', rest: '15s' },
                    { name: 'Happy Baby Pose', sets: 2, reps: '1 min', rest: '30s' },
                    { name: 'Butterfly Pose', sets: 2, reps: '2 min', rest: '30s' }
                ]
            },
            {
                day: 'Friday - Restorative',
                focus: 'Deep Relaxation',
                exercises: [
                    { name: 'Cat-Cow', sets: 3, reps: '10 rounds', rest: '15s' },
                    { name: 'Thread the Needle', sets: 2, reps: '1 min per side', rest: '15s' },
                    { name: 'Legs Up The Wall', sets: 1, reps: '5 min', rest: '0s' },
                    { name: 'Savasana', sets: 1, reps: '5 min', rest: '0s' }
                ]
            }
        ]
    },
    {
        id: 'template_powerlifting',
        name: 'Powerlifting Foundations',
        difficulty: 'Advanced',
        duration: '75 min',
        daysPerWeek: 4,
        equipment: 'Full Gym',
        description: 'Focused on the "Big Three": Squat, Bench, and Deadlift.',
        goals: ['Max Strength', 'Power', 'Technique'],
        image: '🥈',
        weeks: 8,
        workouts: [
            {
                day: 'Monday - Squat Day',
                focus: 'Squat & Accessories',
                exercises: [
                    { name: 'Barbell Back Squat', sets: 5, reps: '5 reps (Heavy)', rest: '180s' },
                    { name: 'Pause Squats', sets: 3, reps: '8 reps', rest: '120s' },
                    { name: 'Leg Press', sets: 3, reps: '12 reps', rest: '90s' },
                    { name: 'Leg Curls', sets: 3, reps: '15 reps', rest: '60s' }
                ]
            },
            {
                day: 'Tuesday - Bench Day',
                focus: 'Bench Press & Accessories',
                exercises: [
                    { name: 'Barbell Bench Press', sets: 5, reps: '5 reps (Heavy)', rest: '180s' },
                    { name: 'Close Grip Bench Press', sets: 3, reps: '10 reps', rest: '120s' },
                    { name: 'Overhead Press', sets: 3, reps: '10 reps', rest: '90s' },
                    { name: 'Lateral Raises', sets: 4, reps: '15 reps', rest: '60s' }
                ]
            },
            {
                day: 'Thursday - Deadlift Day',
                focus: 'Deadlift & Accessories',
                exercises: [
                    { name: 'Barbell Deadlift', sets: 5, reps: '3-5 reps (Heavy)', rest: '240s' },
                    { name: 'Romanian Deadlifts', sets: 3, reps: '8 reps', rest: '120s' },
                    { name: 'Barbell Rows', sets: 3, reps: '10 reps', rest: '90s' },
                    { name: 'Pull-ups', sets: 3, reps: 'AMRAP', rest: '120s' }
                ]
            },
            {
                day: 'Friday - Accessory Day',
                focus: 'Weak Point Training',
                exercises: [
                    { name: 'Incline Dumbbell Press', sets: 3, reps: '12 reps', rest: '90s' },
                    { name: 'Front Squats', sets: 3, reps: '8 reps', rest: '120s' },
                    { name: 'Hammer Curls', sets: 3, reps: '12 reps', rest: '60s' },
                    { name: 'Plank', sets: 3, reps: '60s', rest: '60s' }
                ]
            }
        ]
    },
    {
        id: 'template_senior',
        name: 'Senior Strength & Balance',
        difficulty: 'Beginner',
        duration: '30 min',
        daysPerWeek: 3,
        equipment: 'Chair, Light weights',
        description: 'Safe, low-impact movements to maintain independence and vitality.',
        goals: ['Longevity', 'Balance', 'Functional Strength'],
        image: '🌟',
        weeks: 12,
        workouts: [
            {
                day: 'Workout A',
                focus: 'Functional Strength',
                exercises: [
                    { name: 'Chair Squats', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Wall Push-ups', sets: 3, reps: '10-12', rest: '60s' },
                    { name: 'Bicep Curls (Light)', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Shoulder Rolls', sets: 2, reps: '10 reps', rest: '30s' }
                ]
            },
            {
                day: 'Workout B',
                focus: 'Balance & Core',
                exercises: [
                    { name: 'Single Leg Stand (Wall Support)', sets: 3, reps: '20s each', rest: '30s' },
                    { name: 'Heel-to-Toe Walk', sets: 2, reps: '10 steps', rest: '30s' },
                    { name: 'Seated Leg Extensions', sets: 3, reps: '15 reps', rest: '60s' },
                    { name: 'Seated Torso Twists', sets: 3, reps: '10 each side', rest: '45s' }
                ]
            }
        ]
    },
    {
        id: 'template_glutes',
        name: 'Glute Sculpt & Tone',
        difficulty: 'Intermediate',
        duration: '50 min',
        daysPerWeek: 3,
        equipment: 'Bands, Dumbbells',
        description: 'Comprehensive lower body program specifically for glute hypertrophy.',
        goals: ['Hypertrophy', 'Strength', 'Power'],
        image: '🍑',
        weeks: 6,
        workouts: [
            {
                day: 'Monday - Heavy Glutes',
                focus: 'Strength & Power',
                exercises: [
                    { name: 'Hip Thrusts', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Goblet Squats', sets: 3, reps: '12 reps', rest: '90s' },
                    { name: 'Glute Kickbacks (Banded)', sets: 3, reps: '15 each', rest: '60s' },
                    { name: 'Frog Pumps', sets: 3, reps: '30 reps', rest: '45s' }
                ]
            },
            {
                day: 'Wednesday - Accessory Focus',
                focus: 'Shape & Isolation',
                exercises: [
                    { name: 'Curtsy Lunges', sets: 4, reps: '12 each', rest: '60s' },
                    { name: 'Banded Side Walk', sets: 3, reps: '20 steps each', rest: '60s' },
                    { name: 'Romanian Deadlifts (Dumbbell)', sets: 4, reps: '12 reps', rest: '90s' },
                    { name: 'Clamshells', sets: 3, reps: '20 each side', rest: '30s' }
                ]
            },
            {
                day: 'Friday - Glute Burnout',
                focus: 'High Volume Finish',
                exercises: [
                    { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', rest: '90s' },
                    { name: 'Glute Bridge', sets: 4, reps: '20 reps', rest: '60s' },
                    { name: 'Fire Hydrants', sets: 3, reps: '15 each', rest: '30s' },
                    { name: 'Sumo Squat Pulses', sets: 3, reps: '30s', rest: '45s' }
                ]
            }
        ]
    }
];

export default workoutTemplates;
