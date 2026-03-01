import React, { useEffect } from 'react';
import { X, TrendingUp, Dumbbell, Utensils, Sparkles, BarChart3, ChevronRight, Activity, Target, Brain } from 'lucide-react';

const ScoreRing = ({ score }) => {
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getScoreDetails = (s) => {
        if (s >= 80) return { color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', label: 'Excellent' };  // Emerald
        if (s >= 60) return { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', label: 'Good' };       // Amber
        if (s >= 40) return { color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'Fair' };       // Orange
        return { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'Needs Work' };               // Red
    };

    const details = getScoreDetails(score);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background glowing blur */}
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ backgroundColor: details.glow }}
                />

                <svg className="absolute inset-0 w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke={details.color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="drop-shadow-lg"
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {score}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Score</span>
                </div>
            </div>
            <div
                className="mt-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border"
                style={{
                    color: details.color,
                    backgroundColor: `${details.color}15`,
                    borderColor: `${details.color}30`
                }}
            >
                {details.label}
            </div>
        </div>
    );
};

const MetricBar = ({ icon: Icon, label, value, color, suffix = '%' }) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
        <div className="group relative bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">{label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">
                        {value > 0 && label === 'Strength Change' ? '+' : ''}{value}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">{suffix}</span>
                </div>
            </div>

            <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${clampedValue}%`, backgroundColor: color }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
            </div>
        </div>
    );
};

const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { month: 'short', day: 'numeric' };
    return `${s.toLocaleDateString('en-US', opts)} — ${e.toLocaleDateString('en-US', opts)}`;
};

const WeeklySummaryModal = ({ summary, isOpen, onClose, onViewReport }) => {
    // Lock body scroll when modal is open to prevent underlying page from scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also prevent touching background scroll on iOS Safari
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

    if (!isOpen || !summary) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f1117] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button - Sticky to the top right of the modal window */}
                <div className="absolute top-4 right-4 z-50">
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md transition-all text-gray-200 hover:text-white border border-white/10 shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Modal Content */}
                <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>

                    {/* Left Column (Score & Primary Info) */}
                    <div className="w-full md:w-2/5 md:min-h-full md:sticky md:top-0 relative p-8 py-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-[#0f1117] shrink-0">
                        {/* Abstract background shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 z-0">
                            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 w-full text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6">
                                <Activity className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Weekly Performance</span>
                            </div>

                            <ScoreRing score={summary.score} />

                            <div className="mt-6 text-sm text-gray-400 font-medium bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 inline-block">
                                {formatDateRange(summary.weekStartDate, summary.weekEndDate)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Metrics & Insights) */}
                    <div className="w-full md:w-3/5 p-6 sm:p-8 pb-10 bg-gradient-to-br from-[#13151f] to-[#0a0a0f] shrink-0">

                        {/* 3-Layer Performance Metrics */}
                        <div className="space-y-4 mb-8">
                            <MetricBar
                                icon={Dumbbell}
                                label="Workout Consistency"
                                value={summary.workoutConsistency}
                                color="#8b5cf6" // Violet
                            />
                            <MetricBar
                                icon={Utensils}
                                label="Macro Compliance"
                                value={summary.macroCompliance}
                                color="#06b6d4" // Cyan
                            />
                            <MetricBar
                                icon={TrendingUp}
                                label="Strength Change"
                                value={summary.strengthImprovement}
                                color={summary.strengthImprovement >= 0 ? '#10b981' : '#f43f5e'} // Emerald / Rose
                                suffix="%"
                            />
                        </div>

                        <div className="grid grid-cols-1 space-y-4 object-contain mb-8">
                            {/* Focus Areas */}
                            {summary.areasToImprove && summary.areasToImprove.length > 0 && (
                                <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <Target className="w-5 h-5 text-orange-400" />
                                        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest">Focus Areas</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {summary.areasToImprove.slice(0, 3).map((area, i) => (
                                            <li key={i} className="text-sm text-orange-100/80 flex items-start gap-3 leading-snug">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                                {area}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* AI Insight */}
                            {summary.aiInsight && (
                                <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <Brain className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">AI Insight</h3>
                                    </div>
                                    <p className="text-sm text-purple-100/80 leading-relaxed">
                                        {summary.aiInsight}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={onViewReport}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white py-3.5 rounded-[1rem] font-bold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                            >
                                <BarChart3 className="w-5 h-5" />
                                Full Analytics
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Global shimmer animation for the progress bars */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
            </div>
        </div>
    );
};

export default WeeklySummaryModal;
