import React, { useState, useEffect } from 'react';
import {
    Play, Pause, SkipForward, RotateCcw, Clock, CheckCircle,
    X, Youtube, Plus, Minus, Dumbbell, ChevronDown, ChevronUp,
    Flame, ArrowRight, Target
} from 'lucide-react';

/* ─── Common exercises for autocomplete ─── */
const SUGGESTIONS = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-Up', 'Push-Up',
    'Shoulder Press', 'Barbell Row', 'Lat Pulldown', 'Leg Press',
    'Bicep Curl', 'Tricep Dip', 'Plank', 'Lunges', 'Hip Thrust',
    'Cable Fly', 'Incline Press', 'Romanian Deadlift', 'Face Pull',
];
const REST_PRESETS = [30, 60, 90, 120];

const fmt = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/* ─── Circular rest ring ─── */
const RestRing = ({ restTime, restDuration }) => {
    const R = 52, C = 2 * Math.PI * R;
    const offset = C * (1 - (restDuration > 0 ? restTime / restDuration : 0));
    return (
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="60" cy="60" r={R} fill="none" stroke="url(#rg)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
            <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>
        </svg>
    );
};

/* ─── Dot progress bar showing set completion ─── */
const SetDots = ({ total, completed, current }) => (
    <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {Array.from({ length: total }, (_, i) => {
            const done = i < completed;
            const active = i === completed && current;
            return (
                <div key={i} className={`rounded-full transition-all duration-500 ${done ? 'w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 shadow shadow-green-500/40' :
                    active ? 'w-5 h-5 bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow shadow-violet-500/50 scale-110' :
                        'w-4 h-4 bg-white/10 border border-white/15'
                    }`} />
            );
        })}
    </div>
);

/* ══════════════════════════════════════════════════════════
   PHASE: PLAN — user sets up the exercise before starting
══════════════════════════════════════════════════════════ */
const PlanPhase = ({ onStart, totalSessionTime, exercisesDone }) => {
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [showDrop, setShowDrop] = useState(false);
    const [targetSets, setTargetSets] = useState(3);
    const [restDuration, setRestDuration] = useState(60);

    const filtered = SUGGESTIONS.filter(s =>
        query && s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
    );

    const handleSelect = (n) => { setName(n); setQuery(n); setShowDrop(false); };

    return (
        <div className="flex flex-col gap-4 px-5 py-4">
            {/* Exercise name */}
            <div className="relative">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5 block">Exercise Name</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            value={query}
                            onChange={e => { setQuery(e.target.value); setName(e.target.value); setShowDrop(true); }}
                            onFocus={() => setShowDrop(true)}
                            onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                            placeholder="Search or type exercise…"
                            className="w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold placeholder-white/25 focus:outline-none focus:border-violet-400/60 border border-white/10 transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                        />
                        {showDrop && filtered.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                                {filtered.slice(0, 6).map(s => (
                                    <button key={s} onMouseDown={() => handleSelect(s)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
                                        <Dumbbell className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />{s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {query && (
                        <a href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(query)}+form`}
                            target="_blank" rel="noopener noreferrer"
                            className="px-3 bg-red-600/70 hover:bg-red-600 border border-red-500/30 text-white rounded-xl flex items-center transition-colors"
                            title="Watch form tutorial">
                            <Youtube className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Target Sets */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-3">How many sets?</p>
                <div className="flex items-center justify-between gap-3">
                    <button onClick={() => setTargetSets(n => Math.max(1, n - 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-4xl font-bold text-white">{targetSets}</span>
                    <button onClick={() => setTargetSets(n => n + 1)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Rest duration */}
            <div>
                <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-2">Rest Between Sets</p>
                <div className="flex gap-2">
                    {REST_PRESETS.map(s => (
                        <button key={s} onClick={() => setRestDuration(s)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${restDuration === s
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow shadow-orange-500/20'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}>
                            {s}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Exercise summary preview */}
            {name.trim() && (
                <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-3">
                    <Target className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <p className="text-white/80 text-sm">
                        <span className="font-bold text-violet-300">{name}</span>
                        {' — '}{targetSets} set{targetSets !== 1 ? 's' : ''}
                        {' · '}{fmt(restDuration)} rest between sets
                    </p>
                </div>
            )}

            {/* Start button */}
            <button
                onClick={() => onStart({ name: name.trim(), targetSets, restDuration })}
                disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed">
                <Play className="w-5 h-5" />
                Start {name.trim() ? `"${name.trim()}"` : 'Exercise'}
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   PHASE: ACTIVE — guided through each set
══════════════════════════════════════════════════════════ */
const ActivePhase = ({ exercise, onSetComplete, onExerciseDone, onSkipRest }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [setTimer, setSetTimer] = useState(0);
    const [completedSets, setCompletedSets] = useState([]);
    const [isResting, setIsResting] = useState(false);
    const [restTime, setRestTime] = useState(0);
    const [isDone, setIsDone] = useState(false);

    const currentSetNum = completedSets.length + 1;
    const isLastSet = currentSetNum === exercise.targetSets;
    const allDone = completedSets.length === exercise.targetSets;

    /* Set clock */
    useEffect(() => {
        let t;
        if (isRunning && !isResting && !allDone) t = setInterval(() => setSetTimer(p => p + 1), 1000);
        return () => clearInterval(t);
    }, [isRunning, isResting, allDone]);

    /* Rest clock */
    useEffect(() => {
        let t;
        if (isResting && restTime > 0) {
            t = setInterval(() => {
                setRestTime(p => {
                    if (p <= 1) { beep(880); setIsResting(false); setIsRunning(false); return 0; }
                    if (p === 3) beep(600);
                    return p - 1;
                });
            }, 1000);
        }
        return () => clearInterval(t);
    }, [isResting, restTime]);

    const beep = (freq) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator(), g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.frequency.value = freq; osc.type = 'sine';
            g.gain.setValueAtTime(0.25, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
        } catch (e) { }
    };

    const handleDoneSet = () => {
        const setData = { set: currentSetNum, duration: setTimer };
        const next = [...completedSets, setData];
        setCompletedSets(next);
        onSetComplete(setData);
        setSetTimer(0);
        setIsRunning(false);

        if (next.length === exercise.targetSets) {
            setIsDone(true);
            beep(1000);
        } else {
            setIsResting(true);
            setRestTime(exercise.restDuration);
        }
    };

    const skipRest = () => { setIsResting(false); setRestTime(0); };

    /* ── All sets done screen ── */
    if (isDone) {
        return (
            <div className="px-5 py-6 flex flex-col items-center gap-5 text-center">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 text-3xl">
                    🏆
                </div>
                <div>
                    <h3 className="text-white font-bold text-xl">{exercise.name} — Done!</h3>
                    <p className="text-white/50 text-sm mt-1">
                        {exercise.targetSets} sets
                    </p>
                </div>
                {/* Set recap */}
                <div className="w-full space-y-2">
                    {completedSets.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-2.5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{s.set}</span>
                                <span className="text-white/80 text-sm">Set {s.set}</span>
                            </div>
                            <span className="text-white/40 text-xs font-mono">{fmt(s.duration)}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => onExerciseDone(completedSets)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]">
                    <Plus className="w-4 h-4" />
                    Add Next Exercise
                </button>
            </div>
        );
    }

    return (
        <div className="px-5 py-4 flex flex-col gap-4">
            {/* Exercise title + set progress dots */}
            <div className="text-center">
                <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
                <p className="text-white/40 text-xs mb-3">{exercise.targetSets} sets planned</p>
                <SetDots total={exercise.targetSets} completed={completedSets.length} current={isRunning || setTimer > 0} />
                <p className="text-white/40 text-xs mt-2">
                    {isResting ? `Resting — Set ${currentSetNum} next` : `Set ${currentSetNum} of ${exercise.targetSets}`}
                </p>
            </div>

            {/* Timer area */}
            {isResting ? (
                <div className="flex flex-col items-center py-2">
                    <div className="relative w-36 h-36">
                        <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-xl" />
                        <RestRing restTime={restTime} restDuration={exercise.restDuration} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-bold font-mono ${restTime <= 3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{fmt(restTime)}</span>
                            <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Rest</span>
                        </div>
                    </div>
                    <p className="text-white/35 text-xs mt-1.5">
                        {isLastSet ? 'Last set coming up!' : `Get ready for set ${currentSetNum} 💪`}
                    </p>
                </div>
            ) : (
                <div className={`rounded-2xl p-6 text-center relative overflow-hidden transition-all duration-500 ${isRunning
                    ? 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-400/25'
                    : 'bg-white/5 border border-white/8'
                    }`} style={{ borderColor: !isRunning ? 'rgba(255,255,255,0.07)' : undefined }}>
                    {isRunning && (
                        <div className="absolute inset-0 opacity-15 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                        </div>
                    )}
                    <div className="relative z-10">
                        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isRunning ? 'text-violet-300' : 'text-white/25'}`}>
                            {isRunning ? `Set ${currentSetNum} — In Progress` : `Press Start for Set ${currentSetNum}`}
                        </p>
                        <div className={`text-7xl font-bold font-mono leading-none mb-2 ${isRunning ? 'text-white' : 'text-white/30'}`}>
                            {fmt(setTimer)}
                        </div>
                        <p className={`text-sm ${isRunning ? 'text-white/50' : 'text-white/20'}`}>
                            {isRunning ? (isLastSet ? 'Make it count — last set! 🔥' : 'Keep going 💪') : `Target: ${exercise.reps} reps`}
                        </p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsRunning(p => !p)} disabled={isResting}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-40 text-white ${isRunning
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25'
                        : 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-500/25'
                        }`}>
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isRunning ? 'Pause' : setTimer > 0 ? 'Resume' : 'Start'}
                </button>

                {isResting ? (
                    <button onClick={skipRest}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95">
                        <SkipForward className="w-5 h-5" />
                        Skip Rest
                    </button>
                ) : (
                    <button onClick={handleDoneSet} disabled={setTimer === 0}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${isLastSet
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-500/25'
                            : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-violet-500/25'
                            }`}>
                        <CheckCircle className="w-5 h-5" />
                        {isLastSet ? 'Finish!' : 'Done Set'}
                    </button>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */
const WorkoutTimer = ({ onClose, onSaveSession, onSaveProgress }) => {
    const [phase, setPhase] = useState('plan');      // 'plan' | 'active'
    const [currentExercise, setCurrentExercise] = useState(null);
    const [sessionExercises, setSessionExercises] = useState([]);
    const [workoutTime, setWorkoutTime] = useState(0);
    const [sessionRunning, setSessionRunning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showLog, setShowLog] = useState(false);

    const totalSets = sessionExercises.reduce((s, e) => s + e.sets.length, 0);

    /* Session clock */
    useEffect(() => {
        let t;
        if (sessionRunning) t = setInterval(() => setWorkoutTime(p => p + 1), 1000);
        return () => clearInterval(t);
    }, [sessionRunning]);

    const buildSession = (exList) => ({
        date: new Date().toISOString(),
        totalTime: workoutTime,
        setsCompleted: exList.reduce((s, e) => s + e.sets.length, 0),
        exercises: exList,
        exerciseName: exList[0]?.name || 'Workout',
    });

    const handleStart = (config) => {
        setCurrentExercise(config);
        setSessionRunning(true);
        setPhase('active');
    };

    const handleSetComplete = (setData) => {
        setSessionExercises(prev => {
            const idx = prev.findIndex(e => e.name === currentExercise.name);
            let next;
            if (idx >= 0) {
                next = [...prev];
                next[idx] = { ...next[idx], sets: [...next[idx].sets, setData] };
            } else {
                next = [...prev, { name: currentExercise.name, sets: [setData] }];
            }
            if (onSaveProgress) onSaveProgress(buildSession(next));
            return next;
        });
    };

    const handleExerciseDone = (completedSets) => {
        setCurrentExercise(null);
        setPhase('plan');
    };

    const handleSave = async () => {
        if (workoutTime === 0 && totalSets === 0) return;
        setSaving(true);
        const result = await onSaveSession(buildSession(sessionExercises));
        setSaving(false);
        if (result && !result.success) return;
        setSessionRunning(false);
        setWorkoutTime(0);
        setSessionExercises([]);
        setPhase('plan');
        setCurrentExercise(null);
    };

    const handleClose = async () => {
        if ((workoutTime > 0 || totalSets > 0) && onSaveSession) {
            setSaving(true);
            const result = await onSaveSession(buildSession(sessionExercises));
            setSaving(false);
            if (result && !result.success) return;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-start justify-center z-50 p-3 sm:p-6 overflow-y-auto">
            <div className="bg-gradient-to-b from-slate-900 via-[#170f2a] to-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 my-4"
                style={{ animation: 'twSlide .35s cubic-bezier(.4,0,.2,1)' }}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-violet-500/30">
                            <Dumbbell className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white leading-tight">
                                {phase === 'plan' ? 'Plan Exercise' : currentExercise?.name}
                            </h2>
                            <p className="text-white/35 text-[11px]">
                                {sessionExercises.length} exercise{sessionExercises.length !== 1 ? 's' : ''} · {totalSets} sets done
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-300" />
                            <span className="font-mono font-bold text-sm text-white">{fmt(workoutTime)}</span>
                        </div>
                        <button onClick={handleClose} disabled={saving} className="p-1.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl transition-all">
                            <X className="w-5 h-5 text-white/50" />
                        </button>
                    </div>
                </div>

                {/* ── Phase content ── */}
                {phase === 'plan'
                    ? <PlanPhase onStart={handleStart} totalSessionTime={workoutTime} exercisesDone={sessionExercises.length} />
                    : <ActivePhase
                        exercise={currentExercise}
                        onSetComplete={handleSetComplete}
                        onExerciseDone={handleExerciseDone}
                        onSkipRest={() => { }}
                    />
                }

                {/* ── Session log + Save (always visible at bottom) ── */}
                {sessionExercises.length > 0 && (
                    <div className="px-5 pb-5 flex flex-col gap-3 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        {/* Collapsible log */}
                        <button onClick={() => setShowLog(p => !p)}
                            className="w-full flex items-center justify-between bg-white/5 border border-white/8 rounded-2xl px-4 py-2.5 text-white/60 hover:text-white transition-colors text-sm font-semibold"
                            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                            <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-400" />
                                Session Log — {sessionExercises.length} exercise{sessionExercises.length !== 1 ? 's' : ''}, {totalSets} sets
                            </div>
                            {showLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showLog && (
                            <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden max-h-48 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                                {sessionExercises.map((ex, ei) => (
                                    <div key={ei} className={ei > 0 ? 'border-t' : ''} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        <div className="flex items-center justify-between px-4 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-violet-500/30 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Dumbbell className="w-3 h-3 text-violet-300" />
                                                </div>
                                                <span className="text-white font-semibold text-sm">{ex.name}</span>
                                            </div>
                                            <span className="text-violet-300 text-xs font-bold">{ex.sets.length} sets</span>
                                        </div>
                                        <div className="px-4 pb-2.5 space-y-1">
                                            {ex.sets.map((set, si) => (
                                                <div key={si} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-green-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{set.set}</span>
                                                        <span className="text-white/70 text-xs">Set {set.set}</span>
                                                    </div>
                                                    <span className="text-white/35 text-xs font-mono">{fmt(set.duration)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button onClick={handleSave} disabled={saving}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40">
                            <RotateCcw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                            {saving ? 'Saving…' : 'Save & Finish Workout'}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes twSlide {
                    from { transform: translateY(28px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WorkoutTimer;
