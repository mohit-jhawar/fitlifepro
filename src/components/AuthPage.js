import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Calendar, ArrowLeft, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otp, setOTP] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [pendingName, setPendingName] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);

    const { login } = useAuth();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        name: '',
        gender: '',
        dateOfBirth: ''
    });

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);
        setLoading(true);

        const result = await login(loginData);

        if (result.success) {
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                if (onAuthSuccess) onAuthSuccess();
            }, 1500);
        } else {
            // Check if verification is required
            if (result.data?.requiresVerification) {
                setPendingEmail(result.data.email);
                setPendingName(result.data.name);
                setShowOTPInput(true);
                setResendCountdown(60);
                setSuccess('Please verify your email to continue. OTP sent!');

                // Optionally trigger a resend automatically or just let them use the existing one
                // authAPI.resendOTP(result.data.email); 
            } else {
                // Check if there are validation errors
                if (result.errors && Array.isArray(result.errors)) {
                    setValidationErrors(result.errors);
                } else {
                    setError(result.message);
                }
            }
        }

        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);
        setLoading(true);

        // Validate gender is selected
        if (!registerData.gender) {
            setValidationErrors([{ field: 'gender', message: 'Please select your gender' }]);
            setLoading(false);
            return;
        }

        try {
            // Step 1: Send registration request (will generate OTP)
            const response = await authAPI.register(registerData);

            if (response.success) {
                setPendingEmail(registerData.email);
                setPendingName(registerData.name);
                setShowOTPInput(true);
                setResendCountdown(60); // Start 60-second countdown
                setSuccess('OTP sent to your email! Please check your inbox.');
            } else {
                // Check if there are validation errors
                if (response.errors && Array.isArray(response.errors)) {
                    setValidationErrors(response.errors);
                } else {
                    setError(response.message);
                }
            }
        } catch (err) {
            // Parse validation errors from backend
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                setValidationErrors(err.response.data.errors);
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        }

        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP({ email: pendingEmail, otp });

            if (response.success) {
                // Store tokens and user data
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                setSuccess('Email verified! Welcome to FitLife Pro!');
                setTimeout(() => {
                    window.location.reload(); // Reload to update auth context
                }, 1500);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        }

        setLoading(false);
    };

    const handleResendOTP = async () => {
        if (resendCountdown > 0) return; // Prevent spamming

        setError('');
        setLoading(true);

        try {
            const response = await authAPI.resendOTP(pendingEmail);

            if (response.success) {
                setResendCountdown(60); // Reset countdown
                setSuccess('OTP resent! Please check your email.');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-12 sm:pt-24 p-4 sm:p-6">
            <div className="max-w-md mx-auto">
                <button
                    onClick={onAuthSuccess}
                    className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 font-semibold transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 shadow-2xl">
                    <div className="text-center mb-5 sm:mb-8">
                        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {showOTPInput ? 'Verify Your Email' : (isLogin ? 'Welcome Back!' : 'Join FitLife Pro')}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {showOTPInput
                                ? 'Enter the OTP sent to your email'
                                : (isLogin ? 'Login to continue your fitness journey' : 'Start your fitness transformation today')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                            <p className="text-red-700 font-semibold text-xs sm:text-sm">{error}</p>
                        </div>
                    )}

                    {validationErrors.length > 0 && (
                        <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                            <p className="text-red-800 font-bold text-xs sm:text-sm mb-2">⚠️ Please fix the following errors:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {validationErrors.map((err, index) => (
                                    <li key={index} className="text-red-700 text-xs sm:text-sm">
                                        <span className="font-semibold capitalize">{err.field}:</span> {err.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 sm:mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                            <p className="text-green-700 font-semibold text-xs sm:text-sm">{success}</p>
                        </div>
                    )}

                    {showOTPInput ? (
                        <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-purple-900 font-semibold text-sm mb-1">📧 Check Your Email</p>
                                        <p className="text-purple-700 text-xs">We've sent a 6-digit  verification code to:</p>
                                        <p className="text-purple-900 font-mono font-bold text-sm mt-1">{pendingEmail}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-2xl text-center font-mono text-gray-900 bg-white tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">Enter the 6-digit code from your email</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                            </button>

                            <div className="flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendCountdown > 0 || loading}
                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading && 'animate-spin'}`} />
                                    {resendCountdown > 0
                                        ? `Resend OTP in ${resendCountdown}s`
                                        : 'Resend OTP'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowOTPInput(false);
                                    setOTP('');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="w-full text-gray-600 hover:text-gray-800 font-semibold"
                            >
                                ← Back to Registration
                            </button>
                        </form>
                    ) : isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base sm:text-lg text-gray-900 bg-white"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base sm:text-lg text-gray-900 bg-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-xs sm:text-sm">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-lg text-gray-900 bg-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-xs sm:text-sm">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-lg text-gray-900 bg-white"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg text-gray-900 bg-white"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Must contain uppercase, lowercase, number, and special character (@$!%*?&)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-xs sm:text-sm">Gender *</label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {['male', 'female', 'other'].map((gender) => (
                                        <button
                                            key={gender}
                                            type="button"
                                            onClick={() => setRegisterData({ ...registerData, gender })}
                                            className={`px - 2 sm: px - 4 py - 2 sm: py - 3 border - 2 rounded - xl font - semibold capitalize text - xs sm: text - base ${registerData.gender === gender
                                                ? 'bg-purple-500 text-white border-purple-500'
                                                : 'bg-white text-gray-700 border-gray-200'
                                                } `}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-xs sm:text-sm">Date of Birth (Optional)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={registerData.dateOfBirth}
                                        onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-lg text-gray-900 bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {!showOTPInput && (
                        <div className="mt-4 sm:mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setValidationErrors([]);
                                    setSuccess('');
                                }}
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
