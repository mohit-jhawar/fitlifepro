import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Calendar, Flame, Award, Dumbbell } from 'lucide-react';
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
                    consecutiveDays++;
                    restDaysThisWeek = 0;
                } else if (daysDiff === 2 && restDaysThisWeek === 0) {
                    consecutiveDays++;
                    restDaysThisWeek++;
                } else {
                    if (consecutiveDays > longestStreak) {
                        longestStreak = consecutiveDays;
                    }
                    consecutiveDays = 1;
                    restDaysThisWeek = 0;
                }
            } else {
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

            const daySessions = workoutSessions.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate.toISOString().split('T')[0] === dateStr;
            });

            // totalTime is in seconds, convert to minutes
            const totalMinutes = daySessions.reduce((sum, session) => {
                return sum + ((session.totalTime || 0) / 60);
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

        const totalMinutes = workoutSessions.reduce((sum, s) => sum + ((s.totalTime || 0) / 60), 0);
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

    // Generate heatmap data for last 4 weeks (moved before conditional return)
    const heatmapData = useMemo(() => {
        const weeks = 4;
        const days = weeks * 7;
        const heatmap = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();

            const dayWorkouts = workoutSessions.filter(s => new Date(s.date).toDateString() === dateStr);

            // Calculate intensity based on total workout time (in minutes)
            let intensity = 0;
            if (dayWorkouts.length > 0) {
                const totalMinutes = dayWorkouts.reduce((sum, w) => sum + ((w.totalTime || 0) / 60), 0);

                // Intensity levels based on total workout time
                if (totalMinutes >= 90) intensity = 4;        // 90+ min = max intensity
                else if (totalMinutes >= 60) intensity = 3;   // 60-89 min = high
                else if (totalMinutes >= 30) intensity = 2;   // 30-59 min = medium  
                else if (totalMinutes > 0) intensity = 1;     // 1-29 min = low
            }

            heatmap.push({ date, dateStr, intensity, count: dayWorkouts.length });
        }

        return heatmap;
    }, [workoutSessions]);

    // Unauthenticated state (after all hooks)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-24 p-6">
                <div className="max-w-4xl mx-auto">
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

    const maxChartValue = Math.max(...chartData.map(d => d.minutes), 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-6 sm:pb-8 px-3 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-white">Analytics Dashboard</h1>
                            <p className="text-sm sm:text-base text-gray-300 mt-0.5 sm:mt-1">Track your fitness journey and celebrate your progress</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                    {/* Current Streak */}
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer flex flex-col sm:block items-center justify-center sm:justify-start">
                        <div className="flex items-start justify-between w-full mb-1 sm:mb-4">
                            <Flame className="w-5 h-5 sm:w-8 sm:h-8 text-white mb-1 sm:mb-0" />
                            <div className="hidden sm:block bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Streak</span>
                            </div>
                        </div>
                        <p className="text-2xl sm:text-5xl font-bold text-white mb-0.5 sm:mb-1 leading-none">{streak.current}</p>
                        <p className="text-orange-100 text-[10px] sm:text-sm font-medium text-center sm:text-left uppercase sm:normal-case tracking-wide sm:tracking-normal">Streak</p>
                    </div>

                    {/* Best Streak */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer flex flex-col sm:block items-center justify-center sm:justify-start">
                        <div className="flex items-start justify-between w-full mb-1 sm:mb-4">
                            <Award className="w-5 h-5 sm:w-8 sm:h-8 text-white mb-1 sm:mb-0" />
                            <div className="hidden sm:block bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Best</span>
                            </div>
                        </div>
                        <p className="text-2xl sm:text-5xl font-bold text-white mb-0.5 sm:mb-1 leading-none">{streak.longest}</p>
                        <p className="text-purple-100 text-[10px] sm:text-sm font-medium text-center sm:text-left uppercase sm:normal-case tracking-wide sm:tracking-normal">Best</p>
                    </div>

                    {/* This Week */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer flex flex-col sm:block items-center justify-center sm:justify-start">
                        <div className="flex items-start justify-between w-full mb-1 sm:mb-4">
                            <Calendar className="w-5 h-5 sm:w-8 sm:h-8 text-white mb-1 sm:mb-0" />
                            <div className="hidden sm:block bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Week</span>
                            </div>
                        </div>
                        <p className="text-2xl sm:text-5xl font-bold text-white mb-0.5 sm:mb-1 leading-none">{stats.thisWeek}</p>
                        <p className="text-green-100 text-[10px] sm:text-sm font-medium text-center sm:text-left uppercase sm:normal-case tracking-wide sm:tracking-normal">Sessions</p>
                    </div>

                    {/* Avg Duration */}
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer flex flex-col sm:block items-center justify-center sm:justify-start">
                        <div className="flex items-start justify-between w-full mb-1 sm:mb-4">
                            <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-white mb-1 sm:mb-0" />
                            <div className="hidden sm:block bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Avg</span>
                            </div>
                        </div>
                        <p className="text-2xl sm:text-5xl font-bold text-white mb-0.5 sm:mb-1 leading-none">{Math.round(stats.avgDuration)}</p>
                        <p className="text-blue-100 text-[10px] sm:text-sm font-medium text-center sm:text-left uppercase sm:normal-case tracking-wide sm:tracking-normal">Avg Min</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Weekly Activity Chart */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl h-full flex flex-col min-h-[300px] sm:min-h-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            Weekly Activity
                        </h3>
                        {chartData.every(d => d.minutes === 0) ? (
                            <div className="text-center py-8 flex-1 flex flex-col justify-center">
                                <p className="text-gray-400 text-lg mb-2">No activity this week</p>
                                <p className="text-gray-500 text-sm mt-2">Complete a workout to see your progress!</p>
                            </div>
                        ) : (
                            <div className="flex items-end justify-between gap-1.5 sm:gap-2 w-full mt-auto flex-1">
                                {chartData.map((day, index) => {
                                    const height = (day.minutes / maxChartValue) * 100;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group h-full justify-end">
                                            <div className="w-full flex items-end justify-center h-full">
                                                <div className="relative w-full h-full flex items-end justify-center">
                                                    <div
                                                        className="w-full max-w-[20px] sm:max-w-[40px] bg-gradient-to-t from-purple-600 via-pink-500 to-orange-400 rounded-t-lg transition-all group-hover:opacity-80 cursor-pointer"
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    {day.minutes > 0 && (
                                                        <div className="absolute -top-7 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            {Math.round(day.minutes)}min
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-semibold text-gray-300">{day.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Intensity Heatmap */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl h-full flex flex-col min-h-[300px] sm:min-h-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                            Intensity Heatmap (4 Weeks)
                        </h3>
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full mt-auto content-end">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-xs font-bold text-gray-400 mb-1">
                                    {day}
                                </div>
                            ))}
                            {heatmapData.map((cell, idx) => {
                                const colors = [
                                    'bg-gray-700/50',
                                    'bg-green-500/30',
                                    'bg-green-500/60',
                                    'bg-green-500',
                                    'bg-orange-500'
                                ];
                                return (
                                    <div
                                        key={idx}
                                        className={`aspect-square rounded sm:rounded-lg transition-all cursor-pointer hover:scale-110 hover:shadow-lg group relative ${cell.intensity === 0 ? 'bg-slate-700/50' : colors[cell.intensity]
                                            } border border-white/5`}
                                        title={`${cell.date.toLocaleDateString()}: ${cell.count} workout${cell.count !== 1 ? 's' : ''}`}
                                    >
                                        <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap z-10 bg-gray-900 text-white border border-white/20">
                                            {cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br />{cell.count} workout{cell.count !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded ${[
                                    'bg-slate-700/50',
                                    'bg-green-500/30',
                                    'bg-green-500/60',
                                    'bg-yellow-500/70',
                                    'bg-orange-500'
                                ][i]}`}></div>
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Overall Summary</h3>
                    <div className="grid grid-cols-3 gap-3 sm:gap-6">
                        <div className="text-center">
                            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Workouts</p>
                            <p className="text-3xl sm:text-4xl font-bold text-purple-400">{stats.totalWorkouts}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Time</p>
                            <p className="text-3xl sm:text-4xl font-bold text-cyan-400">{Math.floor(stats.totalMinutes / 60)}h</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">This Month</p>
                            <p className="text-3xl sm:text-4xl font-bold text-green-400">{stats.thisMonth}</p>
                        </div>
                    </div>
                </div>

                {/* Workout History */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-purple-400" />
                        Recent Workouts
                    </h3>
                    {workoutSessions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No workouts logged yet</p>
                            <p className="text-gray-500 text-sm mt-2">Start training to build your history!</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                            {workoutSessions.slice().reverse().slice(0, 10).map((session, index) => (
                                <div key={index} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all border border-white/10">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
                                                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm sm:text-base">{session.exerciseName}</h4>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Duration</p>
                                                <p className="font-semibold text-white text-sm sm:text-base">{Math.floor(session.totalTime / 60)}m {session.totalTime % 60}s</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Sets</p>
                                                <p className="font-semibold text-white text-sm sm:text-base">{session.setsCompleted}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
