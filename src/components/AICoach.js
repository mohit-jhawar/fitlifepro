import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
import { aiAPI } from '../services/api';

const AICoach = ({ onBack }) => {
    const [showInquiry, setShowInquiry] = useState(true);
    const [activeStep, setActiveStep] = useState(1);
    const [inquiryData, setInquiryData] = useState({
        // 1. Basic Body Stats
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        targetWeight: '',
        bodyFat: '',
        waist: '',
        // 2. Goal
        goal: '',
        timeline: '',
        // 3. Environment
        location: 'gym',
        equipment: '',
        daysPerWeek: '4',
        minutesPerSession: '60',
        // 4. Experience
        level: 'Intermediate',
        prBench: '',
        prSquat: '',
        prDeadlift: '',
        // 5. Diet
        dietType: 'Non-Veg',
        egg: 'Yes',
        allergies: '',
        budget: 'Medium',
        mealSource: 'Cooking myself',
        proteinEstimate: '',
        tracksCalories: 'No',
        // 6. Lifestyle
        sleep: '7',
        stress: 'Medium',
        activityLevel: 'Sedentary',
        steps: '',
        occupation: '',
        // 7. Clinical
        injuries: '',
        surgeries: '',
        // 8. Visuals
        physiqueType: '',
        fatStorage: '',
        // 9. Mindset
        consistency: '7',
        boredom: 'Medium',
        enjoyment: 'High',
        structurePreference: 'Strict',
        // 10. Strategy
        dataDepth: 'Actionable',
        adjustmentFreq: 'Weekly'
    });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dossierContext, setDossierContext] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInquirySubmit = (e) => {
        if (e) e.preventDefault();
        setShowInquiry(false);

        const dossier = `
            COMPREHENSIVE ATHLETE DOSSIER:
            1. BIO: Age ${inquiryData.age}, Gender ${inquiryData.gender}, Height ${inquiryData.height}cm, Weight ${inquiryData.weight}kg, Target ${inquiryData.targetWeight}kg, BF% ${inquiryData.bodyFat || 'Unknown'}, Waist ${inquiryData.waist || 'Unknown'}cm.
            2. GOAL: ${inquiryData.goal} (Timeline: ${inquiryData.timeline}).
            3. ENVIRONMENT: ${inquiryData.location} based, Equipment: ${inquiryData.equipment || 'Standard'}, ${inquiryData.daysPerWeek} days/wk, ${inquiryData.minutesPerSession} min/session.
            4. MASTERY: ${inquiryData.level} level. PRs: Bench ${inquiryData.prBench || 'N/A'}, Squat ${inquiryData.prSquat || 'N/A'}, DL ${inquiryData.prDeadlift || 'N/A'}.
            5. NUTRITION: ${inquiryData.dietType} (${inquiryData.egg === 'Yes' ? 'incl. eggs' : 'no eggs'}), Allergies: ${inquiryData.allergies || 'None'}, Budget: ${inquiryData.budget}, Source: ${inquiryData.mealSource}, Protein: ${inquiryData.proteinEstimate || 'Unknown'}, Tracks: ${inquiryData.tracksCalories}.
            6. LIFESTYLE: Sleep ${inquiryData.sleep}h, Stress ${inquiryData.stress}, ${inquiryData.activityLevel} activity, Steps ${inquiryData.steps || 'Unknown'}, Occupation: ${inquiryData.occupation || 'Not specified'}.
            7. CLINICAL: Injuries: ${inquiryData.injuries || 'None'}, Surgeries: ${inquiryData.surgeries || 'None'}.
            8. VISUALS: Physique: ${inquiryData.physiqueType || 'Not described'}, Fat storage: ${inquiryData.fatStorage || 'Not specified'}.
            9. MINDSET: Consistency ${inquiryData.consistency}/10, Boredom ${inquiryData.boredom}, Enjoyment ${inquiryData.enjoyment}, Prefers ${inquiryData.structurePreference} structure.
            10. STRATEGY: Preference for ${inquiryData.dataDepth} data, ${inquiryData.adjustmentFreq} adjustments.

            INSTRUCTION: Act as an elite AI Fitness Coach. I am a coder building apps. Use the specific data above to create a highly personalized opening strategy. Acknowledge my occupation and lifestyle if it impacts my goals. Stay professional, motivating, and evidence-based.
        `;

        setDossierContext(dossier);
        setMessages([{
            role: 'model',
            content: "Welcome to AI Coach Pro. Your athlete dossier has been initialized and securely stored. I have analyzed your stats, lifestyle as a coder, and goals. I am ready to begin. How can I help you reach your peak today?"
        }]);
    };

    const steps = [
        { id: 1, title: 'Bio Stats', icon: '🧍' },
        { id: 2, title: 'Your Goal', icon: '🎯' },
        { id: 3, title: 'Training', icon: '🏋️' },
        { id: 4, title: 'Mastery', icon: '📊' },
        { id: 5, title: 'Nutrition', icon: '🥗' },
        { id: 6, title: 'Lifestyle', icon: '🛌' },
        { id: 7, title: 'Physical', icon: '🏥' },
        { id: 8, title: 'Visuals', icon: '📸' },
        { id: 9, title: 'Mindset', icon: '🧠' },
        { id: 10, title: 'Strategy', icon: '📈' }
    ];

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 10));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API
            let history = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            let finalMessage = userMessage.content;

            // If this is the first real message and we have a dossier, inject it
            if (dossierContext && messages.length <= 1) {
                finalMessage = `[CONTEXT: ATHLETE DOSSIER ATTACHED]\n\n${dossierContext}\n\n[USER FIRST MESSAGE]: ${userMessage.content}`;
            }

            const response = await aiAPI.chat(finalMessage, history);

            if (response.success) {
                setMessages(prev => [...prev, { role: 'model', content: response.message }]);
            } else {
                throw new Error(response.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('AI Chat Error:', error);

            let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";

            // Handle specific status codes if available (aiAPI might throw or return objects)
            if (error.status === 429 || (error.response && error.response.status === 429)) {
                errorMessage = error.response?.data?.message || "Daily message limit reached (5/5). Please try again tomorrow or upgrade to Pro.";
            }

            setMessages(prev => [...prev, {
                role: 'model',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (showInquiry) {
        return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-4 sm:my-8">

                    {/* Progress Header */}
                    <div className="p-6 border-b border-white/10 bg-black/20">
                        {/* New Informational Header */}
                        <div className="mb-6 pb-6 border-b border-white/5">
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 uppercase tracking-tighter">
                                Athlete Dossier: Initialize Your Pro Coaching
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Complete this profile to unlock hyper-personalized elite training protocols.
                            </p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" title="Close">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="text-2xl">{steps[activeStep - 1].icon}</div>
                                <div>
                                    <h2 className="text-white font-bold text-xl">{steps[activeStep - 1].title}</h2>
                                    <p className="text-indigo-300 text-xs">Step {activeStep} of 10</p>
                                </div>
                            </div>
                            <div className="text-indigo-400 font-mono text-sm">{Math.round((activeStep / 10) * 100)}%</div>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${(activeStep / 10) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 custom-scrollbar">
                        {activeStep === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Age</label>
                                        <input type="number" placeholder="25" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.age} onChange={e => setInquiryData({ ...inquiryData, age: e.target.value })} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Gender</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.gender} onChange={e => setInquiryData({ ...inquiryData, gender: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="male" className="bg-slate-900">Male</option>
                                            <option value="female" className="bg-slate-900">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Height (cm)</label>
                                        <input type="number" placeholder="175" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.height} onChange={e => setInquiryData({ ...inquiryData, height: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Weight (kg)</label>
                                        <input type="number" placeholder="70" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.weight} onChange={e => setInquiryData({ ...inquiryData, weight: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Target (kg)</label>
                                        <input type="number" placeholder="65" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.targetWeight} onChange={e => setInquiryData({ ...inquiryData, targetWeight: e.target.value })} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Body Fat %</label>
                                        <input type="number" placeholder="15" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.bodyFat} onChange={e => setInquiryData({ ...inquiryData, bodyFat: e.target.value })} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Waist (cm)</label>
                                        <input type="number" placeholder="80" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.waist} onChange={e => setInquiryData({ ...inquiryData, waist: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">What is your primary goal?</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Fat Loss', 'Muscle Gain', 'Strength', 'Athletic Performance', 'Recomposition', 'Endurance', 'Physique', 'Event Prep'].map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setInquiryData({ ...inquiryData, goal: g })}
                                                className={`p-3 rounded-xl border text-sm font-semibold transition-all ${inquiryData.goal === g ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/10 border-white/20 text-indigo-200 hover:border-indigo-500 hover:bg-white/15'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Timeline (How long?)</label>
                                    <input type="text" placeholder="e.g., 3 months, 1 year" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.timeline} onChange={e => setInquiryData({ ...inquiryData, timeline: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeStep === 3 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Training Location</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setInquiryData({ ...inquiryData, location: 'gym' })} className={`p-4 rounded-xl border font-bold transition-all ${inquiryData.location === 'gym' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/10 border-white/20 text-indigo-200 hover:bg-white/15'}`}>🏠 Home</button>
                                        <button onClick={() => setInquiryData({ ...inquiryData, location: 'home' })} className={`p-4 rounded-xl border font-bold transition-all ${inquiryData.location === 'home' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/10 border-white/20 text-indigo-200 hover:bg-white/15'}`}>🏋️ Gym</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Available Equipment</label>
                                    <textarea placeholder="e.g., Dumbbells, Bands, Full Weight Room" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white min-h-[80px] outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.equipment} onChange={e => setInquiryData({ ...inquiryData, equipment: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Days / Week</label>
                                        <input type="number" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.daysPerWeek} onChange={e => setInquiryData({ ...inquiryData, daysPerWeek: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Min / Session</label>
                                        <input type="number" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.minutesPerSession} onChange={e => setInquiryData({ ...inquiryData, minutesPerSession: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 4 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Experience Level</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.level} onChange={e => setInquiryData({ ...inquiryData, level: e.target.value })} style={{ colorScheme: 'dark' }}>
                                        <option value="Beginner" className="bg-slate-900">Beginner (0-6 mo)</option>
                                        <option value="Intermediate" className="bg-slate-900">Intermediate (6 mo - 2 yr)</option>
                                        <option value="Advanced" className="bg-slate-900">Advanced (2+ yr)</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                    <h4 className="text-indigo-300 font-bold text-sm mb-3">Key Lifts (1RM or Estimate)</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] text-indigo-400 font-bold uppercase">Bench</label>
                                            <input type="number" placeholder="kg" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm outline-none focus:border-indigo-500" value={inquiryData.prBench} onChange={e => setInquiryData({ ...inquiryData, prBench: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-indigo-400 font-bold uppercase">Squat</label>
                                            <input type="number" placeholder="kg" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm outline-none focus:border-indigo-500" value={inquiryData.prSquat} onChange={e => setInquiryData({ ...inquiryData, prSquat: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-indigo-400 font-bold uppercase">Deadlift</label>
                                            <input type="number" placeholder="kg" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm outline-none focus:border-indigo-500" value={inquiryData.prDeadlift} onChange={e => setInquiryData({ ...inquiryData, prDeadlift: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 5 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Diet Type</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.dietType} onChange={e => setInquiryData({ ...inquiryData, dietType: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Non-Veg" className="bg-slate-900">Non-Veg</option>
                                            <option value="Veg" className="bg-slate-900">Vegetarian</option>
                                            <option value="Vegan" className="bg-slate-900">Vegan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Eat Eggs?</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.egg} onChange={e => setInquiryData({ ...inquiryData, egg: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Yes" className="bg-slate-900">Yes</option>
                                            <option value="No" className="bg-slate-900">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Source of Meals</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.mealSource} onChange={e => setInquiryData({ ...inquiryData, mealSource: e.target.value })} style={{ colorScheme: 'dark' }}>
                                        <option value="Cooking myself" className="bg-slate-900">Cooking myself</option>
                                        <option value="College Mess/Hostel" className="bg-slate-900">College Mess/Hostel</option>
                                        <option value="Meal Prep Service" className="bg-slate-900">Meal Prep Service</option>
                                        <option value="Eating Out" className="bg-slate-900">Eating Out</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Budget</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.budget} onChange={e => setInquiryData({ ...inquiryData, budget: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Student/Budget" className="bg-slate-900">Student / Budget</option>
                                            <option value="Medium" className="bg-slate-900">Medium</option>
                                            <option value="Premium" className="bg-slate-900">Premium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Track Calories?</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.tracksCalories} onChange={e => setInquiryData({ ...inquiryData, tracksCalories: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="No" className="bg-slate-900">No</option>
                                            <option value="Yes (Loose)" className="bg-slate-900">Yes (Loose)</option>
                                            <option value="Yes (Strict)" className="bg-slate-900">Yes (Strict)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 6 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Sleep (hrs)</label>
                                        <input type="number" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.sleep} onChange={e => setInquiryData({ ...inquiryData, sleep: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Stress Level</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.stress} onChange={e => setInquiryData({ ...inquiryData, stress: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Low" className="bg-slate-900">Low</option>
                                            <option value="Medium" className="bg-slate-900">Medium</option>
                                            <option value="High" className="bg-slate-900">High (Coding life!)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Activity Level</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.activityLevel} onChange={e => setInquiryData({ ...inquiryData, activityLevel: e.target.value })} style={{ colorScheme: 'dark' }}>
                                        <option value="Sedentary" className="bg-slate-900">Sedentary (Sit all day)</option>
                                        <option value="Lightly Active" className="bg-slate-900">Lightly Active</option>
                                        <option value="Active" className="bg-slate-900">Active</option>
                                        <option value="Very Active" className="bg-slate-900">Very Active</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Daily Steps (Estimate)</label>
                                    <input type="number" placeholder="5000" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.steps} onChange={e => setInquiryData({ ...inquiryData, steps: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeStep === 7 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Injuries / Joint Pain</label>
                                    <textarea placeholder="Back, Knee, Shoulder pain?" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white min-h-[100px] outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.injuries} onChange={e => setInquiryData({ ...inquiryData, injuries: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Past Surgeries / Medical</label>
                                    <textarea placeholder="Any history our coach should know?" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white min-h-[100px] outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.surgeries} onChange={e => setInquiryData({ ...inquiryData, surgeries: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeStep === 8 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Physique Description</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Skinny Fat', 'Overweight', 'Naturally Muscular', 'Hard Gainer', 'Lean'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setInquiryData({ ...inquiryData, physiqueType: t })}
                                                className={`p-3 rounded-xl border text-sm font-semibold transition-all ${inquiryData.physiqueType === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/10 border-white/20 text-indigo-200 hover:border-indigo-500 hover:bg-white/15'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Where do you store most fat?</label>
                                    <input type="text" placeholder="e.g., Belly, Hips, Full Body" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15" value={inquiryData.fatStorage} onChange={e => setInquiryData({ ...inquiryData, fatStorage: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeStep === 9 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Consistency (1-10)</label>
                                    <input type="range" min="1" max="10" className="w-full accent-indigo-500 transition-all" value={inquiryData.consistency} onChange={e => setInquiryData({ ...inquiryData, consistency: e.target.value })} />
                                    <div className="flex justify-between text-[10px] text-indigo-400 font-bold"><span>SOFT</span><span>ELITE</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Boredom Level</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.boredom} onChange={e => setInquiryData({ ...inquiryData, boredom: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Low" className="bg-slate-900">Low - Stay Focused</option>
                                            <option value="Medium" className="bg-slate-900">Medium</option>
                                            <option value="High" className="bg-slate-900">High - Need Variety</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Structure</label>
                                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/15 appearance-none cursor-pointer" value={inquiryData.structurePreference} onChange={e => setInquiryData({ ...inquiryData, structurePreference: e.target.value })} style={{ colorScheme: 'dark' }}>
                                            <option value="Strict" className="bg-slate-900">Strict Rules</option>
                                            <option value="Flexible" className="bg-slate-900">Flexible / Intuitive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 10 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Data Tracking Preference</label>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'Scientific', label: 'Scientific Depth (Detailed Programming)' },
                                            { id: 'Actionable', label: 'Simple Actionable (Just tell me what to do)' }
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setInquiryData({ ...inquiryData, dataDepth: opt.id })}
                                                className={`w-full p-4 rounded-2xl border text-left font-bold transition-all ${inquiryData.dataDepth === opt.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-white/5 border-white/10 text-indigo-200'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-indigo-200 text-xs font-bold uppercase mb-2">Strategy Adjustments</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={inquiryData.adjustmentFreq} onChange={e => setInquiryData({ ...inquiryData, adjustmentFreq: e.target.value })} style={{ colorScheme: 'dark' }}>
                                        <option value="Weekly">Weekly Progress Check</option>
                                        <option value="Monthly">Monthly Transform Strategy</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-black/20 flex gap-4">
                        {activeStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
                            >
                                Back
                            </button>
                        )}
                        {activeStep < 10 ? (
                            <button
                                onClick={nextStep}
                                className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleInquirySubmit}
                                className="flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                            >
                                Complete Dossier
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-4 sm:my-8">

                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            AI Coach <Sparkles className="w-4 h-4 text-yellow-400" />
                        </h2>
                        <p className="text-purple-300 text-xs">Powered by Gemini</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-purple-600'
                                : 'bg-indigo-600'
                                }`}>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>

                            <div className={`max-w-[80%] rounded-2xl p-3 px-4 ${msg.role === 'user'
                                ? 'bg-purple-600 text-white rounded-tr-none'
                                : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                }`}>
                                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 border border-white/5 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                <span className="text-purple-300 text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about workouts, diet, or form..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AICoach;
