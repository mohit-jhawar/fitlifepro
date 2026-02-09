import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar, Dumbbell, Target, TrendingUp, CheckCircle, Youtube } from 'lucide-react';
import workoutTemplates from '../data/workoutTemplates';

const WorkoutTemplates = ({ onBack, onSelectTemplate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const difficultyColors = {
        'Beginner': 'bg-emerald-500 shadow-emerald-500/50',
        'Intermediate': 'bg-amber-500 shadow-amber-500/50',
        'Advanced': 'bg-rose-500 shadow-rose-500/50',
        'All Levels': 'bg-indigo-500 shadow-indigo-500/50'
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    const handleUseTemplate = () => {
        if (selectedTemplate && onSelectTemplate) {
            onSelectTemplate(selectedTemplate);
        }
    };

    if (showPreview && selectedTemplate) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => setShowPreview(false)}
                        className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 font-semibold transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Templates</span>
                    </button>

                    {/* Template Header */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-2xl mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-5xl">{selectedTemplate.image}</span>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedTemplate.name}</h1>
                                        <span className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold mt-2 ${difficultyColors[selectedTemplate.difficulty]}`}>
                                            {selectedTemplate.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm sm:text-lg">{selectedTemplate.description}</p>
                            </div>
                        </div>

                        {/* Template Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl">
                                <Clock className="w-6 h-6 text-purple-600 mb-2" />
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="text-xl font-bold text-gray-900">{selectedTemplate.duration}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl">
                                <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                                <p className="text-sm text-gray-600">Days/Week</p>
                                <p className="text-xl font-bold text-gray-900">{selectedTemplate.daysPerWeek} days</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl">
                                <Dumbbell className="w-6 h-6 text-green-600 mb-2" />
                                <p className="text-sm text-gray-600">Equipment</p>
                                <p className="text-xl font-bold text-gray-900">{selectedTemplate.equipment}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl">
                                <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                                <p className="text-sm text-gray-600">Program Length</p>
                                <p className="text-xl font-bold text-gray-900">{selectedTemplate.weeks} weeks</p>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                Perfect For
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedTemplate.goals.map((goal, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                                        {goal}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Use Template Button */}
                        <button
                            onClick={handleUseTemplate}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-6 h-6" />
                            Save This Program
                        </button>
                    </div>

                    {/* Workout Details */}
                    <div className="space-y-4">
                        {selectedTemplate.workouts.map((workout, workoutIndex) => (
                            <div key={workoutIndex} className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{workout.day}</h3>
                                <p className="text-purple-600 font-semibold mb-4">{workout.focus}</p>

                                <div className="space-y-3">
                                    {workout.exercises.map((exercise, exerciseIndex) => (
                                        <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                    {exerciseIndex + 1}
                                                </span>
                                                <span className="font-semibold text-gray-900">{exercise.name}</span>
                                                <a
                                                    href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(exercise.name)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Watch Tutorial"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Youtube className="w-5 h-5" />
                                                </a>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    {exercise.sets} sets × {exercise.reps}
                                                </p>
                                                <p className="text-xs text-gray-500">Rest: {exercise.rest}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-16 sm:pt-20 lg:pt-28 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        Workout Templates
                    </h1>
                    <p className="text-base sm:text-xl text-white/90">
                        Choose a pre-built program and start training today
                    </p>
                </div>

                {/* Template Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workoutTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="group relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-white overflow-hidden flex flex-row sm:flex-col items-center sm:items-stretch gap-5 sm:gap-0 min-h-[140px] sm:min-h-0"
                            onClick={() => handleSelectTemplate(template)}
                        >
                            {/* Decorative Background Glow - Enhanced for Desktop */}
                            <div className="hidden sm:block absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                            <div className="hidden sm:block absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-all duration-700"></div>

                            {/* Icon Section - Premium Desktop Presentation */}
                            <div className="relative shrink-0 sm:flex sm:justify-between sm:items-start sm:mb-8">
                                <div className="relative group/icon">
                                    {/* Desktop Gradient Ring */}
                                    <div className="hidden sm:block absolute -inset-1 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white sm:bg-purple-50 rounded-xl sm:rounded-2xl border border-purple-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm flex items-center justify-center relative">
                                        <span className="text-3xl sm:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">{template.image}</span>
                                    </div>
                                </div>
                                {/* Floating Difficulty Badge - Sophisticated Desktop Style */}
                                <span className={`hidden sm:inline-block px-4 py-1.5 rounded-2xl text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-lg transform group-hover:scale-105 transition-transform ${difficultyColors[template.difficulty]}`}>
                                    {template.difficulty}
                                </span>
                            </div>

                            {/* Info Section - Responsive typography & layout */}
                            <div className="relative flex-1 min-w-0">
                                <div className="flex flex-col">
                                    {/* Mobile Difficulty Indicator */}
                                    <div className="sm:hidden mb-0.5">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${template.difficulty === 'Beginner' ? 'text-emerald-600' : template.difficulty === 'Intermediate' ? 'text-amber-600' : 'text-rose-600'}`}>
                                            {template.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-3xl font-black text-gray-900 mb-0.5 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300 truncate sm:whitespace-normal">
                                        {template.name}
                                    </h3>

                                    <p className="text-gray-500 text-xs sm:text-base font-medium mb-2 sm:mb-8 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                                        {template.description}
                                    </p>

                                    {/* Quick Stats - Compact horizontal row for all screens */}
                                    <div className="flex items-center gap-2 sm:gap-3 sm:pt-4 sm:border-t sm:border-gray-100 mt-auto">
                                        <div className="flex items-center gap-1 bg-purple-50 py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-lg sm:rounded-xl border border-purple-100 shadow-sm">
                                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                                            <span className="text-[11px] sm:text-xs font-extrabold text-purple-700 uppercase tracking-tighter">{template.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-blue-50 py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-lg sm:rounded-xl border border-blue-100 shadow-sm">
                                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                                            <span className="text-[11px] sm:text-xs font-extrabold text-blue-700 uppercase tracking-tighter">{template.daysPerWeek}X/WEEK</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Goals Badges - Full list on desktop */}
                                <div className="hidden sm:flex flex-wrap gap-2.5 mt-8">
                                    {template.goals.map((goal, index) => (
                                        <span key={index} className="bg-gray-50/80 text-gray-600 px-2.5 py-1 rounded-xl text-xs font-semibold border border-gray-100/50 backdrop-blur-sm shadow-sm group-hover:bg-white group-hover:border-purple-200 transition-all">
                                            {goal}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default WorkoutTemplates;
