import React, { useEffect } from 'react';
import { X, PlayCircle, Target, Dumbbell, Activity } from 'lucide-react';

const ExerciseDetailModal = ({ exercise, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-[2rem] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button onClick={onClose} className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md transition-all text-gray-200 hover:text-white border border-white/10 shadow-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar">

          {/* Media Header */}
          <div className="w-full relative bg-gray-900 border-b border-white/5 aspect-video sm:aspect-[21/9] flex items-center justify-center overflow-hidden shrink-0">
            {exercise.gifUrl ? (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-full object-cover mix-blend-screen opacity-90"
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + exercise.id + '/1.jpg'; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-50">
                <PlayCircle className="w-12 h-12 text-white mb-2" />
                <span className="text-white text-sm">No Preview Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/40 to-transparent opacity-90" />
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 flex-1 bg-gradient-to-br from-[#13151f]/95 to-[#0a0a0f]/95 backdrop-blur-xl relative z-10 shrink-0 -mt-20">
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6 tracking-tight capitalize leading-tight">
              {exercise.name}
            </h2>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="uppercase text-[10px] font-black tracking-widest px-3 py-1.5 rounded border border-purple-500/30 text-purple-300 bg-purple-500/10 flex items-center gap-1.5 shadow-inner">
                <Target className="w-3.5 h-3.5" />{exercise.targetMuscle}
              </span>
              <span className="uppercase text-[10px] font-black tracking-widest px-3 py-1.5 rounded border border-white/10 text-gray-300 bg-white/5 flex items-center gap-1.5 shadow-inner">
                <Dumbbell className="w-3.5 h-3.5" />{exercise.equipment}
              </span>
              <span className="uppercase text-[10px] font-black tracking-widest px-3 py-1.5 rounded border border-pink-500/30 text-pink-300 bg-pink-500/10 flex items-center gap-1.5 shadow-inner hidden sm:flex">
                <Activity className="w-3.5 h-3.5" />{exercise.category}
              </span>
            </div>

            {exercise.instructions && exercise.instructions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-purple-500 rounded-full" />
                  Instructions
                </h3>
                <div className="space-y-4 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 shadow-inset">
                  {exercise.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed pt-0.5 group-hover:text-gray-100 transition-colors">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
