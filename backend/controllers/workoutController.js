const WorkoutLogModel = require('../models/WorkoutLogSchema');

exports.createLog = async (req, res) => {
    try {
        const { exerciseName, setsCompleted, totalTime, date, log, ...others } = req.body;
        const userId = req.user.id;

        // Map frontend session to DB schema
        const exercises = [{ name: exerciseName, sets: setsCompleted, log: log }];
        const duration = Math.ceil((totalTime || 0) / 60);

        const workoutLog = await WorkoutLogModel.create({
            user_id: userId,
            workout_date: date || new Date(),
            exercises: exercises,
            duration_minutes: duration,
            completed: true
        });

        // Format back to frontend structure
        const formattedSession = {
            id: workoutLog._id,
            date: workoutLog.workout_date,
            exerciseName: exercises[0].name,
            setsCompleted: exercises[0].sets,
            totalTime: workoutLog.duration_minutes * 60, // approx
            ...others
        };

        res.status(201).json({ success: true, session: formattedSession });
    } catch (err) {
        console.error('Create Log Error:', err);
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
            const ex = exercises[0] || {};
            return {
                id: row._id,
                date: row.workout_date,
                exerciseName: ex.name || 'Unknown Log',
                setsCompleted: ex.sets,
                totalTime: (row.duration_minutes || 0) * 60,
            };
        });

        res.json({ success: true, sessions });
    } catch (err) {
        console.error('Get Logs Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
