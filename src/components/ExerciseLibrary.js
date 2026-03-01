import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, SlidersHorizontal, BookOpen, ChevronDown } from 'lucide-react';
import exercises from '../data/exercises.json';
import ExerciseCard from './ExerciseCard';
import ExerciseDetailModal from './ExerciseDetailModal';

const PAGE_SIZE = 24;

// ── Filter options derived from data ──────────────────────────────────────────
const TARGET_MUSCLES = ['All', 'Abdominals', 'Abductors', 'Adductors', 'Biceps', 'Calves', 'Chest', 'Forearms', 'Glutes', 'Hamstrings', 'Lats', 'Lower Back', 'Middle Back', 'Neck', 'Quadriceps', 'Shoulders', 'Traps', 'Triceps'];
const CATEGORIES = ['All', 'Cardio', 'Olympic weightlifting', 'Plyometrics', 'Powerlifting', 'Strength', 'Stretching', 'Strongman'];
const EQUIPMENT_OPTIONS = ['All', 'Bands', 'Barbell', 'Bodyweight', 'Cable', 'Dumbbell', 'E-z curl bar', 'Exercise ball', 'Foam roll', 'Kettlebells', 'Machine', 'Medicine ball', 'Other'];
const DIFFICULTY_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Expert'];

const DIFFICULTY_BADGE = {
  'Beginner': 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'Intermediate': 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  'Expert': 'bg-red-500/15 border-red-500/30 text-red-400',
};

// ── Reusable dropdown ─────────────────────────────────────────────────────────
const FilterDropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const active = value !== 'All';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300
          ${active
            ? 'glass-card border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            : 'bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200 hover:border-white/20'}`}
      >
        {label}: <span className={active ? 'text-purple-200' : 'text-gray-200'}>{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180 text-purple-400' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-40 min-w-[180px] glass-panel rounded-2xl overflow-hidden overflow-y-auto max-h-[300px] py-1 animate-in fade-in slide-in-from-top-2 duration-200 border border-white/10 custom-scrollbar">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0
                  ${value === opt
                    ? 'bg-purple-500/20 text-purple-300 font-bold backdrop-blur-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white font-medium'}`}
              >
                {opt}
                {opt !== 'All' && DIFFICULTY_BADGE[opt] && (
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded border ${DIFFICULTY_BADGE[opt]}`}>
                    {opt.charAt(0)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ExerciseLibrary = () => {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = useCallback(() => {
    setSearch('');
    setMuscleFilter('All');
    setCategoryFilter('All');
    setEquipmentFilter('All');
    setDifficultyFilter('All');
    setPage(1);
  }, []);

  const hasActiveFilters = search || muscleFilter !== 'All' || categoryFilter !== 'All' || equipmentFilter !== 'All' || difficultyFilter !== 'All';

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return exercises.filter(ex => {
      if (q && !ex.name.toLowerCase().includes(q) && !ex.targetMuscle.toLowerCase().includes(q) && !ex.category.toLowerCase().includes(q)) return false;
      if (muscleFilter !== 'All' && ex.targetMuscle.toLowerCase() !== muscleFilter.toLowerCase()) return false;
      if (categoryFilter !== 'All' && ex.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (equipmentFilter !== 'All' && ex.equipment.toLowerCase() !== equipmentFilter.toLowerCase()) return false;
      if (difficultyFilter !== 'All' && ex.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
      return true;
    });
  }, [search, muscleFilter, categoryFilter, equipmentFilter, difficultyFilter]);

  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const openDetail = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 sm:pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 justify-center sm:justify-start">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-3xl shadow-xl shadow-purple-500/20 border border-white/10">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 tracking-tight leading-tight">
                Exercise Library
              </h1>
              <p className="text-base sm:text-lg text-purple-200/60 font-medium mt-1">
                Explore {exercises.length} scientifically-backed movements
              </p>
            </div>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search exercises, muscles, categories…"
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-14 pr-12 py-4 glass-card rounded-2xl text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all font-semibold text-base shadow-xl"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* ── Secondary filters row ── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap mt-2">
          {/* Toggle filter panel on mobile */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all text-purple-200 border-purple-500/30 bg-purple-500/10 shadow-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Active Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-purple-400" />}
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex items-center gap-3 flex-wrap`}>
            <FilterDropdown label="Focus Part" value={muscleFilter} options={TARGET_MUSCLES} onChange={handleFilterChange(setMuscleFilter)} />
            <FilterDropdown label="Category" value={categoryFilter} options={CATEGORIES} onChange={handleFilterChange(setCategoryFilter)} />
            <FilterDropdown label="Equipment" value={equipmentFilter} options={EQUIPMENT_OPTIONS} onChange={handleFilterChange(setEquipmentFilter)} />
            <FilterDropdown label="Difficulty" value={difficultyFilter} options={DIFFICULTY_OPTIONS} onChange={handleFilterChange(setDifficultyFilter)} />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}

          <span className="ml-auto text-xs text-gray-500 font-medium shrink-0">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-semibold">No exercises found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-xl text-sm font-bold hover:bg-purple-600/50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {displayed.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={openDetail}
                />
              ))}
            </div>

            {/* ── Load More ── */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600
                             hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl
                             shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all text-sm"
                >
                  Load More Exercises
                  <span className="text-purple-200 font-normal text-xs">
                    ({displayed.length} / {filtered.length})
                  </span>
                </button>
              </div>
            )}

            {/* ── End message ── */}
            {!hasMore && filtered.length > PAGE_SIZE && (
              <p className="mt-8 text-center text-xs text-gray-600 font-medium">
                All {filtered.length} exercises shown
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Detail Modal ── */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ExerciseLibrary;
