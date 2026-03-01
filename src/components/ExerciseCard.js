import React from 'react';
import { Target, Dumbbell, Activity, ShieldCheck, Zap } from 'lucide-react';

export const TARGET_MUSCLE_CONFIG = {
  'abdominals': { icon: <Target className="w-3 h-3" />, color: '#3b82f6' },
  'abductors': { icon: <Target className="w-3 h-3" />, color: '#ef4444' },
  'adductors': { icon: <Target className="w-3 h-3" />, color: '#f97316' },
  'biceps': { icon: <Dumbbell className="w-3 h-3" />, color: '#8b5cf6' },
  'calves': { icon: <Zap className="w-3 h-3" />, color: '#10b981' },
  'chest': { icon: <Target className="w-3 h-3" />, color: '#64748b' },
  'forearms': { icon: <Dumbbell className="w-3 h-3" />, color: '#eab308' },
  'glutes': { icon: <Target className="w-3 h-3" />, color: '#d946ef' },
  'hamstrings': { icon: <Zap className="w-3 h-3" />, color: '#06b6d4' },
  'lats': { icon: <ShieldCheck className="w-3 h-3" />, color: '#14b8a6' },
  'lower back': { icon: <ShieldCheck className="w-3 h-3" />, color: '#f43f5e' },
  'middle back': { icon: <ShieldCheck className="w-3 h-3" />, color: '#8b5cf6' },
  'neck': { icon: <Activity className="w-3 h-3" />, color: '#10b981' },
  'quadriceps': { icon: <Zap className="w-3 h-3" />, color: '#eab308' },
  'shoulders': { icon: <ShieldCheck className="w-3 h-3" />, color: '#ef4444' },
  'traps': { icon: <Target className="w-3 h-3" />, color: '#3b82f6' },
  'triceps': { icon: <Dumbbell className="w-3 h-3" />, color: '#06b6d4' },
};

const ExerciseCard = ({ exercise, onClick }) => {
  const musc = TARGET_MUSCLE_CONFIG[exercise.targetMuscle?.toLowerCase()] || { icon: <Target className="w-3 h-3" />, color: '#a855f7' };

  return (
    <div
      onClick={() => onClick(exercise)}
      className="group relative glass-card rounded-3xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:-translate-y-1 cursor-pointer flex flex-col h-[280px]"
    >
      {/* ── Media Header ── */}
      <div className="h-[160px] relative bg-black/40 p-2 flex items-center justify-center overflow-hidden shrink-0">
        {exercise.gifUrl ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 rounded-xl"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + exercise.id + '/1.jpg'; }}
          />
        ) : (
          <Dumbbell className="w-10 h-10 text-white/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13151f] via-transparent to-transparent opacity-90" />

        {/* Category Badge Floating Top Left */}
        <div
          className="absolute top-3 left-3 px-2 py-1 rounded-lg border backdrop-blur-md flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest z-10"
          style={{ backgroundColor: `${musc.color}20`, borderColor: `${musc.color}40`, color: musc.color }}
        >
          {musc.icon}
          {exercise.targetMuscle}
        </div>
      </div>

      {/* ── Details Footer ── */}
      <div className="p-5 flex flex-col flex-1 relative z-10 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-black text-lg leading-tight mb-auto group-hover:text-purple-300 transition-colors line-clamp-2">
          {exercise.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded inline-flex font-bold uppercase tracking-wider backdrop-blur-md border border-white/5">
            {exercise.equipment}
          </span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded inline-flex font-black uppercase tracking-wider border border-purple-500/30 ml-auto">
            {exercise.targetMuscle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
