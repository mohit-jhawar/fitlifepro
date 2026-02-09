import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Clock, Timer, CheckCircle, X, Zap, TrendingUp, Youtube } from 'lucide-react';

const WorkoutTimer = ({ onClose, onSaveSession }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [workoutTime, setWorkoutTime] = useState(0);
    const [exerciseTime, setExerciseTime] = useState(0);
    const [restTime, setRestTime] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [restDuration, setRestDuration] = useState(60);
    const [exerciseName, setExerciseName] = useState('');
    const [completedSets, setCompletedSets] = useState([]);
    const [showCompletedAnimation, setShowCompletedAnimation] = useState(false);

    // Workout timer
    useEffect(() => {
        let interval;
        if (isRunning && !isResting) {
            interval = setInterval(() => {
                setWorkoutTime(prev => prev + 1);
                setExerciseTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isResting]);

    // Rest timer (countdown)
    useEffect(() => {
        let interval;
        if (isRunning && isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime(prev => {
                    if (prev <= 1) {
                        playAlert();
                        setIsResting(false);
                        return 0;
                    }
                    // Play warning beep at 3 seconds
                    if (prev === 3) {
                        playWarningBeep();
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isResting, restTime]);

    const playAlert = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    const playWarningBeep = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        // Save session before resetting if there was any workout activity
        if (workoutTime > 0 && onSaveSession) {
            const session = {
                date: new Date().toISOString(),
                totalTime: workoutTime,
                setsCompleted: completedSets.length,
                exercises: completedSets,
                exerciseName: exerciseName || 'Workout'
            };
            onSaveSession(session);
        }

        setIsRunning(false);
        setWorkoutTime(0);
        setExerciseTime(0);
        setRestTime(0);
        setIsResting(false);
        setCurrentSet(1);
        setCompletedSets([]);
    };

    const handleCompleteSet = () => {
        const setData = {
            set: currentSet,
            exercise: exerciseName || 'Exercise',
            duration: exerciseTime
        };

        setCompletedSets([...completedSets, setData]);
        setCurrentSet(currentSet + 1);
        setExerciseTime(0);

        // Show animation
        setShowCompletedAnimation(true);
        setTimeout(() => setShowCompletedAnimation(false), 1000);

        // Start rest timer
        setIsResting(true);
        setRestTime(restDuration);
    };

    const handleSkipRest = () => {
        setIsResting(false);
        setRestTime(0);
    };

    const handleClose = () => {
        // Save session if there was any workout activity
        if (workoutTime > 0 && onSaveSession) {
            const session = {
                date: new Date().toISOString(),
                totalTime: workoutTime,
                setsCompleted: completedSets.length,
                exercises: completedSets,
                exerciseName: exerciseName || 'Workout'
            };
            onSaveSession(session);
        }
        onClose();
    };

    // Calculate progress percentage for rest timer
    const restProgress = restDuration > 0 ? ((restDuration - restTime) / restDuration) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-5 sm:p-8 max-w-3xl w-full shadow-2xl border border-purple-500/30 animate-slideUp my-4 sm:my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                            <Timer className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Workout Timer</h2>
                            <p className="text-purple-300 text-sm">Track your sets & rest periods</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Exercise Name Input */}
                <div className="mb-4 sm:mb-6">
                    <label className="text-purple-300 text-sm font-semibold mb-2 block">Exercise Name</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="e.g., Bench Press, Squats..."
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-purple-500/30 text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-purple-400 transition-all"
                        />
                        {exerciseName && (
                            <a
                                href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(exerciseName)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
                                title="Watch Tutorial"
                            >
                                <Youtube className="w-6 h-6" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Main Timer Display */}
                <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6 text-center transition-all duration-500 ${isResting
                    ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/50'
                    : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/50'
                    }`}>
                    {/* Background Animation */}
                    <div className={`absolute inset-0 opacity-20 ${isRunning ? 'animate-pulse' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
                    </div>

                    <div className="relative z-10">
                        {isResting ? (
                            <>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Zap className="w-6 h-6 text-orange-300 animate-bounce" />
                                    <p className="text-orange-300 font-bold text-xl uppercase tracking-wide">Rest Time</p>
                                    <Zap className="w-6 h-6 text-orange-300 animate-bounce" />
                                </div>
                                <div className={`text-6xl sm:text-8xl font-bold mb-4 transition-all ${restTime <= 3 ? 'text-red-400 animate-pulse' : 'text-white'
                                    }`}>
                                    {formatTime(restTime)}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${restProgress}%` }}
                                    ></div>
                                </div>

                                <p className="text-white/70 text-lg">Get ready for the next set!</p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <TrendingUp className="w-6 h-6 text-green-300" />
                                    <p className="text-green-300 font-bold text-xl uppercase tracking-wide">Exercise Time</p>
                                </div>
                                <div className="text-6xl sm:text-8xl font-bold text-white mb-2">
                                    {formatTime(exerciseTime)}
                                </div>
                                <p className="text-white/70 text-lg">Keep pushing! 💪</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-3 sm:p-4 text-center hover:scale-105 transition-transform">
                        <Clock className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                        <p className="text-xs text-blue-200 mb-1 uppercase tracking-wide">Total Time</p>
                        <p className="text-2xl font-bold text-white">{formatTime(workoutTime)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-3 sm:p-4 text-center hover:scale-105 transition-transform">
                        <CheckCircle className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                        <p className="text-xs text-purple-200 mb-1 uppercase tracking-wide">Current Set</p>
                        <p className="text-2xl font-bold text-white">{currentSet}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-3 sm:p-4 text-center">
                        <Timer className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                        <p className="text-xs text-orange-200 mb-1 uppercase tracking-wide">Rest (sec)</p>
                        <input
                            type="number"
                            value={restDuration}
                            onChange={(e) => setRestDuration(Math.max(10, parseInt(e.target.value) || 60))}
                            className="w-full text-2xl font-bold text-white bg-transparent text-center focus:outline-none hover:bg-white/10 rounded-lg transition-all"
                            disabled={isRunning}
                        />
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        onClick={handleStartPause}
                        className={`group relative overflow-hidden flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${isRunning
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            }`}
                    >
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        <div className="relative z-10 flex items-center gap-2">
                            {isRunning ? (
                                <>
                                    <Pause className="w-6 h-6" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6" />
                                    Start
                                </>
                            )}
                        </div>
                    </button>

                    {isResting ? (
                        <button
                            onClick={handleSkipRest}
                            className="group relative overflow-hidden flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all transform hover:scale-105 shadow-lg"
                        >
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="relative z-10 flex items-center gap-2">
                                <SkipForward className="w-6 h-6" />
                                Skip Rest
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={handleCompleteSet}
                            disabled={!isRunning && exerciseTime === 0}
                            className="group relative overflow-hidden flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="relative z-10 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" />
                                Complete Set
                            </div>
                        </button>
                    )}
                </div>

                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all transform hover:scale-105 shadow-lg"
                >
                    <RotateCcw className="w-5 h-5" />
                    Save & Reset Workout
                </button>

                {/* Completed Sets Log */}
                {completedSets.length > 0 && (
                    <div className="mt-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Completed Sets ({completedSets.length})
                        </h3>
                        <div className="space-y-2">
                            {completedSets.map((set, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-3 flex items-center justify-between hover:scale-102 transition-transform"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div>
                                        <p className="text-white font-semibold flex items-center gap-2">
                                            <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                                                {set.set}
                                            </span>
                                            {set.exercise}
                                        </p>
                                        <p className="text-green-200 text-sm ml-8">Duration: {formatTime(set.duration)}</p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Animation */}
                {showCompletedAnimation && (
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                        <div className="text-8xl animate-ping">✅</div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
        </div>
    );
};

export default WorkoutTimer;
