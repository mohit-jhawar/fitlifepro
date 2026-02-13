const WorkoutLogModel = require('../models/WorkoutLogSchema');

exports.createLog = async (req, res) => {
    try {
        const { exerciseName, setsCompleted, totalTime, date, log, exercises: rawExercises, completed = true, ...others } = req.body;
        const userId = req.user.id;

        // Map frontend session to DB schema
        // If rawExercises is provided (from real-time sync), use that. Otherwise construct from single exercise fields.
        let exercises = [];
        if (rawExercises && Array.isArray(rawExercises)) {
            exercises = rawExercises;
        } else if (exerciseName) {
            exercises = [{ name: exerciseName, sets: setsCompleted, log: log }];
        }

        const duration = Math.ceil((totalTime || 0) / 60);

        const workoutLog = await WorkoutLogModel.create({
            user_id: userId,
            workout_date: date || new Date(),
            exercises: exercises,
            duration_minutes: duration,
            completed: completed
        });

        // Format back to frontend structure
        const formattedSession = {
            id: workoutLog._id,
            date: workoutLog.workout_date,
            exerciseName: exercises.length > 0 ? exercises[0].name : 'Workout',
            setsCompleted: exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0),
            totalTime: workoutLog.duration_minutes * 60,
            exercises: workoutLog.exercises,
            completed: workoutLog.completed,
            ...others
        };

        res.status(201).json({ success: true, session: formattedSession });
    } catch (err) {
        console.error('Create Log Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { exercises, totalTime, completed } = req.body;
        const userId = req.user.id;

        const duration = Math.ceil((totalTime || 0) / 60);

        const updates = {
            duration_minutes: duration
        };

        if (exercises) {
            updates.exercises = exercises;
        }

        if (completed !== undefined) {
            updates.completed = completed;
        }

        const workoutLog = await WorkoutLogModel.findOneAndUpdate(
            { _id: id, user_id: userId },
            { $set: updates },
            { new: true }
        );

        if (!workoutLog) {
            return res.status(404).json({ success: false, message: 'Workout log not found' });
        }

        // Format back to frontend structure
        const formattedSession = {
            id: workoutLog._id,
            date: workoutLog.workout_date,
            exercises: workoutLog.exercises,
            totalTime: workoutLog.duration_minutes * 60,
            completed: workoutLog.completed
        };

        res.json({ success: true, session: formattedSession });
    } catch (err) {
        console.error('Update Log Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const logs = await WorkoutLogModel.find({ user_id: userId })
            .sort({ workout_date: -1 })
            .lean();

        // Map back to frontend 'session' format
        const sessions = logs.map(row => {
            const exercises = row.exercises || [];
            // Handle both legacy (single exercise) and new (array) structures if necessary, though schema is mixed
            // If exercises is an array of objects
            const primaryExercise = Array.isArray(exercises) && exercises.length > 0 ? exercises[0].name : 'Unknown Workout';
            const totalSets = Array.isArray(exercises) ? exercises.reduce((acc, ex) => acc + (ex.sets || 1), 0) : 0;

            return {
                id: row._id,
                date: row.workout_date,
                exerciseName: primaryExercise, // For display in simple list
                exercises: exercises, // Full details
                setsCompleted: totalSets,
                totalTime: (row.duration_minutes || 0) * 60,
                completed: row.completed
            };
        });

        res.json({ success: true, sessions });
    } catch (err) {
        console.error('Get Logs Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
