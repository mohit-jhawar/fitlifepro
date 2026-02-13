import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Folder, Trash2, ArrowLeft, Dumbbell, Utensils, Calendar, Quote, TrendingUp, Award, User, Home, MessageCircle, Mail, Bell, Settings, LogIn, LogOut, Clock, Zap, Youtube, BarChart3, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { plansAPI, workoutsAPI, feedbackAPI } from './services/api';

import { getWorkoutPlan as generateWorkoutPlan, getDietPlan as generateDietPlan } from './plans';
import { motivationalQuotes } from './quotes';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import WorkoutTemplates from './components/WorkoutTemplates';
import WorkoutTimer from './components/WorkoutTimer';
import LoginDialog from './components/LoginDialog';
import Analytics from './components/Analytics';
import AICoach from './components/AICoach';

const App = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userMetrics, setUserMetrics] = useState({ weight: '', height: '', gender: '', name: '' });
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [expandedDays, setExpandedDays] = useState({}); // Track expanded days {dayIndex: boolean}

  const [showToast, setShowToast] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [pendingPlanSave, setPendingPlanSave] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const darkMode = true;
  const [preferences, setPreferences] = useState({
    fitnessLevel: '',
    dietaryRestrictions: [],
    workoutLocation: '',
    goalType: '',
    targetWeight: ''
  });
  const initialReminders = {
    workout: { enabled: false, time: '07:00' },
    breakfast: { enabled: false, time: '08:00' },
    lunch: { enabled: false, time: '13:00' },
    dinner: { enabled: false, time: '19:00' },
    water: { enabled: false, interval: 60 }
  };
  const [reminders, setReminders] = useState(initialReminders);
  const [validationDialog, setValidationDialog] = useState({ show: false, message: '' });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [editingReminders, setEditingReminders] = useState(false);

  // Custom Workout Plan State
  const [customWorkout, setCustomWorkout] = useState({
    planName: '',
    goal: '',
    days: [{ day: 'Monday', focus: '', exercises: [''] }]
  });

  // Custom Diet Plan State
  const [customDiet, setCustomDiet] = useState({
    planName: '',
    goal: '',
    dailyCalories: '',
    meals: [{ meal: 'Breakfast', time: '08:00', items: [''], calories: '' }]
  });


  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const bmiRanges = [
    { category: "Underweight", range: "< 18.5", icon: "🎯", description: "Below healthy weight" },
    { category: "Normal", range: "18.5 - 24.9", icon: "✨", description: "Healthy weight range" },
    { category: "Overweight", range: "25 - 29.9", icon: "⚡", description: "Above healthy weight" },
    { category: "Obese", range: "≥ 30", icon: "🎪", description: "Significantly above healthy weight" }
  ];



  const loadPreferences = async () => {
    try {
      let preferencesData = null;

      if (window.storage && window.storage.get) {
        const result = await window.storage.get('user_preferences');
        if (result && result.value) {
          preferencesData = result.value;
        }
      } else {
        preferencesData = localStorage.getItem('user_preferences');
      }

      if (preferencesData) {
        setPreferences(JSON.parse(preferencesData));
      }
    } catch (error) {
      console.log('No preferences saved yet');
    }
  };



  const loadReminders = async () => {
    try {
      let remindersData = null;

      if (window.storage && window.storage.get) {
        const result = await window.storage.get('user_reminders');
        if (result && result.value) {
          remindersData = result.value;
        }
      } else {
        remindersData = localStorage.getItem('user_reminders');
      }

      if (remindersData) {
        setReminders(JSON.parse(remindersData));
      }
    } catch (error) {
      console.log('No reminders saved yet');
    }
  };



  const checkAndShowReminders = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (reminders?.workout?.enabled && reminders.workout.time === currentTime) {
      showNotification('💪 Workout Time!', 'Time to hit your workout routine!');
    }
    if (reminders?.breakfast?.enabled && reminders.breakfast.time === currentTime) {
      showNotification('🍳 Breakfast Time!', 'Start your day with a healthy meal!');
    }
    if (reminders?.lunch?.enabled && reminders.lunch.time === currentTime) {
      showNotification('🥗 Lunch Time!', 'Time for your midday meal!');
    }
    if (reminders?.dinner?.enabled && reminders.dinner.time === currentTime) {
      showNotification('🍽️ Dinner Time!', 'Enjoy your evening meal!');
    }
    if (reminders?.water?.enabled && now.getMinutes() % reminders.water.interval === 0) {
      showNotification('💧 Hydration Reminder!', 'Time to drink some water!');
    }
  }, [reminders]);

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/fitness-icon.png' });
    } else {
      alert(`${title}\n${body}`);
    }
  };




  const navigateTo = (view) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.history.pushState({ view }, '', `#${view}`);
    setMenuOpen(false);
  };

  const goBack = () => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null);
    } else {
      setCurrentView('home');
    }
  };

  const savePlanToBackend = async (plan) => {
    if (isAuthenticated) {
      try {
        const res = await plansAPI.create(plan);
        if (res.success) {
          setSavedPlans(prev => [res.plan, ...prev]);
          return res.plan;
        }
      } catch (e) {
        console.error("Failed to save plan", e);
        // Fallback
        const timestamp = Date.now();
        const localPlan = { ...plan, id: timestamp, timestamp: new Date().toISOString() };

        try {
          if (window.storage && window.storage.set) {
            await window.storage.set(`plan:${timestamp}`, JSON.stringify(localPlan));
          } else {
            localStorage.setItem(`plan:${timestamp}`, JSON.stringify(localPlan));
          }
        } catch (err) {
          console.error("Failed to save locally", err);
        }

        setSavedPlans(prev => [localPlan, ...prev]);
        return localPlan;
      }
    } else {
      const timestamp = Date.now();
      const localPlan = { ...plan, id: timestamp, timestamp: new Date().toISOString() };

      try {
        if (window.storage && window.storage.set) {
          await window.storage.set(`plan:${timestamp}`, JSON.stringify(localPlan));
        } else {
          localStorage.setItem(`plan:${timestamp}`, JSON.stringify(localPlan));
        }
      } catch (err) {
        console.error("Failed to save locally", err);
      }

      setSavedPlans(prev => [localPlan, ...prev]);
      return localPlan;
    }
  };

  const deletePlan = async (id) => {
    if (!id) return;

    // Optimistically update UI
    setSavedPlans(prev => prev.filter(p => p.plan_id !== id && p.id !== id));

    if (isAuthenticated) {
      try {
        await plansAPI.delete(id);
      } catch (e) {
        console.error("Failed to delete from backend", e);
        // If it failed because it was a local-only ID, that's fine.
        // If it failed for other reasons, the UI is already updated (optimistic), 
        // but strict consistency would require a rollback or error message.
        // For now, consistent with previous behavior, we just log it.

        // Also try deleting by the other ID format if it exists, just in case
        try {
          // Some logic might use timestamp IDs, so we just ensure cleanup
          const key = `plan:${id}`;
          if (window.storage && window.storage.remove) {
            await window.storage.remove(key);
          } else {
            localStorage.removeItem(key);
          }
        } catch (localErr) { /* ignore */ }
      }
    } else {
      // Local delete
      const key = `plan:${id}`;
      try {
        if (window.storage && window.storage.remove) {
          await window.storage.remove(key);
        } else {
          localStorage.removeItem(key);
        }
      } catch (e) { console.error(e); }
    }
  };

  const loadPlans = useCallback(async () => {
    try {
      let apiPlans = [];
      if (isAuthenticated) {
        try {
          const res = await plansAPI.getAll();
          if (res.success) {
            apiPlans = res.plans;
          }
        } catch (e) {
          console.error("API Error", e);
        }
      }

      // Local plan loading logic removed to focus on database plans

      // Only use database plans
      setSavedPlans(apiPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      setSavedPlans([]);
    }
  }, [isAuthenticated]);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };



  const loadWorkoutSessions = useCallback(async () => {
    // Only load if authenticated
    if (!isAuthenticated) {
      setWorkoutSessions([]);
      return;
    }

    // API first
    try {
      const res = await workoutsAPI.getAll();
      if (res.success) {
        setWorkoutSessions(res.sessions);
        return;
      }
    } catch (e) { console.error(e); }

    // Fallback to localStorage
    const sessions = [];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('workout_session:')) {
        try {
          const session = JSON.parse(localStorage.getItem(key));
          sessions.push(session);
        } catch (e) {
          console.error('Error loading session:', e);
        }
      }
    });
    // Sort by date descending
    sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    setWorkoutSessions(sessions);
  }, [isAuthenticated]);

  /* 
   * WORKOUT SYNC LOGIC
   * - saveWorkoutProgress: Called after every set. Syncs to DB if logged in.
   * - saveWorkoutSession: Called on "Save & Reset". Marks as completed.
   */
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);

  const saveWorkoutProgress = async (partialSession) => {
    // 1. Auth Check - Silent return if not logged in (user will be prompted at end)
    if (!isAuthenticated) return;

    try {
      if (currentWorkoutId) {
        // Update existing log
        await workoutsAPI.update(currentWorkoutId, {
          ...partialSession,
          completed: false
        });
      } else {
        // Create new log
        const res = await workoutsAPI.create({
          ...partialSession,
          completed: false
        });
        if (res.success && res.session) {
          setCurrentWorkoutId(res.session.id);
        }
      }
    } catch (e) {
      console.error("Failed to sync workout progress", e);
      // Silent fail for progress sync - we don't want to interrupt the workout
    }
  };

  const saveWorkoutSession = async (session) => {
    // 1. Auth Guard
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      // Return a special flag so the timer knows we didn't save yet
      return { success: false, reason: 'unauthenticated' };
    }

    try {
      let result;
      if (currentWorkoutId) {
        // Final update to mark as completed
        result = await workoutsAPI.update(currentWorkoutId, {
          ...session,
          completed: true
        });
      } else {
        // Create new completed log
        result = await workoutsAPI.create({
          ...session,
          completed: true
        });
      }

      if (result.success) {
        setWorkoutSessions(prev => [result.session, ...prev]);
        setCurrentWorkoutId(null); // Reset for next workout
        return { success: true };
      }
    } catch (e) {
      console.error("Failed to save session", e);
      setValidationDialog({
        show: true,
        message: 'Failed to save workout. Please try again.'
      });
      return { success: false, reason: 'error', error: e };
    }
  };


  const handleGeneratePlan = async () => {
    const weight = parseFloat(userMetrics.weight);
    const height = parseFloat(userMetrics.height);

    // Validation
    if (!userMetrics.name.trim()) {
      setValidationDialog({ show: true, message: 'Please enter your name to continue' });
      return;
    }
    if (!userMetrics.gender) {
      setValidationDialog({ show: true, message: 'Please select your gender' });
      return;
    }
    if (!weight || weight <= 0) {
      setValidationDialog({ show: true, message: 'Please enter a valid weight (greater than 0)' });
      return;
    }
    if (!height || height <= 0) {
      setValidationDialog({ show: true, message: 'Please enter a valid height (greater than 0)' });
      return;
    }

    const bmi = calculateBMI(weight, height);

    if (isAuthenticated) {
      try {
        await updateProfile({
          weight,
          height,
          gender: userMetrics.gender,
          name: userMetrics.name,
          bmi: bmi.toFixed(1)
        });
      } catch (e) { console.error("Profile sync failed", e); }
    }

    const category = getBMICategory(bmi);

    // Check if we're using a template
    if (currentPlan && currentPlan.isTemplate) {
      // Use template data
      // Map template fields to standard plan structure
      const templatePlan = {
        ...currentPlan, // currentPlan here is the template object
        goal: currentPlan.goals ? currentPlan.goals[0] : (currentPlan.name || 'Fitness Program'),
        frequency: `${currentPlan.daysPerWeek} days/week`,
        routine: currentPlan.workouts,
        tips: ['Follow the program consistently', 'Track your weights and reps', 'Prioritize recovery and sleep']
      };

      setCurrentPlan({
        type: 'workout',
        bmi: bmi.toFixed(1),
        category,
        weight,
        height,
        gender: userMetrics.gender,
        name: userMetrics.name,
        plan: templatePlan,
        preferences: { ...preferences },
        reminders: { ...reminders },
        isTemplate: true
      });
    } else {
      // Validate personalization based on plan type
      if (planType === 'workout') {
        if (!preferences.fitnessLevel) {
          setValidationDialog({ show: true, message: 'Please select your fitness level' });
          return;
        }
        if (!preferences.workoutLocation) {
          setValidationDialog({ show: true, message: 'Please select your workout location (Home or Gym)' });
          return;
        }

      } else if (planType === 'diet') {
        if (!preferences.goalType) {
          setValidationDialog({ show: true, message: 'Please select your primary goal' });
          return;
        }
      }

      const plan = planType === 'workout'
        ? generateWorkoutPlan(category, weight, height, { ...preferences, goalType: 'muscle-building' })
        : generateDietPlan(category, weight, height, preferences);

      // Ensure goal and frequency/calories are correctly mapped from generated plan
      const planGoal = plan.goal || preferences.goalType || 'Fitness Goal';
      const planFrequency = plan.frequency || (planType === 'workout' ? '3 days/week' : null);
      const planTips = plan.tips && plan.tips.length > 0 ? plan.tips : (planType === 'workout'
        ? ['Stay consistent with your routine', 'Focus on proper form', 'Hydrate before and after workouts']
        : ['Eat whole, unprocessed foods', 'Control your portions', 'Drink plenty of water']);

      setCurrentPlan({
        type: planType,
        bmi: bmi.toFixed(1),
        category,
        weight,
        height,
        gender: userMetrics.gender,
        name: userMetrics.name,
        plan: {
          ...plan,
          goal: planGoal,
          frequency: planFrequency,
          tips: planTips
        },
        preferences: { ...preferences },
        reminders: { ...reminders }
      });
      setSelectedWeek(1);
    }

    navigateTo('result');
  };


  const savePlan = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    // Check if any reminders are enabled based on the current plan's reminders
    const planReminders = currentPlan.reminders || reminders;
    const hasReminders = Object.values(planReminders).some(r => r && r.enabled);

    if (hasReminders) {
      setPendingPlanSave(true);
      setShowNotificationPrompt(true);
    } else {
      await completeSavePlan();
    }
  };

  const completeSavePlan = async (enableNotifications = false) => {
    // Get the latest reminders from the current plan
    const planReminders = currentPlan.reminders || reminders;

    const planToSave = {
      plan_id: `plan:${Date.now()}`,
      plan_type: currentPlan.type,
      user_bmi: currentPlan.bmi,
      user_weight: currentPlan.weight,
      user_height: currentPlan.height,
      user_gender: currentPlan.gender,
      user_name: currentPlan.name,
      category: currentPlan.category,
      plan_content: currentPlan.plan,
      preferences: currentPlan.preferences,
      reminders: planReminders,
      notifications_enabled: enableNotifications,
      timestamp: new Date().toISOString()
    };

    try {

      await savePlanToBackend(planToSave);

      // CRITICAL FIX: Update global reminders state and persist to storage
      // This ensures the checkAndShowReminders loop sees the new reminders immediately
      setReminders(planReminders);

      try {
        if (window.storage && window.storage.set) {
          await window.storage.set('user_reminders', JSON.stringify(planReminders));
        } else {
          localStorage.setItem('user_reminders', JSON.stringify(planReminders));
        }
      } catch (storageErr) {
        console.error("Failed to save reminders locally", storageErr);
      }

      if (enableNotifications) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('FitLife Pro', { body: 'Notifications enabled for your plan!', icon: '/fitness-icon.png' });
        }
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      await loadPlans();
      setShowNotificationPrompt(false);
      setPendingPlanSave(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      setValidationDialog({
        show: true,
        message: `Failed to save plan: ${error.message || 'Unknown error'}`
      });
    }
  };



  const handleFeedbackSubmit = async () => {
    setFeedbackError('');
    setFeedbackSubmitted(false);

    if (!feedbackForm.name.trim() || !feedbackForm.email.trim() || !feedbackForm.message.trim()) {
      setFeedbackError('Please fill in all fields');
      return;
    }

    try {
      console.log('Submitting feedback:', feedbackForm);
      const response = await feedbackAPI.submit(feedbackForm);
      console.log('Feedback response:', response);
      setFeedbackSubmitted(true);
      setFeedbackForm({ name: '', email: '', message: '' });
      setTimeout(() => setFeedbackSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      console.error('Error response:', error.response?.data);

      // Display validation errors or generic error
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Parse express-validator errors - they can have msg, message, or be in different formats
        const errorMessages = error.response.data.errors.map(err => {
          // Handle different error formats from express-validator
          if (typeof err === 'string') return err;
          if (err.msg) return `${err.path || err.param || 'Field'}: ${err.msg}`;
          if (err.message) return `${err.field || err.path || err.param || 'Field'}: ${err.message}`;
          return JSON.stringify(err);
        }).join(' • ');
        setFeedbackError(errorMessages);
      } else if (error.response?.data?.message) {
        setFeedbackError(error.response.data.message);
      } else {
        setFeedbackError('Failed to submit feedback. Please try again later.');
      }
    }
  };

  const handleCustomPlan = (customType) => {
    const weight = parseFloat(userMetrics.weight);
    const height = parseFloat(userMetrics.height);

    // Validation
    if (!userMetrics.name.trim()) {
      setValidationDialog({ show: true, message: 'Please enter your name to continue' });
      return;
    }
    if (!userMetrics.gender) {
      setValidationDialog({ show: true, message: 'Please select your gender' });
      return;
    }
    if (!weight || weight <= 0) {
      setValidationDialog({ show: true, message: 'Please enter a valid weight (greater than 0)' });
      return;
    }
    if (!height || height <= 0) {
      setValidationDialog({ show: true, message: 'Please enter a valid height (greater than 0)' });
      return;
    }

    // Navigate to custom plan page
    navigateTo(customType);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPlans();
      loadWorkoutSessions();
    }
  }, [isAuthenticated, loadPlans, loadWorkoutSessions]);

  useEffect(() => {
    loadPlans();
    loadPreferences();
    loadReminders();
    loadWorkoutSessions();
    const quoteInterval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, [loadPlans, loadWorkoutSessions]);

  useEffect(() => {
    if (user) {
      setUserMetrics(prev => ({
        ...prev,
        name: user.name || prev.name,
        weight: user.weight || prev.weight,
        height: user.height || prev.height,
        gender: user.gender || prev.gender
      }));
    }
  }, [user]);

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        // If no state, go to home
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (reminders?.workout?.enabled || reminders?.breakfast?.enabled || reminders?.lunch?.enabled || reminders?.dinner?.enabled || reminders?.water?.enabled) {
      checkAndShowReminders();
      const reminderInterval = setInterval(checkAndShowReminders, 60000);
      return () => clearInterval(reminderInterval);
    }
  }, [reminders, checkAndShowReminders]);

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1 sm:py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center">
            <img
              src="/assets/images/fitlife-logo.png"
              alt="FitLife Pro"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {currentView !== 'home' && (
              <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
                <Home className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Home</span>
              </button>
            )}
            <button onClick={() => navigateTo('templates')} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <Award className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Templates</span>
            </button>

            <button onClick={() => { setPlanType('workout'); navigateTo('input'); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <Dumbbell className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Workout</span>
            </button>
            <button onClick={() => { setPlanType('diet'); navigateTo('input'); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <Utensils className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Diet</span>
            </button>
            <button onClick={() => navigateTo('feedback')} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Feedback</span>
            </button>
            <button onClick={() => navigateTo('contact')} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <Mail className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Contact</span>
            </button>
            <button onClick={() => navigateTo('saved')} className="bg-white/20 p-2.5 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              <Folder className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigateTo('analytics')} className="bg-white/20 p-2.5 rounded-xl hover:bg-white/30 transition-all border border-white/30" title="Analytics">
              <BarChart3 className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => { setCurrentView('home'); setShowAICoach(true); }} className="bg-white/20 p-2.5 rounded-xl hover:bg-white/30 transition-all border border-white/30" title="AI Coach">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </button>
            <button onClick={() => { setCurrentView('home'); setShowTimer(true); }} className="bg-white/20 p-2.5 rounded-xl hover:bg-white/30 transition-all border border-white/30" title="Workout Timer">
              <Clock className="w-5 h-5 text-white" />
            </button>

            {isAuthenticated ? (
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`bg-white/20 p-2.5 rounded-xl hover:bg-white/30 transition-all border border-white/30 flex items-center justify-center ${userDropdownOpen ? 'bg-white/40 ring-2 ring-purple-500/50' : ''}`}
                  title="Profile Settings"
                >
                  <User className="w-5 h-5 text-white" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-[60] animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-white/10 text-center">
                      <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Welcome back</p>
                      <p className="text-white font-bold truncate">Hi, {user?.name}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-red-500/20 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigateTo('auth')} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-xl hover:shadow-lg transition-all border border-purple-400">
                <LogIn className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Login</span>
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => navigateTo('saved')} className="bg-white/20 p-2 rounded-xl border border-white/30">
              <Folder className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="bg-white/20 p-2 rounded-xl border border-white/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden">
            {isAuthenticated && (
              <div className="px-4 py-4 border-b border-white/20 bg-white/10">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-300" />
                  Hi, {user?.name}
                </span>
              </div>
            )}

            {currentView !== 'home' && (
              <button onClick={() => { setCurrentView('home'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
                <Home className="w-5 h-5 text-gray-300" /><span>Home</span>
              </button>
            )}
            <button onClick={() => { navigateTo('templates'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Award className="w-5 h-5 text-gray-300" /><span>Workout Templates</span>
            </button>
            <button onClick={() => { setPlanType('workout'); navigateTo('input'); setMenuOpen(false); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Dumbbell className="w-5 h-5 text-gray-300" /><span>Workout</span>
            </button>
            <button onClick={() => { setPlanType('diet'); navigateTo('input'); setMenuOpen(false); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Utensils className="w-5 h-5 text-gray-300" /><span>Diet</span>
            </button>
            <button onClick={() => { navigateTo('feedback'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-300" /><span>Feedback</span>
            </button>
            <button onClick={() => { navigateTo('contact'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Mail className="w-5 h-5 text-gray-300" /><span>Contact</span>
            </button>
            <button onClick={() => { navigateTo('analytics'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <BarChart3 className="w-5 h-5 text-gray-300" /><span>Analytics</span>
            </button>
            <button onClick={() => { setCurrentView('home'); setShowAICoach(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Sparkles className="w-5 h-5 text-yellow-400" /><span>AI Coach</span>
            </button>
            <button onClick={() => { setCurrentView('home'); setShowTimer(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 border-b border-white/20 transition-colors">
              <Clock className="w-5 h-5 text-gray-300" /><span>Workout Timer</span>
            </button>

            {isAuthenticated ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-4 text-white hover:bg-white/20 bg-red-500/30 border-t border-white/20 transition-all font-bold">
                <LogOut className="w-5 h-5 text-red-300" /><span>Logout</span>
              </button>
            ) : (
              <button onClick={() => { navigateTo('auth'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-4 text-white hover:bg-white/20 bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-t border-white/20 transition-all font-bold">
                <LogIn className="w-5 h-5 text-purple-300" /><span>Login / Register</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav >
  );

  const ValidationDialog = () => (
    validationDialog.show && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Required Information</h3>
              <p className="text-gray-600 text-sm">Please complete the form</p>
            </div>
          </div>
          <p className="text-gray-700 mb-6 text-lg">
            {validationDialog.message}
          </p>
          <button
            onClick={() => setValidationDialog({ show: false, message: '' })}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    )
  );

  // Render components at root level
  const renderRootComponents = () => (
    <>
      <ValidationDialog />
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onGoToLogin={() => {
          setShowLoginDialog(false);
          navigateTo('auth');
        }}
      />
    </>
  );

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white flex items-center justify-center p-4">
        {renderRootComponents()}
        <Navbar />
        <AuthPage onAuthSuccess={() => navigateTo('home')} />
      </div>
    );
  }

  if (currentView === 'templates') {
    if (!isAuthenticated) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 pt-32">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login to access workout templates</p>
              <button
                onClick={() => navigateTo('auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        {renderRootComponents()}
        <Navbar />
        <WorkoutTemplates
          onBack={() => navigateTo('home')}
          onSelectTemplate={(template) => {
            setSelectedTemplate(template);
            navigateTo('template-input');
          }}
        />
      </>
    );
  }

  if (currentView === 'template-input') {
    return (
      <div className={`min-h-screen pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {renderRootComponents()}
        <Navbar />
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigateTo('templates')} className={`mb-6 flex items-center gap-2 font-semibold transition-all ${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
            <ArrowLeft className="w-5 h-5" />
            Back to Templates
          </button>

          <div className={`${darkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl border`}>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Final Details</h2>
            <p className={`mb-5 sm:mb-8 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enter your metrics to personalize the {selectedTemplate?.name} plan.</p>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input type="text" value={userMetrics.name} onChange={(e) => setUserMetrics({ ...userMetrics, name: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="Your Name" />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setUserMetrics({ ...userMetrics, gender: 'male' })} className={`p-4 rounded-xl border-2 font-bold transition-all ${userMetrics.gender === 'male' ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-[1.02]' : 'border-gray-200 text-gray-500 hover:border-blue-200'}`}>Male</button>
                  <button onClick={() => setUserMetrics({ ...userMetrics, gender: 'female' })} className={`p-4 rounded-xl border-2 font-bold transition-all ${userMetrics.gender === 'female' ? 'bg-pink-500 text-white border-pink-500 shadow-lg scale-[1.02]' : 'border-gray-200 text-gray-500 hover:border-pink-200'}`}>Female</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Height (cm)</label>
                  <input type="number" value={userMetrics.height} onChange={(e) => setUserMetrics({ ...userMetrics, height: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="175" />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Weight (kg)</label>
                  <input type="number" value={userMetrics.weight} onChange={(e) => setUserMetrics({ ...userMetrics, weight: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="70" />
                </div>
              </div>

              <button onClick={async () => {
                if (!userMetrics.height || !userMetrics.weight || !userMetrics.name) {
                  setValidationDialog({ show: true, message: 'Please fill in all fields!' });
                  return;
                }
                const heightInM = userMetrics.height / 100;
                const bmi = (userMetrics.weight / (heightInM * heightInM)).toFixed(1);

                const dailyCals = Math.round(userMetrics.weight * 25);

                const plan = {
                  type: 'workout',
                  plan_type: 'workout',
                  plan_name: selectedTemplate.name,
                  user_name: userMetrics.name,
                  name: userMetrics.name,
                  user_bmi: bmi,
                  bmi: bmi,
                  user_weight: userMetrics.weight,
                  weight: userMetrics.weight,
                  user_height: userMetrics.height,
                  height: userMetrics.height,
                  user_gender: userMetrics.gender,
                  gender: userMetrics.gender,
                  category: getBMICategory(bmi),
                  level: selectedTemplate.difficulty,
                  plan: {
                    ...selectedTemplate,
                    routine: selectedTemplate.workouts,
                    dailyCalories: dailyCals,
                    macros: { protein: Math.round(userMetrics.weight * 2) + 'g', carbs: Math.round(userMetrics.weight * 3) + 'g', fats: Math.round(userMetrics.weight * 0.8) + 'g' },
                    tips: ['Stay consistent', 'Sleep 8 hours', 'Hydrate well']
                  },
                  reminders: selectedTemplate.workouts.reduce((acc, day) => {
                    acc[day.day] = { enabled: false, time: '06:00' };
                    return acc;
                  }, {})
                };
                await savePlanToBackend(plan);
                navigateTo('saved');
              }} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                Save Program
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthPage onAuthSuccess={() => setCurrentView('home')} />;
  }



  if (currentView === 'home') {
    return (
      <div className={darkMode ? 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800' : 'min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50'}>
        {renderRootComponents()}
        <Navbar />
        {showTimer && (
          <WorkoutTimer
            onClose={() => { setShowTimer(false); loadWorkoutSessions(); }}
            onSaveSession={saveWorkoutSession}
            onSaveProgress={saveWorkoutProgress}
          />
        )}
        {showAICoach && (
          !isAuthenticated ? (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full max-w-md rounded-3xl p-8 text-center border border-white/20 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                  onClick={() => setShowAICoach(false)}
                  className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="text-6xl mb-6">🤖</div>
                <h2 className="text-2xl font-bold text-white mb-3">AI Coach Pro</h2>
                <p className="text-gray-300 mb-8">Login to access your elite AI training partner and start your personalized onboarding.</p>
                <button
                  onClick={() => { setShowAICoach(false); navigateTo('auth'); }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Login to Begin
                </button>
              </div>
            </div>
          ) : (
            <AICoach onBack={() => setShowAICoach(false)} />
          )
        )}
        <div className="pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl mb-4 sm:mb-6 border`}>
              <div className="flex items-start gap-3">
                <Quote className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-yellow-300' : 'text-purple-600'} flex-shrink-0`} />
                <p className={`text-base sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'} font-medium italic`}>{currentQuote}</p>
              </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div onClick={() => { setPlanType('workout'); navigateTo('input'); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="group cursor-pointer transform hover:scale-105 transition-all rounded-3xl h-52 sm:h-80 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0">
                  <img src="/assets/images/card-workout.jpg" alt="Workout" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>
                <div className="relative z-10 p-5 sm:p-8 h-full flex flex-col justify-end">
                  <div className="bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Workout Plan</h2>
                  <p className="text-sm sm:text-base text-gray-200 mb-4">Personalized exercise routines</p>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span>Get Started</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              <div onClick={() => { setPlanType('diet'); navigateTo('input'); setUserMetrics({ ...userMetrics, weight: '', height: '' }); setReminders(initialReminders); }} className="group cursor-pointer transform hover:scale-105 transition-all rounded-3xl h-52 sm:h-80 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0">
                  <img src="/assets/images/card-nutrition.jpg" alt="Diet" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/60 to-transparent"></div>
                </div>
                <div className="relative z-10 p-5 sm:p-8 h-full flex flex-col justify-end">
                  <div className="bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Diet Plan</h2>
                  <p className="text-sm sm:text-base text-gray-100 mb-4">Custom meal plans with macros</p>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span>Get Started</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              <div onClick={() => { setShowAICoach(true); }} className="group cursor-pointer transform hover:scale-105 transition-all rounded-3xl h-52 sm:h-80 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0">
                  <img src="/assets/images/card-coach.jpg" alt="AI Coach" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/60 to-transparent"></div>
                </div>
                <div className="relative z-10 p-5 sm:p-8 h-full flex flex-col justify-end">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md shadow-lg ring-1 ring-white/30">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 underline decoration-indigo-500/50 decoration-4 underline-offset-4">AI Coach</h2>
                  <p className="text-sm sm:text-base text-indigo-100 mb-4 font-medium italic">Elite 1-on-1 Personalized Coaching</p>
                  <div className="flex items-center gap-2 text-white font-semibold bg-indigo-500/20 self-start px-3 py-1 rounded-full border border-indigo-400/30">
                    <span>Unlock Dossier</span>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-40 sm:h-64 shadow-2xl group cursor-pointer">
                <img src="/assets/images/gallery-transform.jpg" alt="Transform" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <div className="text-white">
                    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">💪</div>
                    <p className="font-bold text-sm sm:text-2xl">Transform Your Body</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-40 sm:h-64 shadow-2xl group cursor-pointer">
                <img src="/assets/images/gallery-goals.jpg" alt="Goals" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <div className="text-white">
                    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🎯</div>
                    <p className="font-bold text-sm sm:text-2xl">Achieve Your Goals</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-40 sm:h-64 shadow-2xl group cursor-pointer">
                <img src="/assets/images/gallery-discipline.jpg" alt="Motivation" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <div className="text-white">
                    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🏔️</div>
                    <p className="font-bold text-sm sm:text-2xl">Discipline &gt; Motivation</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-40 sm:h-64 shadow-2xl group cursor-pointer">
                <img src="/assets/images/gallery-running.jpg" alt="Running" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <div className="text-white">
                    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🏃‍♂️</div>
                    <p className="font-bold text-sm sm:text-2xl">Push Your Limits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workout Analytics Section */}
            {workoutSessions.length > 0 && (
              <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl mb-6 border`}>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className={`w-7 h-7 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Progress & Analytics</h2>
                    <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Your workout journey</p>
                  </div>
                </div>

                {/* Stats Header */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* Streak Card */}
                  <div className="flex-1 min-w-[140px] bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
                      <Zap className="w-12 h-12" />
                    </div>
                    {(() => {
                      // Calculate streak logic
                      const sortedSessions = [...workoutSessions].sort((a, b) => new Date(b.date) - new Date(a.date));
                      let streak = 0;
                      if (sortedSessions.length > 0) {
                        const today = new Date();
                        const lastWorkout = new Date(sortedSessions[0].date);
                        const isToday = lastWorkout.toDateString() === today.toDateString();
                        const isYesterday = lastWorkout.toDateString() === new Date(today.getTime() - 86400000).toDateString();

                        if (isToday || isYesterday) {
                          streak = 1;
                          let currentDate = lastWorkout;
                          for (let i = 1; i < sortedSessions.length; i++) {
                            const prevDate = new Date(sortedSessions[i].date);
                            if (currentDate.toDateString() === prevDate.toDateString()) continue;
                            const diffTime = Math.abs(currentDate - prevDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays === 1) { streak++; currentDate = prevDate; } else break;
                          }
                        }
                      }
                      return (
                        <div>
                          <p className="text-white/80 text-sm font-medium mb-1">Current Streak</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-4xl font-bold">{streak}</p>
                            <span className="text-lg">days 🔥</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Total Time Card */}
                  <div className={`flex-1 min-w-[140px] border rounded-2xl p-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</span>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Math.floor(workoutSessions.reduce((sum, s) => sum + s.totalTime, 0) / 60)} <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>min</span>
                    </p>
                  </div>

                  {/* Workouts Card */}
                  <div className={`flex-1 min-w-[140px] border rounded-2xl p-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</span>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {workoutSessions.length}
                    </p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Weekly Activity Bar Chart */}
                  <div className={`rounded-2xl p-6 border flex flex-col ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white/50 border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      Weekly Activity
                    </h3>
                    <div className="flex-1 min-h-48 flex items-end gap-3">
                      {(() => {
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const today = new Date();
                        const last7Days = Array.from({ length: 7 }, (_, i) => {
                          const d = new Date(today);
                          d.setDate(d.getDate() - (6 - i));
                          return d;
                        });

                        return last7Days.map((date, i) => {
                          const dayMinutes = workoutSessions
                            .filter(s => new Date(s.date).toDateString() === date.toDateString())
                            .reduce((sum, s) => sum + s.totalTime, 0) / 60;

                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                              <div className={`w-full rounded-t-lg relative h-full flex items-end ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <div
                                  className={`w-full rounded-t-lg transition-all duration-500 ${dayMinutes > 0 ? 'bg-gradient-to-t from-green-500 to-green-400 group-hover:from-green-400 group-hover:to-green-300' : 'bg-transparent'}`}
                                  style={{ height: `${dayMinutes > 0 ? Math.min((dayMinutes / 60) * 100, 100) : 0}%`, minHeight: dayMinutes > 0 ? '4px' : '0' }}
                                >
                                  {dayMinutes > 0 && (
                                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${darkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                                      {Math.round(dayMinutes)}m
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className={`text-xs ${date.getDay() === today.getDay() ? (darkMode ? 'text-white font-bold' : 'text-indigo-600 font-bold') : 'text-gray-500'}`}>
                                {days[date.getDay()]}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Monthly Calendar View */}
                  <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white/50 border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Calendar className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      This Month
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-center text-xs text-gray-500 font-semibold mb-2">{d}</div>
                      ))}
                      {(() => {
                        const today = new Date();
                        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

                        return Array.from({ length: daysInMonth + firstDay }, (_, i) => {
                          if (i < firstDay) return <div key={i} />;

                          const day = i - firstDay + 1;
                          const date = new Date(today.getFullYear(), today.getMonth(), day);
                          const isToday = day === today.getDate();
                          const hasWorkout = workoutSessions.some(s => new Date(s.date).toDateString() === date.toDateString());

                          return (
                            <div key={i} className="aspect-square flex items-center justify-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                                ${isToday ? (darkMode ? 'border-2 border-white/30 text-white' : 'border-2 border-indigo-600 text-indigo-900 font-bold') : (darkMode ? 'text-gray-400' : 'text-gray-500')}
                                ${hasWorkout ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20' : (darkMode ? 'bg-white/5' : 'bg-gray-100')}
                              `}>
                                {day}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* Recent Workouts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Workouts</h3>
                    <button onClick={() => navigateTo('analytics')} className={`text-sm font-semibold ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                      See All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {workoutSessions.slice(0, 5).map((session, index) => (
                      <div key={index} className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.exerciseName}</p>
                            <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                              {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.floor(session.totalTime / 60)}m {session.totalTime % 60}s</p>
                          <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{session.setsCompleted} sets</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border`}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className={`w-7 h-7 ${darkMode ? 'text-yellow-300' : 'text-purple-600'}`} />
                <h3 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BMI Categories</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {bmiRanges.map((range, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-200'} rounded-2xl p-3 sm:p-4 border overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">{range.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                          <h4 className={`font-bold text-sm sm:text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{range.category}</h4>
                          <span className={`text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full w-fit mx-auto sm:mx-0 ${darkMode ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{range.range}</span>
                        </div>
                        <p className={`text-xs sm:text-sm leading-tight ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>{range.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }

  if (currentView === 'input') {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <img
            src={planType === 'workout'
              ? "/assets/images/workout-bg.jpg"
              : "/assets/images/diet-bg.jpg"}
            alt="Background"
            width="1920"
            height="1080"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm`}></div>
        </div>

        {/* Loading Overlay */}


        <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
          {renderRootComponents()}
          <Navbar />
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 sm:p-4 rounded-2xl ${planType === 'workout' ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-green-600 to-emerald-700'}`}>
                  {planType === 'workout' ? <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-white" /> : <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">{planType === 'workout' ? 'Workout' : 'Diet'} Plan</h2>
                  <p className="text-sm sm:text-base text-gray-600">Let's customize your plan</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                  <input type="text" name="name" autoComplete="off" value={userMetrics.name} onChange={(e) => setUserMetrics({ ...userMetrics, name: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="Enter your name" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setUserMetrics({ ...userMetrics, gender: 'male' })} className={`px-5 py-4 border-2 rounded-2xl font-semibold ${userMetrics.gender === 'male' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200'}`}>Male</button>
                    <button onClick={() => setUserMetrics({ ...userMetrics, gender: 'female' })} className={`px-5 py-4 border-2 rounded-2xl font-semibold ${userMetrics.gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-200'}`}>Female</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg)</label>
                  <input type="number" name="weight" autoComplete="off" value={userMetrics.weight} onChange={(e) => setUserMetrics({ ...userMetrics, weight: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="00" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Height (cm)</label>
                  <input type="number" name="height" autoComplete="off" value={userMetrics.height} onChange={(e) => setUserMetrics({ ...userMetrics, height: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-semibold" placeholder="000" />
                </div>

                {/* Personalization Section - Workout Plan */}
                {planType === 'workout' && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 sm:p-6 rounded-2xl border-2 border-purple-200 mt-4 sm:mt-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-purple-600" />
                      Workout Personalization
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Fitness Level *</label>
                        <select value={preferences.fitnessLevel} onChange={(e) => setPreferences({ ...preferences, fitnessLevel: e.target.value })} className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold">
                          <option value="">Select fitness level</option>
                          <option value="beginner">🌱 Beginner</option>
                          <option value="intermediate">💪 Intermediate</option>
                          <option value="advanced">🏆 Advanced</option>
                        </select>
                      </div>



                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Workout Location *</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setPreferences({ ...preferences, workoutLocation: 'home' })} className={`px-4 py-3 border-2 rounded-xl font-semibold ${preferences.workoutLocation === 'home' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-purple-200'}`}>🏠 Home</button>
                          <button onClick={() => setPreferences({ ...preferences, workoutLocation: 'gym' })} className={`px-4 py-3 border-2 rounded-xl font-semibold ${preferences.workoutLocation === 'gym' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-purple-200'}`}>🏋️ Gym</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Personalization Section - Nutrition Plan */}
                {planType === 'diet' && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-6 rounded-2xl border-2 border-green-200 mt-4 sm:mt-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-green-600" />
                      Diet Personalization
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Primary Goal *</label>
                        <select value={preferences.goalType} onChange={(e) => setPreferences({ ...preferences, goalType: e.target.value })} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-semibold">
                          <option value="">Select your goal</option>
                          <option value="weight-loss">📉 Weight Loss</option>
                          <option value="weight-gain">📈 Weight Gain</option>
                          <option value="muscle-building">💪 Muscle Building</option>
                          <option value="maintenance">⚖️ Maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Restrictions</label>
                        <div className="space-y-2">
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((restriction) => (
                            <label key={restriction} className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-green-50 cursor-pointer">
                              <input type="checkbox" checked={preferences.dietaryRestrictions.includes(restriction)} onChange={(e) => {
                                if (e.target.checked) {
                                  setPreferences({ ...preferences, dietaryRestrictions: [...preferences.dietaryRestrictions, restriction] });
                                } else {
                                  setPreferences({ ...preferences, dietaryRestrictions: preferences.dietaryRestrictions.filter(r => r !== restriction) });
                                }
                              }} className="w-5 h-5 text-green-600 rounded" />
                              <span className="font-semibold text-gray-700 text-sm">{restriction}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}



                <button
                  onClick={handleGeneratePlan}
                  className={`w-full ${planType === 'workout' ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-green-600 to-emerald-700'} text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}
                >
                  Generate My {planType === 'workout' ? 'Workout' : 'Diet'} Plan
                </button>

                <button
                  onClick={() => handleCustomPlan(planType === 'workout' ? 'customWorkout' : 'customDiet')}
                  className={`w-full ${planType === 'workout' ? 'bg-gradient-to-r from-purple-600 to-indigo-700' : 'bg-gradient-to-r from-orange-600 to-amber-700'} text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 mt-4`}
                >
                  Create Custom {planType === 'workout' ? 'Workout' : 'Diet'} Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'result') {
    const categoryInfo = bmiRanges.find(r => r.category === currentPlan.category) || {
      category: currentPlan.category,
      icon: '💪',
      description: 'Custom Plan'
    };
    const hasActiveReminders = true; // Always show reminders section for configuration
    return (
      <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6" style={{ background: darkMode ? (currentPlan.type === 'workout' ? 'linear-gradient(to bottom right, #1f2937, #111827)' : 'linear-gradient(to bottom right, #059669, #047857)') : (currentPlan.type === 'workout' ? 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' : 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)') }}>
        {renderRootComponents()}
        <Navbar />
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-white hover:text-gray-200 font-semibold transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {showToast && (
            <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50">
              <Heart className="w-6 h-6" />
              <span className="font-semibold">Plan saved successfully!</span>
            </div>
          )}

          {showNotificationPrompt && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Enable Notifications?</h3>
                    <p className="text-gray-600 text-sm">Stay on track with your fitness goals</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  You have set up reminders for this plan. Would you like to enable browser notifications to receive them?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => completeSavePlan(true)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Yes, Enable
                  </button>
                  <button
                    onClick={() => completeSavePlan(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    No, Thanks
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${currentPlan.type === 'workout' ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-green-600 to-emerald-700'}`}>
                  {currentPlan.type === 'workout' ? <Dumbbell className="w-8 h-8 text-white" /> : <Utensils className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{currentPlan.name}'s Plan</h2>
                  <p className="text-gray-600">{currentPlan.type === 'workout' ? 'Workout' : 'Nutrition'} Plan</p>
                </div>
              </div>
              <button onClick={savePlan} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <Heart className="w-5 h-5" />Save Plan
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-2xl border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-600 mb-1">Your BMI</p>
                <p className="text-3xl font-bold text-blue-900">{currentPlan.bmi}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border-2 border-purple-200">
                <p className="text-sm font-semibold text-purple-600 mb-1">Category</p>
                <p className="text-2xl font-bold">{categoryInfo.icon} {currentPlan.category}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border-2 border-green-200">
                <p className="text-sm font-semibold text-green-600 mb-1">Metrics</p>
                <p className="text-xl font-bold text-green-900">{currentPlan.weight}kg / {currentPlan.height}cm</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-2xl border-2 border-pink-200">
                <p className="text-sm font-semibold text-pink-600 mb-1">Gender</p>
                <p className="text-xl font-bold text-pink-900 capitalize">{currentPlan.gender}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6 rounded-2xl mb-6 sm:mb-8 border-2 border-amber-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                <Award className="w-7 h-7 text-amber-600" />{currentPlan.plan.goal}
              </h3>
              {currentPlan.type === 'workout' ? (
                <p className="text-gray-700 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /><span className="font-semibold">Frequency:</span> {currentPlan.plan.frequency}
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Daily Calories:</span> {currentPlan.plan.dailyCalories} kcal</p>
                  <p className="text-gray-700"><span className="font-semibold">Macros:</span> Protein {currentPlan.plan.macros.protein} | Carbs {currentPlan.plan.macros.carbs} | Fats {currentPlan.plan.macros.fats}</p>
                </div>
              )}
            </div>





            {/* Weeks Selector (Only if 4-week plan) */}
            {currentPlan.plan.weeks && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Program Schedule</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
                      disabled={selectedWeek === 1}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedWeek(prev => Math.min(4, prev + 1))}
                      disabled={selectedWeek === 4}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {[1, 2, 3, 4].map(wk => (
                    <button
                      key={wk}
                      onClick={() => setSelectedWeek(wk)}
                      className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex flex-col items-center min-w-[100px] border-2 ${selectedWeek === wk
                        ? 'bg-purple-600 text-white border-purple-400 shadow-xl scale-105'
                        : 'bg-white text-gray-600 border-gray-100 hover:border-purple-200'}`}
                    >
                      <span className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">Week</span>
                      <span className="text-xl">{wk}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-2xl border border-purple-200 flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-900 font-bold leading-tight">
                      {currentPlan.plan.weeks.find(w => w.weekNumber === selectedWeek)?.focus}
                    </p>
                    <p className="text-purple-700 text-xs">Current phase of your program</p>
                  </div>
                </div>
              </div>
            )}

            {currentPlan.type === 'workout' ? (
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Routine</h3>
                {(currentPlan.plan.weeks
                  ? (currentPlan.plan.weeks.find(w => w.weekNumber === selectedWeek)?.days || [])
                  : (currentPlan.plan.routine || [])
                ).map((day, idx) => {
                  const isExpanded = expandedDays[idx] !== undefined ? expandedDays[idx] : idx === 0;
                  const toggleDay = () => setExpandedDays(prev => ({ ...prev, [idx]: !isExpanded }));

                  // Handle different data structures (legacy string vs object)
                  const dayName = day.day || day.dayName;
                  const dayFocus = day.focus;

                  return (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 mb-4 overflow-hidden shadow-sm">
                      <button
                        onClick={toggleDay}
                        className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-white/50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${day.exercises.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-gray-700 text-white'}`}>{idx + 1}</div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{dayName}</h4>
                            <p className="text-gray-600 font-semibold text-sm">{dayFocus}</p>
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-inner group-hover:bg-purple-50 transition-all">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && day.exercises && day.exercises.length > 0 && (
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 bg-white/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                          <ul className="space-y-3">
                            {day.exercises.map((exercise, eidx) => {
                              // Detailed Object (New) or String (Legacy)
                              const isObject = typeof exercise === 'object' && exercise !== null;
                              const name = isObject ? exercise.name : exercise;

                              return (
                                <li key={eidx} className="flex flex-col gap-2 text-gray-700 p-4 bg-white/80 rounded-xl hover:bg-white transition-all border border-gray-100 shadow-sm group/exercise">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 font-medium">
                                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                      <span className="text-gray-900 font-bold text-lg">{name}</span>
                                    </div>
                                    <a
                                      href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(name)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all"
                                      title="Watch Tutorial"
                                    >
                                      <Youtube className="w-5 h-5" />
                                    </a>
                                  </div>

                                  {/* Rich Details Badge Row */}
                                  {isObject && (
                                    <div className="flex flex-wrap gap-2 pl-5 mt-1">
                                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                                        {exercise.sets} Sets
                                      </span>
                                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                                        {exercise.reps} Reps
                                      </span>
                                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {exercise.restSeconds || exercise.rest}s Rest
                                      </span>
                                      {exercise.tempo && (
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg border border-orange-200">
                                          Tempo: {exercise.tempo}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Instructions & Progression */}
                                  {isObject && (
                                    <div className="pl-5 mt-1 text-xs text-gray-500 space-y-1">
                                      {exercise.instructions && <p>Trying: {exercise.instructions}</p>}
                                      {exercise.progression && (
                                        <p className="text-purple-600 font-bold flex items-center gap-1">
                                          <TrendingUp className="w-3 h-3" /> {exercise.progression}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {!isObject && (
                                    <div className="pl-5 text-sm text-gray-500">Legacy Exercise Format</div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Daily Meal Plan</h3>
                {(currentPlan.plan.meals || []).map((meal, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-6 rounded-2xl border-2 border-green-200 mb-2 sm:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {meal.meal}
                        {meal.time && <span className="text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-lg border border-green-200">@{meal.time}</span>}
                      </h4>
                      <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">{meal.calories} cal</span>
                    </div>
                    <ul className="space-y-2">
                      {meal.items.map((item, iidx) => (
                        <li key={iidx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-green-600 font-bold">•</span><span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 sm:p-6 rounded-2xl border-2 border-yellow-300 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Pro Tips for Success</h3>
              <ul className="space-y-2 sm:space-y-3">
                {(currentPlan.plan.tips || []).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-yellow-600 font-bold text-xl">✓</span><span className="font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reminders Section */}
            {hasActiveReminders && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-2xl border-2 border-blue-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-blue-600" />
                    Your Reminders
                  </h3>
                  <button
                    onClick={async () => {
                      if (editingReminders) {
                        // Save changes
                        try {
                          const updatedPlan = { ...currentPlan, reminders: currentPlan.reminders };

                          // 1. Update global state for notifications
                          setReminders(updatedPlan.reminders);

                          // 2. Persist to local storage for notifications
                          if (window.storage && window.storage.set) {
                            await window.storage.set('user_reminders', JSON.stringify(updatedPlan.reminders));
                          } else {
                            localStorage.setItem('user_reminders', JSON.stringify(updatedPlan.reminders));
                          }

                          // 3. Persist to Backend if authenticated
                          if (isAuthenticated && currentPlan.plan_id) {
                            await plansAPI.update(currentPlan.plan_id, {
                              ...currentPlan,
                              reminders: currentPlan.reminders,
                              notifications_enabled: true,
                            });
                          }

                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 2000);
                        } catch (err) {
                          console.error("Failed to save reminders", err);
                        }
                      }
                      setEditingReminders(!editingReminders);
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${editingReminders ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {editingReminders ? '✓ Save & Done' : 'Edit'}
                  </button>
                </div>
                <div className="space-y-3">
                  {currentPlan.type === 'workout' ? (
                    <>
                      {(currentPlan.plan.routine || []).map((dayPlan) => {
                        const day = dayPlan.day.toLowerCase();
                        const reminder = currentPlan.reminders[day] || { enabled: false, time: '06:00' };
                        return (
                          <div key={day} className="flex items-center justify-between p-3 bg-white rounded-xl">
                            <div className="flex items-center gap-3">
                              <Dumbbell className="w-5 h-5 text-purple-600" />
                              <span className="font-semibold text-gray-700 capitalize">{dayPlan.day}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {editingReminders ? (
                                <>
                                  <input
                                    type="time"
                                    value={reminder.time}
                                    onChange={(e) => setCurrentPlan({
                                      ...currentPlan,
                                      reminders: {
                                        ...currentPlan.reminders,
                                        [day]: {
                                          ...reminder,
                                          time: e.target.value
                                        }
                                      }
                                    })}
                                    className="px-3 py-1 border-2 border-blue-200 rounded-lg text-sm font-semibold"
                                  />
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={reminder.enabled}
                                      onChange={(e) => setCurrentPlan({
                                        ...currentPlan,
                                        reminders: {
                                          ...currentPlan.reminders,
                                          [day]: {
                                            ...reminder,
                                            enabled: e.target.checked
                                          }
                                        }
                                      })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </>
                              ) : (
                                reminder.enabled && (
                                  <span className="text-blue-600 font-bold">{reminder.time}</span>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {(currentPlan.plan.meals || []).map((meal, idx) => {
                        const reminder = currentPlan.reminders[meal.meal] || { enabled: false, time: meal.time };
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-xl gap-2">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <Utensils className="w-5 h-5 text-orange-600" />
                              <span className="font-semibold text-gray-700">{meal.meal}</span>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                              {editingReminders ? (
                                <>
                                  <input
                                    type="time"
                                    value={reminder.time}
                                    onChange={(e) => setCurrentPlan({
                                      ...currentPlan,
                                      reminders: {
                                        ...currentPlan.reminders,
                                        [meal.meal]: { ...reminder, time: e.target.value }
                                      }
                                    })}
                                    className="px-3 py-1 border-2 border-orange-200 rounded-lg text-sm font-semibold"
                                  />
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={reminder.enabled}
                                      onChange={(e) => setCurrentPlan({
                                        ...currentPlan,
                                        reminders: {
                                          ...currentPlan.reminders,
                                          [meal.meal]: { ...reminder, enabled: e.target.checked }
                                        }
                                      })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                  </label>
                                </>
                              ) : (
                                reminder.enabled && (
                                  <span className="text-blue-600 font-bold">{reminder.time}</span>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>


                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'saved') {
    if (!isAuthenticated) {
      return (
        <>
          {renderRootComponents()}
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 pt-32">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login to view your saved plans</p>
              <button
                onClick={() => navigateTo('auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          {/* Desktop Background */}
          <img src="/assets/images/saved-bg-desktop.jpg" alt="Saved Plans Desktop" width="1920" height="1080" className="hidden md:block w-full h-full object-cover" />
          {/* Mobile Background */}
          <img src="/assets/images/saved-bg-mobile.jpg" alt="Saved Plans Mobile" width="768" height="1024" className="block md:hidden w-full h-full object-cover" />
          <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/90' : 'bg-slate-100/80'} backdrop-blur-sm`}></div>
        </div>

        <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
          <Navbar />
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-2xl">
                  <Folder className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Saved Plans</h2>
                  <p className="text-gray-600">Your fitness journey collection</p>
                </div>
              </div>

              {savedPlans.length === 0 ? (
                <div className="text-center py-10 sm:py-16">
                  <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 font-semibold">No saved plans yet</p>
                  <p className="text-gray-400 mt-2">Create and save your first plan!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  {savedPlans.map((plan, idx) => (
                    <div key={idx} className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/50 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 sm:p-3 rounded-xl ${plan.plan_type === 'workout' ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-green-600 to-emerald-700'}`}>
                            {plan.plan_type === 'workout' ? <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{plan.user_name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize font-medium">{plan.plan_name || `${plan.plan_type} Plan`}</p>
                          </div>
                        </div>
                        <button onClick={() => deletePlan(plan.plan_id || plan.id)} className="p-2 sm:p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all group">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </button>
                      </div>

                      {/* Timestamp */}
                      {plan.timestamp && (
                        <div className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 rounded-lg w-fit">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(plan.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="bg-blue-50 p-2 sm:p-3 rounded-xl text-center border border-blue-200">
                          <p className="text-[10px] sm:text-xs font-bold text-blue-600 mb-0.5 sm:mb-1 uppercase tracking-wide">BMI</p>
                          <p className="text-base sm:text-lg font-bold text-blue-900">{plan.user_bmi}</p>
                        </div>
                        <div className="bg-purple-50 p-2 sm:p-3 rounded-xl text-center border border-purple-200">
                          <p className="text-[10px] sm:text-xs font-bold text-purple-600 mb-0.5 sm:mb-1 uppercase tracking-wide">Category</p>
                          <p className="text-xs sm:text-sm font-bold text-purple-900 truncate px-1">{plan.category}</p>
                        </div>
                        <div className="bg-green-50 p-2 sm:p-3 rounded-xl text-center border border-green-200">
                          <p className="text-[10px] sm:text-xs font-bold text-green-600 mb-0.5 sm:mb-1 uppercase tracking-wide">Weight</p>
                          <p className="text-base sm:text-lg font-bold text-green-900">{plan.user_weight}<span className="text-xs sm:text-sm ml-0.5">kg</span></p>
                        </div>
                      </div>

                      <button onClick={() => {
                        let planContent = plan.plan || plan.plan_content;
                        if (!planContent) {
                          alert("Error loading plan content");
                          return;
                        }
                        // Normalize routine for templates which use 'workouts' key
                        if (plan.plan_type === 'workout' && !planContent.routine && planContent.workouts) {
                          planContent = { ...planContent, routine: planContent.workouts };
                        }

                        // Normalize plan metadata (category, goal, frequency)
                        const planGoal = planContent.goal || plan.plan_name || (plan.plan_type === 'workout' ? 'Workout Goal' : 'Nutrition Goal');
                        const planFrequency = planContent.frequency || (plan.plan_type === 'workout' ? '3 days/week' : (planContent.dailyCalories ? `${planContent.dailyCalories} kcal/day` : 'Balanced Diet'));
                        const planTips = planContent.tips && planContent.tips.length > 0 ? planContent.tips : (plan.plan_type === 'workout'
                          ? ['Stay consistent with your routine', 'Focus on proper form', 'Hydrate before and after workouts']
                          : ['Eat whole, unprocessed foods', 'Control your portions', 'Drink plenty of water']);

                        const loadedPlan = {
                          plan_id: plan.plan_id || plan._id, // CRITICAL: Include the plan_id for delete/update operations
                          type: plan.plan_type,
                          bmi: plan.user_bmi,
                          category: plan.category || 'Normal',
                          weight: plan.user_weight,
                          height: plan.user_height,
                          gender: plan.user_gender,
                          name: plan.user_name,
                          plan: {
                            ...planContent,
                            goal: planGoal,
                            frequency: planFrequency,
                            tips: planTips
                          },
                          reminders: plan.reminders || (plan.plan_type === 'workout'
                            ? (planContent.routine || []).reduce((acc, day) => {
                              acc[day.day ? day.day.toLowerCase() : 'day'] = { enabled: false, time: '06:00' };
                              return acc;
                            }, {})
                            : (planContent.meals || []).reduce((acc, meal) => {
                              acc[meal.meal] = { enabled: false, time: meal.time };
                              return acc;
                            }, {}))
                        };
                        setCurrentPlan(loadedPlan);
                        setSelectedWeek(1);
                        navigateTo('result');
                      }} className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all active:scale-95">
                        View Full Plan
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect legacy history to analytics
  if (currentView === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
        {renderRootComponents()}
        <Navbar />
        <Analytics
          workoutSessions={workoutSessions}
          onBack={() => navigateTo('home')}
        />
      </div>
    );
  }


  if (currentView === 'feedback') {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/feedback-bg.jpg" alt="Feedback Background" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${darkMode ? 'bg-purple-900/90' : 'bg-violet-900/80'} backdrop-blur-sm`}></div>
        </div>

        <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
          <Navbar />
          <div className="max-w-2xl mx-auto">
            {feedbackSubmitted && (
              <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <Heart className="w-6 h-6" />
                <span className="font-semibold">Thank you! Your response has been recorded.</span>
              </div>
            )}

            {feedbackError && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-xl">
                <p className="font-semibold">⚠️ {feedbackError}</p>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Feedback</h2>
                  <p className="text-gray-600">We'd love to hear from you!</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input type="text" value={feedbackForm.name} onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg" placeholder="Enter your name" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input type="email" value={feedbackForm.email} onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Feedback</label>
                  <textarea rows="6" value={feedbackForm.message} onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })} className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg resize-none" placeholder="Share your thoughts..."></textarea>
                </div>

                <button onClick={handleFeedbackSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/contact-bg.jpg" alt="Contact Background" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${darkMode ? 'bg-indigo-900/90' : 'bg-blue-900/80'} backdrop-blur-sm`}></div>
        </div>

        <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6">
          <Navbar />
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Contact Us</h2>
                  <p className="text-gray-600">Get in touch with our team</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />Email
                  </h3>
                  <a href="mailto:mohitjhawar1128@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold">mohitjhawar1128@gmail.com</a>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />Live Chat / Phone
                  </h3>
                  <a href="tel:+916300019668" className="text-green-600 hover:text-green-800 font-semibold text-xl">+91 6300019668</a>
                  <p className="text-gray-700 mt-2">Available Monday - Friday, 9 AM - 6 PM IST</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />Social Media
                  </h3>
                  <p className="text-gray-700">Follow us @FitLifePro on all platforms</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Office Hours</h3>
                <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM IST</p>
                <p className="text-gray-700">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom Workout Plan View
  if (currentView === 'customWorkout') {
    if (!isAuthenticated) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 pt-32">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login to create custom workout plans</p>
              <button
                onClick={() => navigateTo('auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          </div>
        </>
      );
    }
    const addDay = () => {
      setCustomWorkout({
        ...customWorkout,
        days: [...customWorkout.days, { day: '', focus: '', exercises: [''] }]
      });
    };

    const removeDay = (index) => {
      const newDays = customWorkout.days.filter((_, i) => i !== index);
      setCustomWorkout({ ...customWorkout, days: newDays });
    };

    const updateDay = (index, field, value) => {
      const newDays = [...customWorkout.days];
      newDays[index][field] = value;
      setCustomWorkout({ ...customWorkout, days: newDays });
    };

    const addExercise = (dayIndex) => {
      const newDays = [...customWorkout.days];
      newDays[dayIndex].exercises.push('');
      setCustomWorkout({ ...customWorkout, days: newDays });
    };

    const removeExercise = (dayIndex, exerciseIndex) => {
      const newDays = [...customWorkout.days];
      newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex);
      setCustomWorkout({ ...customWorkout, days: newDays });
    };

    const updateExercise = (dayIndex, exerciseIndex, value) => {
      const newDays = [...customWorkout.days];
      newDays[dayIndex].exercises[exerciseIndex] = value;
      setCustomWorkout({ ...customWorkout, days: newDays });
    };

    const saveCustomWorkout = () => {
      // Check authentication first
      if (!isAuthenticated) {
        setShowLoginDialog(true);
        return;
      }

      if (!customWorkout.planName || !customWorkout.goal) {
        setValidationDialog({ show: true, message: 'Please fill in plan name and goal!' });
        return;
      }

      // Validate that at least one day has a name
      const validDays = customWorkout.days.filter(d => d.day && d.day.trim() !== '');
      if (validDays.length === 0) {
        setValidationDialog({ show: true, message: 'Please add at least one workout day with a name!' });
        return;
      }

      const customPlan = {
        type: 'workout',
        name: userMetrics.name || 'User',
        bmi: userMetrics.weight && userMetrics.height ? (userMetrics.weight / ((userMetrics.height / 100) ** 2)).toFixed(1) : '0',
        category: 'Custom',
        weight: userMetrics.weight,
        height: userMetrics.height,
        gender: userMetrics.gender,
        plan: {
          goal: customWorkout.goal,
          frequency: `${validDays.length} days/week`,
          routine: validDays.map(day => ({
            day: day.day.trim(),
            focus: day.focus || 'Custom Workout',
            exercises: day.exercises.filter(e => e && e.trim() !== '')
          })),
          tips: ['Stay consistent with your custom routine', 'Track your progress regularly', 'Adjust intensity as needed']
        },
        reminders: validDays.reduce((acc, day) => {
          acc[day.day.toLowerCase()] = { enabled: false, time: '06:00' };
          return acc;
        }, {})
      };

      setCurrentPlan(customPlan);
      navigateTo('result');
    };

    return (
      <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6" style={{ background: darkMode ? 'linear-gradient(to bottom right, #1f2937, #111827)' : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
        <Navbar />
        <ValidationDialog />
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigateTo('input')} className="mb-6 flex items-center gap-2 text-white hover:text-gray-300 font-semibold transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Plan Selection
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-2xl">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Create Custom Workout</h2>
                <p className="text-gray-600">Design your personalized workout routine</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  value={customWorkout.planName}
                  onChange={(e) => setCustomWorkout({ ...customWorkout, planName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., My Strength Training"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Goal *</label>
                <input
                  type="text"
                  value={customWorkout.goal}
                  onChange={(e) => setCustomWorkout({ ...customWorkout, goal: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Build muscle and increase strength"
                />
              </div>

              {/* Days */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-gray-700">Workout Days</label>
                  <button
                    onClick={addDay}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    + Add Day
                  </button>
                </div>

                {customWorkout.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-50 p-4 rounded-xl mb-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Day {dayIndex + 1}</h4>
                      {customWorkout.days.length > 1 && (
                        <button
                          onClick={() => removeDay(dayIndex)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          Remove Day
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Day Name</label>
                        <input
                          type="text"
                          value={day.day}
                          onChange={(e) => updateDay(dayIndex, 'day', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., Monday"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Focus Area</label>
                        <input
                          type="text"
                          value={day.focus}
                          onChange={(e) => updateDay(dayIndex, 'focus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., Upper Body, Legs, Cardio"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-600">Exercises</label>
                          <button
                            onClick={() => addExercise(dayIndex)}
                            className="text-xs px-3 py-1 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600"
                          >
                            + Add Exercise
                          </button>
                        </div>
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={exercise}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="e.g., Bench Press - 3 sets x 10 reps"
                            />
                            {day.exercises.length > 1 && (
                              <button
                                onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-semibold"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={saveCustomWorkout}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                View Custom Workout Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom Diet Plan View
  if (currentView === 'customDiet') {
    if (!isAuthenticated) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 pt-32">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login to create custom diet plans</p>
              <button
                onClick={() => navigateTo('auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          </div>
        </>
      );
    }
    const addMeal = () => {
      setCustomDiet({
        ...customDiet,
        meals: [...customDiet.meals, { meal: '', time: '12:00', items: [''], calories: '' }]
      });
    };

    const removeMeal = (index) => {
      const newMeals = customDiet.meals.filter((_, i) => i !== index);
      setCustomDiet({ ...customDiet, meals: newMeals });
    };

    const updateMeal = (index, field, value) => {
      const newMeals = [...customDiet.meals];
      newMeals[index][field] = value;
      setCustomDiet({ ...customDiet, meals: newMeals });
    };

    const addFoodItem = (mealIndex) => {
      const newMeals = [...customDiet.meals];
      newMeals[mealIndex].items.push('');
      setCustomDiet({ ...customDiet, meals: newMeals });
    };

    const removeFoodItem = (mealIndex, itemIndex) => {
      const newMeals = [...customDiet.meals];
      newMeals[mealIndex].items = newMeals[mealIndex].items.filter((_, i) => i !== itemIndex);
      setCustomDiet({ ...customDiet, meals: newMeals });
    };

    const updateFoodItem = (mealIndex, itemIndex, value) => {
      const newMeals = [...customDiet.meals];
      newMeals[mealIndex].items[itemIndex] = value;
      setCustomDiet({ ...customDiet, meals: newMeals });
    };

    const saveCustomDiet = () => {
      // Check authentication first
      if (!isAuthenticated) {
        setShowLoginDialog(true);
        return;
      }

      if (!customDiet.planName || !customDiet.goal || !customDiet.dailyCalories) {
        setValidationDialog({ show: true, message: 'Please fill in plan name, goal, and daily calories!' });
        return;
      }

      // Validate that at least one meal has a name
      const validMeals = customDiet.meals.filter(m => m.meal && m.meal.trim() !== '');
      if (validMeals.length === 0) {
        setValidationDialog({ show: true, message: 'Please add at least one meal with a name!' });
        return;
      }

      const customPlan = {
        type: 'diet',
        name: userMetrics.name || 'User',
        bmi: userMetrics.weight && userMetrics.height ? (userMetrics.weight / ((userMetrics.height / 100) ** 2)).toFixed(1) : '0',
        category: 'Custom',
        weight: userMetrics.weight,
        height: userMetrics.height,
        gender: userMetrics.gender,
        plan: {
          goal: customDiet.goal,
          dailyCalories: customDiet.dailyCalories,
          macros: { protein: 'Custom', carbs: 'Custom', fats: 'Custom' },
          meals: validMeals.map(meal => ({
            meal: meal.meal.trim(),
            time: meal.time || '12:00',
            items: meal.items.filter(item => item && item.trim() !== ''),
            calories: meal.calories || '0'
          })),
          tips: ['Follow your custom meal plan consistently', 'Stay hydrated throughout the day', 'Adjust portions based on your goals']
        },
        reminders: validMeals.reduce((acc, meal) => {
          acc[meal.meal.trim()] = { enabled: false, time: meal.time || '12:00' };
          return acc;
        }, {})
      };

      setCurrentPlan(customPlan);
      navigateTo('result');
    };

    return (
      <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 p-3 sm:p-6" style={{ background: darkMode ? 'linear-gradient(to bottom right, #059669, #047857)' : 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)' }}>
        <Navbar />
        <ValidationDialog />
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigateTo('input')} className="mb-6 flex items-center gap-2 text-white hover:text-gray-300 font-semibold transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Plan Selection
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-orange-600 to-amber-700 p-4 rounded-2xl">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Create Custom Diet Plan</h2>
                <p className="text-gray-600">Design your personalized meal plan</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  value={customDiet.planName}
                  onChange={(e) => setCustomDiet({ ...customDiet, planName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., My Healthy Eating Plan"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Goal *</label>
                <input
                  type="text"
                  value={customDiet.goal}
                  onChange={(e) => setCustomDiet({ ...customDiet, goal: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Maintain healthy weight and balanced nutrition"
                />
              </div>

              {/* Daily Calories */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Daily Calories Target *</label>
                <input
                  type="number"
                  value={customDiet.dailyCalories}
                  onChange={(e) => setCustomDiet({ ...customDiet, dailyCalories: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 2000"
                />
              </div>

              {/* Meals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-gray-700">Meals</label>
                  <button
                    onClick={addMeal}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
                  >
                    + Add Meal
                  </button>
                </div>

                {customDiet.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-green-50 p-4 rounded-xl mb-4 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Meal {mealIndex + 1}</h4>
                      {customDiet.meals.length > 1 && (
                        <button
                          onClick={() => removeMeal(mealIndex)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          Remove Meal
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Meal Name</label>
                          <input
                            type="text"
                            value={meal.meal}
                            onChange={(e) => updateMeal(mealIndex, 'meal', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="e.g., Breakfast"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Time</label>
                          <input
                            type="time"
                            value={meal.time}
                            onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Calories</label>
                        <input
                          type="number"
                          value={meal.calories}
                          onChange={(e) => updateMeal(mealIndex, 'calories', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., 500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-600">Food Items</label>
                          <button
                            onClick={() => addFoodItem(mealIndex)}
                            className="text-xs px-3 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                          >
                            + Add Item
                          </button>
                        </div>
                        {meal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateFoodItem(mealIndex, itemIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="e.g., 2 eggs, whole wheat toast"
                            />
                            {meal.items.length > 1 && (
                              <button
                                onClick={() => removeFoodItem(mealIndex, itemIndex)}
                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-semibold"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={saveCustomDiet}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                View Custom Diet Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
        {renderRootComponents()}
        <Navbar />
        <Analytics
          workoutSessions={workoutSessions}
          onBack={() => navigateTo('home')}
        />
      </div>
    );
  }


  return null;
};

export default App;