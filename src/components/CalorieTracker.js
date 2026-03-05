import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Droplets, ChevronLeft, ChevronRight, Flame, Droplet, Coffee, Sun, Utensils, Apple, BarChart2, RefreshCw, AlertCircle, Camera, Loader2, Sparkles } from 'lucide-react';
import { nutritionAPI, aiAPI, customFoodsAPI } from '../services/api';

// ─────────────────────────────────────────────
// Local Generic Foods Database (per 100g unless noted)
// ─────────────────────────────────────────────
const LOCAL_FOODS = [
    // Indian Grains & Rice
    { name: 'White Rice (cooked)', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    { name: 'Brown Rice (cooked)', kcal: 123, protein: 2.6, carbs: 26, fat: 0.9, fiber: 1.8 },
    { name: 'Basmati Rice (cooked)', kcal: 121, protein: 3.5, carbs: 25, fat: 0.4, fiber: 0.6 },
    { name: 'Jeera Rice (cooked)', kcal: 150, protein: 3, carbs: 28, fat: 3, fiber: 0.5 },
    { name: 'Roti / Chapati', kcal: 297, protein: 9.5, carbs: 55, fat: 4.5, fiber: 3.5 },
    { name: 'Paratha (plain)', kcal: 320, protein: 7, carbs: 45, fat: 12, fiber: 2 },
    { name: 'Aloo Paratha', kcal: 263, protein: 6, carbs: 40, fat: 9, fiber: 2.5 },
    { name: 'Puri', kcal: 340, protein: 7, carbs: 43, fat: 15, fiber: 1.5 },
    { name: 'Naan', kcal: 310, protein: 9, carbs: 56, fat: 5, fiber: 2 },
    { name: 'Poha (cooked)', kcal: 130, protein: 2.7, carbs: 26, fat: 0.8, fiber: 1 },
    { name: 'Upma (cooked)', kcal: 150, protein: 4, carbs: 24, fat: 4, fiber: 2 },
    { name: 'Idli (1 piece ~40g)', kcal: 39, protein: 2, carbs: 8, fat: 0.2, fiber: 0.5 },
    { name: 'Dosa (plain)', kcal: 168, protein: 4, carbs: 34, fat: 2, fiber: 1 },
    { name: 'Masala Dosa', kcal: 210, protein: 5, carbs: 35, fat: 7, fiber: 2 },
    { name: 'Sambar (per 100ml)', kcal: 55, protein: 3, carbs: 8, fat: 1.5, fiber: 2 },
    { name: 'Wheat Flour (atta)', kcal: 341, protein: 12, carbs: 70, fat: 1.7, fiber: 2.7 },
    // Dal & Legumes
    { name: 'Toor Dal (cooked)', kcal: 118, protein: 8, carbs: 20, fat: 0.4, fiber: 5 },
    { name: 'Moong Dal (cooked)', kcal: 105, protein: 7, carbs: 19, fat: 0.4, fiber: 4 },
    { name: 'Chana Dal (cooked)', kcal: 160, protein: 9, carbs: 27, fat: 2.5, fiber: 5 },
    { name: 'Masoor Dal (cooked)', kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 4 },
    { name: 'Urad Dal (cooked)', kcal: 127, protein: 9, carbs: 22, fat: 0.6, fiber: 4 },
    { name: 'Rajma (cooked)', kcal: 127, protein: 8.7, carbs: 22, fat: 0.5, fiber: 6 },
    { name: 'Chole / Chana Masala', kcal: 164, protein: 9, carbs: 27, fat: 3.5, fiber: 7 },
    { name: 'Dal Makhani', kcal: 180, protein: 10, carbs: 22, fat: 6, fiber: 5 },
    { name: 'Dal Tadka', kcal: 130, protein: 8, carbs: 18, fat: 4, fiber: 4 },
    // Curries & Sabzis
    { name: 'Aloo Sabzi', kcal: 110, protein: 2, carbs: 18, fat: 4, fiber: 2 },
    { name: 'Paneer Butter Masala', kcal: 220, protein: 12, carbs: 10, fat: 16, fiber: 1 },
    { name: 'Palak Paneer', kcal: 180, protein: 11, carbs: 7, fat: 13, fiber: 2 },
    { name: 'Paneer Bhurji', kcal: 195, protein: 13, carbs: 5, fat: 14, fiber: 1 },
    { name: 'Matar Paneer', kcal: 190, protein: 10, carbs: 12, fat: 12, fiber: 3 },
    { name: 'Butter Chicken (murgh makhani)', kcal: 200, protein: 18, carbs: 8, fat: 11, fiber: 1 },
    { name: 'Chicken Curry', kcal: 175, protein: 20, carbs: 6, fat: 8, fiber: 1 },
    { name: 'Mutton Curry', kcal: 210, protein: 22, carbs: 4, fat: 12, fiber: 0.5 },
    { name: 'Fish Curry', kcal: 150, protein: 18, carbs: 5, fat: 7, fiber: 0.5 },
    { name: 'Bhindi Masala', kcal: 90, protein: 2.5, carbs: 9, fat: 5, fiber: 3 },
    { name: 'Baingan Bharta', kcal: 95, protein: 2, carbs: 10, fat: 5, fiber: 3 },
    { name: 'Aloo Gobi', kcal: 100, protein: 2.5, carbs: 14, fat: 4.5, fiber: 3 },
    { name: 'Mixed Veg Sabzi', kcal: 95, protein: 3, carbs: 12, fat: 4, fiber: 3 },
    { name: 'Shahi Paneer', kcal: 250, protein: 11, carbs: 8, fat: 20, fiber: 1 },
    // Rice Dishes
    { name: 'Biryani (chicken)', kcal: 200, protein: 12, carbs: 28, fat: 5, fiber: 1 },
    { name: 'Biryani (veg)', kcal: 170, protein: 5, carbs: 32, fat: 4, fiber: 2 },
    { name: 'Pulao (veg)', kcal: 160, protein: 4, carbs: 30, fat: 3, fiber: 1.5 },
    { name: 'Khichdi', kcal: 130, protein: 5, carbs: 24, fat: 2, fiber: 2 },
    { name: 'Fried Rice', kcal: 185, protein: 4, carbs: 30, fat: 6, fiber: 1 },
    // Snacks & Street Food
    { name: 'Samosa (1 piece ~80g)', kcal: 160, protein: 3, carbs: 20, fat: 8, fiber: 2 },
    { name: 'Pakora (per piece ~25g)', kcal: 73, protein: 2, carbs: 8, fat: 4, fiber: 1 },
    { name: 'Vada Pav', kcal: 290, protein: 7, carbs: 48, fat: 8, fiber: 3 },
    { name: 'Pav Bhaji', kcal: 250, protein: 7, carbs: 38, fat: 9, fiber: 4 },
    { name: 'Chaat (aloo tikki)', kcal: 210, protein: 5, carbs: 32, fat: 8, fiber: 3 },
    { name: 'Bhel Puri', kcal: 160, protein: 4, carbs: 28, fat: 4, fiber: 2 },
    { name: 'Pani Puri (per piece)', kcal: 25, protein: 0.5, carbs: 4, fat: 0.7, fiber: 0.3 },
    { name: 'Dhokla', kcal: 132, protein: 6, carbs: 22, fat: 3, fiber: 1 },
    // Dairy & Eggs
    { name: 'Milk (full fat, 100ml)', kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    { name: 'Milk (toned, 100ml)', kcal: 45, protein: 3.1, carbs: 4.9, fat: 1.5, fiber: 0 },
    { name: 'Paneer', kcal: 265, protein: 18, carbs: 4, fat: 20, fiber: 0 },
    { name: 'Curd / Dahi', kcal: 60, protein: 3.5, carbs: 4.7, fat: 3.1, fiber: 0 },
    { name: 'Butter', kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
    { name: 'Ghee', kcal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    { name: 'Egg (1 whole ~55g)', kcal: 77, protein: 6.5, carbs: 0.6, fat: 5, fiber: 0 },
    { name: 'Egg White (1 ~35g)', kcal: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0 },
    { name: 'Boiled Egg', kcal: 155, protein: 13, carbs: 1, fat: 11, fiber: 0 },
    { name: 'Scrambled Eggs', kcal: 149, protein: 10, carbs: 1.6, fat: 11, fiber: 0 },
    // Fruits
    { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
    { name: 'Apple', kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    { name: 'Mango', kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
    { name: 'Orange', kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
    { name: 'Papaya', kcal: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7 },
    { name: 'Watermelon', kcal: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4 },
    { name: 'Grapes', kcal: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 },
    { name: 'Guava', kcal: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4 },
    // Proteins
    { name: 'Chicken Breast (cooked)', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    { name: 'Chicken Thigh (cooked)', kcal: 209, protein: 26, carbs: 0, fat: 11, fiber: 0 },
    { name: 'Mutton / Goat (cooked)', kcal: 258, protein: 26, carbs: 0, fat: 17, fiber: 0 },
    { name: 'Salmon (cooked)', kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
    { name: 'Tuna (canned)', kcal: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 },
    // Common Beverages
    { name: 'Chai / Tea with milk (1 cup)', kcal: 50, protein: 2, carbs: 6, fat: 2, fiber: 0 },
    { name: 'Black Coffee (1 cup)', kcal: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Lassi (sweet, 200ml)', kcal: 142, protein: 5, carbs: 22, fat: 4, fiber: 0 },
    { name: 'Coconut Water (200ml)', kcal: 38, protein: 1.8, carbs: 8, fat: 0.4, fiber: 1 },
    { name: 'Orange Juice (200ml)', kcal: 90, protein: 1.4, carbs: 21, fat: 0.2, fiber: 0.4 },
    // Nuts & Seeds
    { name: 'Almonds', kcal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
    { name: 'Cashews', kcal: 553, protein: 18, carbs: 30, fat: 44, fiber: 3 },
    { name: 'Peanuts (roasted)', kcal: 567, protein: 26, carbs: 16, fat: 49, fiber: 8 },
    { name: 'Walnuts', kcal: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
    { name: 'Sunflower Seeds', kcal: 584, protein: 21, carbs: 20, fat: 51, fiber: 9 },
];

const searchLocalFoods = (q) => {
    if (!q || q.length < 2) return [];
    const lower = q.toLowerCase();
    return LOCAL_FOODS.filter(f => f.name.toLowerCase().includes(lower))
        .slice(0, 6)
        .map(f => ({
            product_name: f.name,
            brands: '🏠 Generic',
            isLocal: true,
            nutriments: {
                'energy-kcal_100g': f.kcal,
                'proteins_100g': f.protein,
                'carbohydrates_100g': f.carbs,
                'fat_100g': f.fat,
                'fiber_100g': f.fiber,
            }
        }));
};

// ─────────────────────────────────────────────
// Goals localStorage cache key (used only as offline fallback)
// ─────────────────────────────────────────────
const GOALS_CACHE_KEY = 'fitlife_nutrition_goals_cache';

// ─────────────────────────────────────────────
// AI Photo Upload Tab (New)
// ─────────────────────────────────────────────
const AIPhotoTab = ({ onAdd, mealLabel }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [estimating, setEstimating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            setImage({ base64, mimeType: file.type });
            setPreview(reader.result);
            setResult(null);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleEstimate = async () => {
        if (!image) return;
        setEstimating(true);
        setError('');
        try {
            const res = await aiAPI.estimateCalories(image.base64, image.mimeType);
            if (res.success) {
                setResult(res.data);
            } else {
                setError('Failed to get estimation. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error connecting to AI service.');
        }
        setEstimating(false);
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/20 rounded-3xl p-12 hover:bg-purple-500/5 transition-all text-center group cursor-pointer relative bg-black/20">
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg">Snap Your Meal</p>
                    <p className="text-indigo-300/60 text-sm mt-1">Our AI Coach will estimate the macros instantly</p>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 aspect-video bg-black/40 shadow-2xl">
                        <img src={preview} alt="Meal preview" className="w-full h-full object-contain" />
                        <button onClick={() => { setPreview(null); setImage(null); setResult(null); }} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/80 transition-all border border-white/10"><X className="w-5 h-5" /></button>
                    </div>

                    {!result && (
                        <button onClick={handleEstimate} disabled={estimating} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
                            {estimating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
                            {estimating ? 'AI Coach is analyzing...' : 'Estimate Calories with AI'}
                        </button>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.2em]">AI Protocol Analysis</p>
                                    </div>
                                    <h4 className="font-black text-white text-2xl tracking-tight">{result.food_name}</h4>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500 to-red-600 px-4 py-2 rounded-2xl shadow-lg ring-1 ring-white/20">
                                    <span className="text-white font-black text-lg">{result.calories} <span className="text-xs opacity-80 uppercase">kcal</span></span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { icon: '🥩', val: result.protein, label: 'Protein', color: 'text-red-400', bg: 'bg-red-400/10' },
                                    { icon: '🌾', val: result.carbs, label: 'Carbs', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                                    { icon: '🧈', val: result.fat, label: 'Fat', color: 'text-blue-400', bg: 'bg-blue-400/10' }
                                ].map((m) => (
                                    <div key={m.label} className={`${m.bg} border border-white/5 rounded-2xl p-3 text-center transition-transform hover:scale-105`}>
                                        <div className="text-base mb-1">{m.icon}</div>
                                        <div className={`font-black text-lg text-white leading-none`}>{m.val}g</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${m.color} opacity-80`}>{m.label}</div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => onAdd({
                                name: result.food_name,
                                brand: '🤖 AI Coach Estimate',
                                quantity: 0,
                                calories: result.calories,
                                protein: result.protein,
                                carbs: result.carbs,
                                fat: result.fat,
                                fiber: 0
                            })} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                <Plus className="w-5 h-5" /> Confirm & Log Meal
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Goals Editor Modal
// ─────────────────────────────────────────────
const GoalsEditor = ({ goals, onSave, onClose }) => {
    const [draft, setDraft] = useState({ ...goals });
    const fields = [
        { key: 'calories', label: 'Daily Calories', unit: 'kcal', icon: '🔥', color: 'text-orange-400' },
        { key: 'protein', label: 'Protein Goal', unit: 'g', icon: '🥩', color: 'text-red-400' },
        { key: 'carbs', label: 'Carbs Goal', unit: 'g', icon: '🌾', color: 'text-yellow-400' },
        { key: 'fat', label: 'Fat Goal', unit: 'g', icon: '🧈', color: 'text-blue-400' },
    ];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                    <div>
                        <h3 className="text-white font-bold text-lg">Edit Daily Goals</h3>
                        <p className="text-white/40 text-xs">Changes apply from today onwards</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                    {fields.map(f => (
                        <div key={f.key}>
                            <label className={`text-xs font-semibold ${f.color} block mb-1.5`}>{f.icon} {f.label}</label>
                            <div className="flex items-center gap-2">
                                <input type="number" min="1" value={draft[f.key]}
                                    onChange={e => setDraft(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                <span className="text-white/40 text-sm font-medium w-10">{f.unit}</span>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => onSave(draft)}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-sm transition-all mt-2">
                        Save Goals
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Food Search Modal (styled to match app)
// ─────────────────────────────────────────────
const FoodSearchModal = ({ mealType, mealLabel, onAdd, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState(null);
    const [quantity, setQuantity] = useState(100);
    const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 100 });
    const [saveCustom, setSaveCustom] = useState(false);
    const [tab, setTab] = useState('search');
    const [error, setError] = useState('');
    const [savedFoods, setSavedFoods] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [savingFood, setSavingFood] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedSavedFood, setSelectedSavedFood] = useState(null);
    const [savedQty, setSavedQty] = useState(100);
    const [myFoodsQuery, setMyFoodsQuery] = useState('');

    // Load saved foods on mount
    useEffect(() => {
        const load = async () => {
            setLoadingSaved(true);
            try {
                const res = await customFoodsAPI.getAll();
                if (res.success) setSavedFoods(res.data);
            } catch { }
            setLoadingSaved(false);
        };
        load();
    }, []);

    // Convert a saved food to the product format used by calcNutrition
    const savedToProduct = (sf) => ({
        product_name: sf.name,
        brands: sf.brand || '⭐ My Foods',
        isSaved: true,
        savedId: sf._id || sf.id,
        nutriments: {
            'energy-kcal_100g': sf.calories,
            'proteins_100g': sf.protein,
            'carbohydrates_100g': sf.carbs,
            'fat_100g': sf.fat,
            'fiber_100g': sf.fiber || 0,
        }
    });

    const searchFood = async () => {
        if (!query.trim()) return;
        setSearching(true); setError('');

        // Match from saved foods first
        const savedMatches = savedFoods
            .filter(sf => sf.name.toLowerCase().includes(query.toLowerCase()))
            .map(savedToProduct);

        // Then local generic database
        const local = searchLocalFoods(query);
        setResults([...savedMatches, ...local]);

        try {
            const res = await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=8&fields=product_name,brands,nutriments`
            );
            const data = await res.json();
            const api = (data.products || []).filter(p => p.product_name && p.nutriments?.['energy-kcal_100g']);
            const combined = [...savedMatches, ...local, ...api];
            setResults(combined);
            if (combined.length === 0) setError('No results. Try another term or add a custom food.');
        } catch {
            if ([...savedMatches, ...local].length === 0) setError('Search failed. Check your connection or add a custom food.');
        }
        setSearching(false);
    };

    const calcNutrition = (product, qty) => {
        const n = product.nutriments; const factor = qty / 100;
        return {
            name: product.product_name, brand: product.brands || null, quantity: qty,
            calories: Math.round((n['energy-kcal_100g'] || 0) * factor),
            protein: Math.round((n['proteins_100g'] || 0) * factor * 10) / 10,
            carbs: Math.round((n['carbohydrates_100g'] || 0) * factor * 10) / 10,
            fat: Math.round((n['fat_100g'] || 0) * factor * 10) / 10,
            fiber: Math.round((n['fiber_100g'] || 0) * factor * 10) / 10,
        };
    };

    const handleSaveCustomFood = async () => {
        if (!customFood.name || !customFood.calories) return;
        setSavingFood(true);
        setError('');
        try {
            const qty = Number(customFood.quantity) || 100;
            const factor = qty / 100;
            const res = await customFoodsAPI.create({
                name: customFood.name,
                calories: Math.round(Number(customFood.calories) / factor),
                protein: Math.round(Number(customFood.protein) / factor * 10) / 10,
                carbs: Math.round(Number(customFood.carbs) / factor * 10) / 10,
                fat: Math.round(Number(customFood.fat) / factor * 10) / 10,
                fiber: 0,
                default_quantity: qty
            });
            if (res.success) {
                setSavedFoods(prev => [...prev, res.data]);
                setError('');
            }
        } catch (err) {
            if (err?.response?.status === 409) {
                setError(`"${customFood.name}" is already saved in My Foods`);
            } else {
                setError('Failed to save. Please try again.');
            }
        }
        setSavingFood(false);
    };

    const handleDeleteSaved = async (id) => {
        setDeletingId(id);
        try {
            await customFoodsAPI.delete(id);
            setSavedFoods(prev => prev.filter(f => (f._id || f.id) !== id));
        } catch { }
        setDeletingId(null);
    };

    const tabs = [
        { id: 'search', icon: '🔍', label: 'Search' },
        { id: 'myfoods', icon: '⭐', label: 'My Foods' },
        { id: 'ai', icon: '🤖', label: 'AI Photo' },
        { id: 'custom', icon: '✏️', label: 'Custom' }
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-4 sm:my-8 max-h-none">

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg ring-1 ring-white/20">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl tracking-tight">Add to {mealLabel}</h3>
                            <p className="text-purple-300/60 text-xs font-bold uppercase tracking-widest">Macro Protocol Initiation</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white border border-white/10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 bg-black/20 border-b border-white/10 gap-1.5">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 rounded-[1.25rem] text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${tab === t.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <span className="text-base">{t.icon}</span>
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                    {/* ── SEARCH TAB ── */}
                    {tab === 'search' && (
                        <>
                            <div className="flex gap-2 mb-3">
                                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchFood()}
                                    placeholder="e.g. chicken breast, oats..."
                                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                                <button onClick={searchFood} disabled={searching}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 transition-colors">
                                    {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}
                            <div className="space-y-2 mb-3">
                                {results.map((p, i) => (
                                    <button key={i} onClick={() => setSelected(p)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selected === p ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-white text-sm leading-tight">{p.product_name}</p>
                                                    {p.isSaved && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-yellow-500/30">Saved</span>}
                                                </div>
                                                {p.brands && <p className="text-white/40 text-xs">{p.brands}</p>}
                                            </div>
                                            <span className="text-orange-400 font-bold text-sm whitespace-nowrap ml-2">{Math.round(p.nutriments['energy-kcal_100g'])} kcal/100g</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {selected && (
                                <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-4">
                                    <p className="font-semibold text-sm text-white mb-3 truncate">{selected.product_name}</p>
                                    <div className="flex items-center gap-3 mb-3">
                                        <label className="text-xs text-white/60 font-medium">Quantity (g)</label>
                                        <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                                            className="w-24 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    {(() => {
                                        const n = calcNutrition(selected, quantity);
                                        return (
                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                {[['🔥', n.calories, 'kcal'], ['🥩', n.protein + 'g', 'protein'], ['🌾', n.carbs + 'g', 'carbs'], ['🧈', n.fat + 'g', 'fat']].map(([icon, val, label]) => (
                                                    <div key={label} className="bg-white/10 rounded-lg p-2 text-center">
                                                        <div className="text-[10px] text-white/50 mb-0.5">{icon} {label}</div>
                                                        <div className="font-bold text-sm text-white">{val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    <button onClick={() => onAdd(calcNutrition(selected, quantity))}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Add to {mealLabel}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── MY FOODS TAB ── */}
                    {tab === 'myfoods' && (
                        <div className="space-y-3">
                            {/* Search bar */}
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                <Search className="w-4 h-4 text-white/30 shrink-0" />
                                <input
                                    value={myFoodsQuery}
                                    onChange={e => setMyFoodsQuery(e.target.value)}
                                    placeholder="Search your saved foods..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder-white/25 focus:outline-none"
                                />
                                {myFoodsQuery && (
                                    <button onClick={() => setMyFoodsQuery('')} className="text-white/30 hover:text-white transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{savedFoods.length} item{savedFoods.length !== 1 ? 's' : ''} saved</p>
                            {loadingSaved && (
                                <div className="text-center py-8 text-white/30">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    <p className="text-xs">Loading...</p>
                                </div>
                            )}
                            {!loadingSaved && savedFoods.length === 0 && (
                                <div className="text-center py-12 text-white/20">
                                    <p className="text-4xl mb-3">⭐</p>
                                    <p className="font-bold text-sm">No saved foods yet</p>
                                    <p className="text-xs mt-1">Use the Custom tab to add and save your foods</p>
                                </div>
                            )}
                            {(() => {
                                const filtered = myFoodsQuery.trim()
                                    ? savedFoods.filter(sf => sf.name.toLowerCase().includes(myFoodsQuery.toLowerCase()))
                                    : savedFoods;
                                return (
                                    <>
                                        {!loadingSaved && savedFoods.length > 0 && filtered.length === 0 && (
                                            <p className="text-center text-white/30 text-sm py-6">No foods match &ldquo;{myFoodsQuery}&rdquo;</p>
                                        )}
                                        {filtered.map(sf => {
                                            const id = sf._id || sf.id;
                                            const isSelected = selectedSavedFood && (selectedSavedFood._id || selectedSavedFood.id) === id;
                                            return (
                                                <div key={id} className="rounded-2xl border transition-all overflow-hidden" style={{ borderColor: isSelected ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.08)' }}>
                                                    {/* Food row */}
                                                    <div
                                                        onClick={() => {
                                                            if (isSelected) { setSelectedSavedFood(null); }
                                                            else { setSelectedSavedFood(sf); setSavedQty(sf.default_quantity || 100); }
                                                        }}
                                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-white text-sm truncate">{sf.name}</p>
                                                            <p className="text-white/35 text-xs mt-0.5">🔥 {sf.calories} · P {sf.protein}g · C {sf.carbs}g · F {sf.fat}g <span className="text-white/20">per 100g</span></p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0 ml-3">
                                                            <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-purple-400' : 'text-white/25'}`}>{isSelected ? 'Selected ▲' : 'Select ▼'}</span>
                                                            <button
                                                                onClick={e => { e.stopPropagation(); handleDeleteSaved(id); }}
                                                                disabled={deletingId === id}
                                                                className="text-white/20 hover:text-red-400 transition-colors p-1.5 disabled:opacity-40">
                                                                {deletingId === id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* Expanded quantity + add panel */}
                                                    {isSelected && (
                                                        <div className="px-4 pb-4 bg-purple-500/10 border-t border-purple-500/20">
                                                            <div className="flex items-center gap-3 mt-3 mb-3">
                                                                <label className="text-xs text-white/60 font-medium">Quantity (g)</label>
                                                                <input
                                                                    type="number" min="1"
                                                                    value={savedQty}
                                                                    onChange={e => setSavedQty(Number(e.target.value))}
                                                                    onClick={e => e.stopPropagation()}
                                                                    className="w-24 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                            </div>
                                                            {/* Live macro preview */}
                                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                                {[['🔥', Math.round(sf.calories * savedQty / 100), 'kcal'],
                                                                ['🥩', Math.round(sf.protein * savedQty / 100 * 10) / 10 + 'g', 'protein'],
                                                                ['🌾', Math.round(sf.carbs * savedQty / 100 * 10) / 10 + 'g', 'carbs'],
                                                                ['🧈', Math.round(sf.fat * savedQty / 100 * 10) / 10 + 'g', 'fat']
                                                                ].map(([icon, val, label]) => (
                                                                    <div key={label} className="bg-white/10 rounded-lg p-2 text-center">
                                                                        <div className="text-[10px] text-white/50 mb-0.5">{icon} {label}</div>
                                                                        <div className="font-bold text-sm text-white">{val}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    onAdd({
                                                                        name: sf.name,
                                                                        brand: sf.brand || '⭐ My Foods',
                                                                        quantity: savedQty,
                                                                        calories: Math.round(sf.calories * savedQty / 100),
                                                                        protein: Math.round(sf.protein * savedQty / 100 * 10) / 10,
                                                                        carbs: Math.round(sf.carbs * savedQty / 100 * 10) / 10,
                                                                        fat: Math.round(sf.fat * savedQty / 100 * 10) / 10,
                                                                        fiber: 0
                                                                    });
                                                                    setSelectedSavedFood(null);
                                                                }}
                                                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Plus className="w-4 h-4" /> Add to {mealLabel}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* ── AI PHOTO TAB ── */}
                    {tab === 'ai' && <AIPhotoTab onAdd={onAdd} mealLabel={mealLabel} />}

                    {/* ── CUSTOM TAB ── */}
                    {tab === 'custom' && (
                        <div className="space-y-3">
                            <input placeholder="Food name *" value={customFood.name} onChange={e => setCustomFood(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <div className="grid grid-cols-2 gap-3">
                                {[['Calories (kcal) *', 'calories', 'e.g. 250'], ['Quantity (g)', 'quantity', '100'], ['Protein (g)', 'protein', '0'], ['Carbs (g)', 'carbs', '0']].map(([label, key, ph]) => (
                                    <div key={key}>
                                        <label className="text-xs text-white/60 font-medium block mb-1">{label}</label>
                                        <input type="number" placeholder={ph} value={customFood[key]} onChange={e => setCustomFood(p => ({ ...p, [key]: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                ))}
                                <div className="col-span-2">
                                    <label className="text-xs text-white/60 font-medium block mb-1">Fat (g)</label>
                                    <input type="number" placeholder="0" value={customFood.fat} onChange={e => setCustomFood(p => ({ ...p, fat: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>

                            {/* Save to My Foods toggle */}
                            <button
                                onClick={() => setSaveCustom(v => !v)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${saveCustom ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-base">⭐</span>
                                    Save to My Foods
                                </span>
                                <div className={`w-10 h-5 rounded-full transition-all relative ${saveCustom ? 'bg-yellow-500' : 'bg-white/20'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${saveCustom ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                            {saveCustom && (
                                <p className="text-yellow-400/60 text-xs text-center">This food will be saved to My Foods and appear in future searches ⭐</p>
                            )}

                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => {
                                        if (!customFood.name || !customFood.calories) return;
                                        onAdd({
                                            name: customFood.name, brand: null,
                                            quantity: Number(customFood.quantity) || 100,
                                            calories: Number(customFood.calories),
                                            protein: Number(customFood.protein) || 0,
                                            carbs: Number(customFood.carbs) || 0,
                                            fat: Number(customFood.fat) || 0,
                                            fiber: 0
                                        });
                                        if (saveCustom) handleSaveCustomFood();
                                    }}
                                    disabled={!customFood.name || !customFood.calories}
                                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                                    <Plus className="w-4 h-4" /> Add to {mealLabel}
                                </button>
                                {saveCustom && (
                                    <button
                                        onClick={handleSaveCustomFood}
                                        disabled={!customFood.name || !customFood.calories || savingFood}
                                        className="bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 disabled:opacity-40">
                                        {savingFood ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>⭐</span>}
                                        Save only
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// ─────────────────────────────────────────────
// Calorie Ring SVG
// ─────────────────────────────────────────────
const CalorieRing = ({ consumed, goal }) => {
    const pct = Math.min(consumed / goal, 1);
    const r = 60, cx = 72, cy = 72;
    const circumference = 2 * Math.PI * r;
    const isOver = consumed > goal;
    const ringColor = isOver ? '#f87171' : pct > 0.85 ? '#fb923c' : '#a855f7';
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 144 144" className="w-full h-full -rotate-90">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    <circle cx={cx} cy={cy} r={r} fill="none"
                        stroke={ringColor}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (pct * circumference)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 10px ${ringColor}88)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-3xl font-black text-white tracking-tight leading-none">{consumed}</span>
                    <span className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">kcal</span>
                </div>
            </div>
            <div className="mt-3 flex gap-6 text-center">
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Goal</p>
                    <p className="font-black text-white text-sm">{goal}</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">{isOver ? 'Over' : 'Left'}</p>
                    <p className={`font-black text-sm ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>{Math.abs(goal - consumed)}</p>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Macro Bar (dark style)
// ─────────────────────────────────────────────
const MacroBar = ({ label, value, goal, color, glow }) => {
    const pct = Math.min((value / goal) * 100, 100);
    return (
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-bold text-xs text-white/70 tracking-wide">{label}</span>
                <span className="text-xs font-black text-white">{value}<span className="text-white/30 font-medium">/{goal}g</span></span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%`, boxShadow: pct > 0 ? `0 0 8px ${glow}` : 'none' }}
                />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Meal Section Card (glassmorphism)
// ─────────────────────────────────────────────
const mealGradients = {
    breakfast: 'from-orange-500/30 to-amber-500/20',
    lunch: 'from-green-500/30 to-emerald-500/20',
    dinner: 'from-indigo-500/30 to-purple-500/20',
    snacks: 'from-pink-500/30 to-rose-500/20',
};
const mealAccents = { breakfast: 'text-orange-400', lunch: 'text-green-400', dinner: 'text-indigo-400', snacks: 'text-pink-400' };

const MealSection = ({ mealType, label, icon: Icon, items = [], onAdd, onRemove }) => {
    const totalCals = items.reduce((s, i) => s + i.calories, 0);
    return (
        <div className={`bg-gradient-to-br ${mealGradients[mealType]} backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden`}>
            <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/10 border border-white/10`}>
                        <Icon className={`w-4 h-4 ${mealAccents[mealType]}`} />
                    </div>
                    <span className="text-white font-black text-sm tracking-wide">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-black text-sm ${totalCals > 0 ? mealAccents[mealType] : 'text-white/20'}`}>
                        {totalCals > 0 ? `${totalCals} kcal` : '—'}
                    </span>
                    <button onClick={() => onAdd(mealType, label)}
                        className={`p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all ${mealAccents[mealType]} hover:scale-105 active:scale-95`}>
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {items.length > 0 && (
                <div className="px-4 pb-4">
                    <div className="bg-black/20 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        {items.map((item) => (
                            <div key={item._id} className="flex items-center justify-between px-4 py-3 group hover:bg-white/5 transition-colors">
                                <div className="flex-1 min-w-0 pr-3">
                                    <p className="text-sm font-semibold text-white truncate leading-tight">{item.name}</p>
                                    <p className="text-[11px] text-white/35 mt-0.5">
                                        {item.quantity > 0 ? `${item.quantity}g · ` : ''}P&nbsp;{item.protein}g&nbsp;&nbsp;C&nbsp;{item.carbs}g&nbsp;&nbsp;F&nbsp;{item.fat}g
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-orange-400 font-black text-sm">{item.calories}</span>
                                    <button onClick={() => onRemove(mealType, item._id)}
                                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {items.length === 0 && (
                <div className="px-5 pb-4">
                    <button onClick={() => onAdd(mealType, label)}
                        className="w-full border border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 text-white/25 hover:text-white/60 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Add Food
                    </button>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Water Tracker
// ─────────────────────────────────────────────
const WaterTracker = ({ glasses, goal, onUpdate }) => (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm border border-blue-500/20 rounded-3xl px-5 py-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/20">
                    <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-black text-sm text-white tracking-wide">Hydration</span>
            </div>
            <div className="text-right">
                <span className="text-blue-300 font-black text-lg">{glasses}</span>
                <span className="text-blue-400/50 text-sm font-bold">/{goal}</span>
                <p className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">glasses</p>
            </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
            {Array.from({ length: goal }).map((_, i) => (
                <button key={i} onClick={() => onUpdate(i < glasses ? i : i + 1)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${i < glasses
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-110'
                        : 'bg-white/5 text-white/20 hover:bg-blue-500/20 hover:text-blue-400 border border-white/10 hover:scale-105'
                        }`}>
                    <Droplet className="w-4 h-4" />
                </button>
            ))}
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((glasses / goal) * 100, 100)}%`, boxShadow: glasses > 0 ? '0 0 12px #3b82f688' : 'none' }} />
        </div>
    </div>
);

// ─────────────────────────────────────────────
// Weekly Chart
// ─────────────────────────────────────────────
const WeeklyChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const maxCal = Math.max(...data.map(d => Math.max(d.calories, d.goal)), 100);
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-white">This Week</span>
            </div>
            <div className="flex items-end gap-2 h-24">
                {data.map((day, i) => {
                    const calPct = (day.calories / maxCal) * 100;
                    const goalPct = (day.goal / maxCal) * 100;
                    const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end gap-0.5 h-16">
                                <div className="flex-1 bg-purple-500 rounded-t-sm transition-all duration-700"
                                    style={{ height: `${calPct}%`, minHeight: day.calories > 0 ? '4px' : 0, boxShadow: day.calories > 0 ? '0 0 8px rgba(168,85,247,0.4)' : 'none' }} />
                                <div className="w-0.5 bg-white/20 rounded-t-sm" style={{ height: `${goalPct}%` }} />
                            </div>
                            <span className="text-[10px] text-white/40">{label}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Calories</div>
                <div className="flex items-center gap-1.5 text-xs text-white/40"><div className="w-0.5 h-3 bg-white/30" /> Goal</div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Main CalorieTracker Component
// ─────────────────────────────────────────────
const CalorieTracker = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [log, setLog] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState('');
    const [apiError, setApiError] = useState('');
    const [editingGoals, setEditingGoals] = useState(false);

    // Default goals (used while loading from API)
    const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 65 };

    // Try to read cached goals from localStorage as initial state (avoids flicker)
    const getCachedGoals = () => {
        try {
            const saved = localStorage.getItem(GOALS_CACHE_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_GOALS;
        } catch { return DEFAULT_GOALS; }
    };
    const [goals, setGoals] = useState(getCachedGoals);

    const loadLog = useCallback(async () => {
        setLoading(true); setApiError('');
        try {
            const res = await nutritionAPI.getDaily(date);
            if (res.success) {
                setLog(res.data);
                // Load goals from the API response (user profile goals)
                if (res.data.goals) {
                    setGoals(res.data.goals);
                    // Cache locally as offline fallback
                    localStorage.setItem(GOALS_CACHE_KEY, JSON.stringify(res.data.goals));
                }
            }
        } catch (e) {
            setApiError('Failed to load log. Please ensure you are logged in.');
        }
        setLoading(false);
    }, [date]);

    const loadWeekly = useCallback(async () => {
        try {
            const res = await nutritionAPI.getWeekly();
            if (res.success) setWeeklyData(res.data);
        } catch { }
    }, []);

    useEffect(() => { loadLog(); }, [loadLog]);
    useEffect(() => { loadWeekly(); }, [loadWeekly]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const handleSaveGoals = async (newGoals) => {
        // Optimistically update UI
        setGoals(newGoals);
        setEditingGoals(false);
        try {
            // API is the primary save — goals stored on the User profile in MongoDB
            const res = await nutritionAPI.updateGoals(date, newGoals);
            if (res.success) {
                // Update cache after confirmed save
                localStorage.setItem(GOALS_CACHE_KEY, JSON.stringify(newGoals));
                showToast('✅ Goals saved!');
            } else {
                throw new Error('Server returned failure');
            }
        } catch (err) {
            // Roll back optimistic update on failure
            const cached = getCachedGoals();
            setGoals(cached);
            showToast('❌ Failed to save goals. Please try again.');
        }
    };

    const handleAddFood = async (food) => {
        if (!modal) return;
        try {
            const res = await nutritionAPI.logFood(date, modal.mealType, food, goals);
            if (res.success) { setLog(res.data); showToast(`✅ ${food.name} added!`); loadWeekly(); }
        } catch { showToast('Failed to add food.'); }
        setModal(null);
    };

    const handleRemoveFood = async (mealType, itemId) => {
        try {
            const res = await nutritionAPI.removeFood(date, mealType, itemId);
            if (res.success) { setLog(res.data); showToast('Removed.'); loadWeekly(); }
        } catch { showToast('Failed to remove.'); }
    };

    const handleUpdateWater = async (glasses) => {
        try {
            const res = await nutritionAPI.updateWater(date, glasses);
            if (res.success) setLog(prev => ({ ...prev, water_glasses: res.data.water_glasses }));
        } catch { }
    };

    const changeDate = (dir) => {
        const d = new Date(date); d.setDate(d.getDate() + dir);
        setDate(d.toISOString().split('T')[0]);
    };

    const isToday = date === new Date().toISOString().split('T')[0];
    const dateLabel = isToday ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' });
    const totals = log?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const meals = [
        { type: 'breakfast', label: 'Breakfast', icon: Coffee },
        { type: 'lunch', label: 'Lunch', icon: Sun },
        { type: 'dinner', label: 'Dinner', icon: Utensils },
        { type: 'snacks', label: 'Snacks', icon: Apple },
    ];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-4">
                {/* Page Title */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg shadow-orange-500/30 ring-1 ring-white/20">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-3xl tracking-tight">Nutrition</h1>
                            <p className="text-white/35 text-xs font-bold uppercase tracking-widest">Daily Protocol</p>
                        </div>
                    </div>
                </div>

                {/* Date Navigator */}
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-2 py-2 gap-2">
                    <button onClick={() => changeDate(-1)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/5">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-white font-black text-sm">{dateLabel}</span>
                        {isToday && <span className="ml-2 text-[10px] bg-purple-500/30 text-purple-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>}
                    </div>
                    <button onClick={() => changeDate(1)} disabled={isToday}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/5 disabled:opacity-20">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Error State */}
                {apiError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <p className="text-red-300 text-sm">{apiError}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && !apiError ? (
                    <div className="text-center py-16 text-white/30">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                        <p className="text-sm">Loading your nutrition log...</p>
                    </div>
                ) : !apiError && (
                    <>
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-white/5 to-purple-500/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-8 items-center shadow-xl">
                            <CalorieRing consumed={totals.calories} goal={goals.calories} />
                            <div className="flex-1 w-full space-y-4">
                                <MacroBar label="Protein" value={totals.protein} goal={goals.protein} color="bg-gradient-to-r from-red-400 to-rose-500" glow="#f8717180" />
                                <MacroBar label="Carbs" value={totals.carbs} goal={goals.carbs} color="bg-gradient-to-r from-yellow-400 to-amber-500" glow="#facc1580" />
                                <MacroBar label="Fat" value={totals.fat} goal={goals.fat} color="bg-gradient-to-r from-blue-400 to-cyan-500" glow="#60a5fa80" />
                                <button
                                    onClick={() => setEditingGoals(true)}
                                    className="flex items-center gap-2 text-xs text-white/25 hover:text-purple-400 transition-colors mt-1 group">
                                    <span className="group-hover:rotate-12 transition-transform inline-block">✏️</span>
                                    <span className="font-bold uppercase tracking-wider">Edit Goals</span>
                                </button>
                            </div>
                        </div>

                        {/* Meal Sections */}
                        {meals.map(m => (
                            <MealSection key={m.type} mealType={m.type} label={m.label} icon={m.icon}
                                items={log?.[m.type] || []}
                                onAdd={(type, label) => setModal({ mealType: type, mealLabel: label })}
                                onRemove={handleRemoveFood}
                            />
                        ))}

                        {/* Water Tracker */}
                        <WaterTracker glasses={log?.water_glasses || 0} goal={log?.water_goal || 8} onUpdate={handleUpdateWater} />

                        {/* Weekly Chart */}
                        {weeklyData.length > 0 && <WeeklyChart data={weeklyData} />}
                    </>
                )}
            </div>

            {/* Goals Editor Modal */}
            {editingGoals && <GoalsEditor goals={goals} onSave={handleSaveGoals} onClose={() => setEditingGoals(false)} />}

            {/* Food Search Modal */}
            {modal && <FoodSearchModal mealType={modal.mealType} mealLabel={modal.mealLabel} onAdd={handleAddFood} onClose={() => setModal(null)} />}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default CalorieTracker;
