import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Flame, Calendar, Clock, Target, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Analytics = ({ workoutSessions, onBack }) => {
    const { isAuthenticated } = useAuth();

    // Calculate streak with rest day logic
    const calculateStreak = (sessions) => {
        if (!sessions || sessions.length === 0) return { current: 0, longest: 0 };

        const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

        let currentStreak = 0;
        let longestStreak = 0;
        let consecutiveDays = 0;
        let lastDate = null;
        let restDaysThisWeek = 0;

        for (const session of sortedSessions) {
            const sessionDate = new Date(session.date);
            sessionDate.setHours(0, 0, 0, 0);

            if (lastDate) {
                const daysDiff = Math.floor((lastDate - sessionDate) / (1000 * 60 * 60 * 24));

                if (daysDiff === 1) {
                    // Consecutive day
                    consecutiveDays++;
                    restDaysThisWeek = 0;
                } else if (daysDiff === 2 && restDaysThisWeek === 0) {
                    // One rest day (allowed once per week)
                    consecutiveDays++;
                    restDaysThisWeek++;
                } else {
                    // Streak broken
                    if (consecutiveDays > longestStreak) {
                        longestStreak = consecutiveDays;
                    }
                    consecutiveDays = 1;
                    restDaysThisWeek = 0;
                }
            } else {
                // First session
                consecutiveDays = 1;
            }

            lastDate = sessionDate;
        }

        currentStreak = consecutiveDays;
        if (consecutiveDays > longestStreak) {
            longestStreak = consecutiveDays;
        }

        return { current: currentStreak, longest: longestStreak };
    };

    // Get last 7 days of data for chart
    const chartData = useMemo(() => {
        const data = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            // Find sessions for this day
            const daySessions = workoutSessions.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate.toISOString().split('T')[0] === dateStr;
            });

            // Sum up duration for the day
            const totalMinutes = daySessions.reduce((sum, session) => {
                return sum + (session.duration || 0);
            }, 0);

            data.push({
                day: dayName,
                date: dateStr,
                minutes: totalMinutes,
                hours: (totalMinutes / 60).toFixed(2),
                sessions: daySessions.length
            });
        }

        return data;
    }, [workoutSessions]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!workoutSessions || workoutSessions.length === 0) {
            return {
                totalWorkouts: 0,
                totalMinutes: 0,
                avgDuration: 0,
                thisWeek: 0,
                thisMonth: 0
            };
        }

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const totalMinutes = workoutSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const thisWeekSessions = workoutSessions.filter(s => new Date(s.date) >= weekAgo);
        const thisMonthSessions = workoutSessions.filter(s => new Date(s.date) >= monthAgo);

        return {
            totalWorkouts: workoutSessions.length,
            totalMinutes,
            avgDuration: totalMinutes / workoutSessions.length,
            thisWeek: thisWeekSessions.length,
            thisMonth: thisMonthSessions.length
        };
    }, [workoutSessions]);

    const streak = useMemo(() => calculateStreak(workoutSessions), [workoutSessions]);

    // Unauthenticated state
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-24 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 font-semibold transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl">
                        <div className="text-6xl mb-6">📊</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Your Progress</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Login to view your workout analytics, track your streak, and monitor your fitness journey!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <BarChart3 className="w-8 h-8 text-purple-500" />
                            <Flame className="w-8 h-8 text-orange-500" />
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Max height for chart (3 hours = 180 minutes)
    const maxChartHeight = 180;
    const maxBarHeight = 200; // pixels

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-24 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 font-semibold transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <BarChart3 className="w-10 h-10" />
                        Analytics
                    </h1>
                    <p className="text-gray-300">Track your progress and stay motivated</p>
                </div>

                {/* Streak and Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Current Streak */}
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Flame className="w-8 h-8 text-white" />
                            <h3 className="text-white font-bold text-lg">Current Streak</h3>
                        </div>
                        <p className="text-5xl font-bold text-white mb-1">{streak.current}</p>
                        <p className="text-orange-100 text-sm">days in a row</p>
                    </div>

                    {/* Longest Streak */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-8 h-8 text-white" />
                            <h3 className="text-white font-bold text-lg">Best Streak</h3>
                        </div>
                        <p className="text-5xl font-bold text-white mb-1">{streak.longest}</p>
                        <p className="text-purple-100 text-sm">personal record</p>
                    </div>

                    {/* This Week */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-8 h-8 text-white" />
                            <h3 className="text-white font-bold text-lg">This Week</h3>
                        </div>
                        <p className="text-5xl font-bold text-white mb-1">{stats.thisWeek}</p>
                        <p className="text-green-100 text-sm">workouts completed</p>
                    </div>

                    {/* Average Duration */}
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-8 h-8 text-white" />
                            <h3 className="text-white font-bold text-lg">Avg Duration</h3>
                        </div>
                        <p className="text-5xl font-bold text-white mb-1">{Math.round(stats.avgDuration)}</p>
                        <p className="text-blue-100 text-sm">minutes per session</p>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Last 7 Days
                    </h2>

                    {chartData.every(d => d.minutes === 0) ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No workout data for the last 7 days</p>
                            <p className="text-gray-400 text-sm mt-2">Complete a workout to see your progress here!</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Chart */}
                            <div className="flex items-end justify-between gap-3 sm:gap-6 h-64 mb-4">
                                {chartData.map((day, index) => {
                                    const barHeight = (day.minutes / maxChartHeight) * maxBarHeight;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            {/* Bar */}
                                            <div className="relative w-full flex items-end justify-center" style={{ height: maxBarHeight }}>
                                                {day.minutes > 0 && (
                                                    <div className="relative group">
                                                        <div
                                                            className="w-12 sm:w-16 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-xl transition-all hover:opacity-80 cursor-pointer"
                                                            style={{ height: `${barHeight}px` }}
                                                        />
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            <p className="font-bold">{day.minutes} min</p>
                                                            <p>({day.hours} hrs)</p>
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Day label */}
                                            <p className="text-xs sm:text-sm font-semibold text-gray-700">{day.day}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 -ml-12 h-64 flex flex-col justify-between text-xs text-gray-500">
                                <span>3h</span>
                                <span>2h</span>
                                <span>1h</span>
                                <span>0</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total Workouts</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.totalWorkouts}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total Time</p>
                            <p className="text-3xl font-bold text-purple-600">{Math.round(stats.totalMinutes / 60)}h</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">This Month</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
