import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Droplets, ChevronLeft, ChevronRight, Flame, Droplet, Coffee, Sun, Utensils, Apple, BarChart2, RefreshCw, AlertCircle } from 'lucide-react';
import { nutritionAPI } from '../services/api';

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
// Goals persistence key
// ─────────────────────────────────────────────
const GOALS_KEY = 'fitlife_nutrition_goals';

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
    const [tab, setTab] = useState('search');
    const [error, setError] = useState('');

    const searchFood = async () => {
        if (!query.trim()) return;
        setSearching(true); setError('');
        // Instantly show local matches first
        const local = searchLocalFoods(query);
        setResults(local);
        try {
            const res = await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=8&fields=product_name,brands,nutriments`
            );
            const data = await res.json();
            const api = (data.products || []).filter(p => p.product_name && p.nutriments?.['energy-kcal_100g']);
            // Merge: local first, then API (deduplicated by name)
            const combined = [...local, ...api];
            setResults(combined);
            if (combined.length === 0) setError('No results. Try another term or add a custom food.');
        } catch {
            if (local.length === 0) setError('Search failed. Check your connection or add a custom food.');
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                    <div>
                        <h3 className="text-white font-bold text-lg">Add to {mealLabel}</h3>
                        <p className="text-white/50 text-xs">Search millions of foods</p>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button onClick={() => setTab('search')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'search' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/50 hover:text-white'}`}>🔍 Search</button>
                    <button onClick={() => setTab('custom')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'custom' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/50 hover:text-white'}`}>✏️ Custom</button>
                </div>

                <div className="overflow-y-auto flex-1 p-4">
                    {tab === 'search' ? (
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
                                            <div><p className="font-semibold text-white text-sm leading-tight">{p.product_name}</p>
                                                {p.brands && <p className="text-white/40 text-xs">{p.brands}</p>}</div>
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
                    ) : (
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
                            <button onClick={() => { if (!customFood.name || !customFood.calories) return; onAdd({ name: customFood.name, brand: null, quantity: Number(customFood.quantity) || 100, calories: Number(customFood.calories), protein: Number(customFood.protein) || 0, carbs: Number(customFood.carbs) || 0, fat: Number(customFood.fat) || 0, fiber: 0 }); }}
                                disabled={!customFood.name || !customFood.calories}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                                <Plus className="w-4 h-4" /> Add Custom Food
                            </button>
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
    const r = 54, cx = 64, cy = 64;
    const circumference = 2 * Math.PI * r;
    const isOver = consumed > goal;
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg width="128" height="128" className="-rotate-90">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle cx={cx} cy={cy} r={r} fill="none"
                        stroke={isOver ? '#f87171' : '#a855f7'}
                        strokeWidth="10"
                        strokeDasharray={`${circumference * pct} ${circumference}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 6px ${isOver ? '#f87171' : '#a855f7'})` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-extrabold text-white`}>{consumed}</span>
                    <span className="text-[10px] text-white/50 font-medium">kcal eaten</span>
                </div>
            </div>
            <div className="mt-2 flex gap-5 text-center text-xs">
                <div><p className="text-white/40">Goal</p><p className="font-bold text-white">{goal}</p></div>
                <div><p className="text-white/40">{isOver ? 'Over' : 'Left'}</p><p className={`font-bold ${isOver ? 'text-red-400' : 'text-green-400'}`}>{Math.abs(goal - consumed)}</p></div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Macro Bar (dark style)
// ─────────────────────────────────────────────
const MacroBar = ({ label, value, goal, color }) => {
    const pct = Math.min((value / goal) * 100, 100);
    return (
        <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-white/70">{label}</span>
                <span className="text-white/50">{value}g<span className="text-white/20">/{goal}g</span></span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
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
        <div className={`bg-gradient-to-br ${mealGradients[mealType]} backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden`}>
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${mealAccents[mealType]}`} />
                    <span className="text-white font-bold text-sm">{label}</span>
                </div>
                <span className={`font-bold text-sm ${mealAccents[mealType]}`}>{totalCals} kcal</span>
            </div>
            <div className="px-4 py-3">
                {items.length === 0 ? (
                    <p className="text-white/30 text-xs text-center py-1">No foods logged yet</p>
                ) : (
                    <div className="space-y-2 mb-3">
                        {items.map((item) => (
                            <div key={item._id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                                    <p className="text-xs text-white/40">{item.quantity}g · P:{item.protein}g C:{item.carbs}g F:{item.fat}g</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-orange-400 font-bold text-sm">{item.calories}</span>
                                    <button onClick={() => onRemove(mealType, item._id)} className="text-white/20 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={() => onAdd(mealType, label)}
                    className="w-full border border-dashed border-white/20 hover:border-purple-400/60 hover:bg-white/5 text-white/40 hover:text-purple-300 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Food
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Water Tracker
// ─────────────────────────────────────────────
const WaterTracker = ({ glasses, goal, onUpdate }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm text-white">Water Intake</span>
            </div>
            <span className="text-blue-400 font-bold text-sm">{glasses} / {goal} glasses</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: goal }).map((_, i) => (
                <button key={i} onClick={() => onUpdate(i < glasses ? i : i + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${i < glasses ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/20 hover:bg-blue-500/20 hover:text-blue-400 border border-white/10'}`}>
                    <Droplet className="w-4 h-4" />
                </button>
            ))}
        </div>
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min((glasses / goal) * 100, 100)}%` }} />
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

    // Load goals from localStorage (persists across dates)
    const getStoredGoals = () => {
        try {
            const saved = localStorage.getItem(GOALS_KEY);
            return saved ? JSON.parse(saved) : { calories: 2000, protein: 150, carbs: 250, fat: 65 };
        } catch { return { calories: 2000, protein: 150, carbs: 250, fat: 65 }; }
    };
    const [goals, setGoals] = useState(getStoredGoals);

    const loadLog = useCallback(async () => {
        setLoading(true); setApiError('');
        try {
            const res = await nutritionAPI.getDaily(date);
            if (res.success) setLog(res.data);
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
        // Persist to localStorage immediately (survives all date changes)
        localStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
        setGoals(newGoals);
        // Also sync today's log in the backend
        try { await nutritionAPI.updateGoals(date, newGoals); } catch { /* silent */ }
        setEditingGoals(false);
        showToast('✅ Goals saved!');
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
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-xl">
                        <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-white font-extrabold text-2xl">Calorie Tracker</h1>
                        <p className="text-white/40 text-sm">Track your daily nutrition</p>
                    </div>
                </div>

                {/* Date Navigator */}
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-4 py-3">
                    <button onClick={() => changeDate(-1)} className="text-white/60 hover:text-white p-1 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-white font-semibold text-sm">{dateLabel}</span>
                    <button onClick={() => changeDate(1)} disabled={isToday} className="text-white/60 hover:text-white p-1 transition-colors disabled:opacity-20"><ChevronRight className="w-5 h-5" /></button>
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
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center">
                            <CalorieRing consumed={totals.calories} goal={goals.calories} />
                            <div className="flex-1 w-full space-y-3.5">
                                <MacroBar label="🥩 Protein" value={totals.protein} goal={goals.protein} color="bg-red-400" />
                                <MacroBar label="🌾 Carbs" value={totals.carbs} goal={goals.carbs} color="bg-yellow-400" />
                                <MacroBar label="🧈 Fat" value={totals.fat} goal={goals.fat} color="bg-blue-400" />
                                <button
                                    onClick={() => setEditingGoals(true)}
                                    className="flex items-center gap-1.5 text-xs text-white/30 hover:text-purple-400 transition-colors mt-1">
                                    <span>✏️</span> Edit Goals
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
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-xl z-50">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default CalorieTracker;
