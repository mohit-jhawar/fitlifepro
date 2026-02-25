import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

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
    const [resendCountdown, setResendCountdown] = useState(0);

    const { login, googleLogin } = useAuth();

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
            setSuccess('Login successful!');
            setTimeout(() => {
                if (onAuthSuccess) onAuthSuccess();
            }, 800);
        } else {
            if (result.data?.requiresVerification) {
                setPendingEmail(result.data.email);
                setShowOTPInput(true);
                setResendCountdown(60);
                setSuccess('Please verify via OTP.');
            } else {
                if (result.errors && Array.isArray(result.errors)) {
                    setValidationErrors(result.errors);
                } else {
                    setError(result.message);
                }
            }
        }

        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setValidationErrors([]);
        setLoading(true);

        const result = await googleLogin(credentialResponse.credential);

        if (result.success) {
            setSuccess('Google Login successful!');
            setTimeout(() => {
                if (onAuthSuccess) onAuthSuccess();
                else window.location.href = '/plans'; // Default redirect
            }, 800);
        } else {
            setError(result.message || 'Google Login failed');
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        setError('Google Login failed. Please try again.');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);
        setLoading(true);

        if (!registerData.gender) {
            setValidationErrors([{ field: 'gender', message: 'Select gender' }]);
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register(registerData);

            if (response.success) {
                setPendingEmail(registerData.email);
                setShowOTPInput(true);
                setResendCountdown(60);
                setSuccess('OTP sent!');
            } else {
                if (response.errors && Array.isArray(response.errors)) {
                    setValidationErrors(response.errors);
                } else {
                    setError(response.message);
                }
            }
        } catch (err) {
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
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                setSuccess('Verified! Welcome!');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }

        setLoading(false);
    };

    const handleResendOTP = async () => {
        if (resendCountdown > 0) return;

        setError('');
        setLoading(true);

        try {
            const response = await authAPI.resendOTP(pendingEmail);

            if (response.success) {
                setResendCountdown(60);
                setSuccess('OTP resent.');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex bg-gray-900 overflow-hidden">
            {/* Background Image Layer */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/assets/images/workout-bg.jpg"
                    alt="Fitness background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-900/85 to-black/80 backdrop-blur-[2px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-16 xl:px-24 pt-32 pb-12 gap-8">

                {/* Left Side: Text - Slightly Scaled Down */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left animate-fadeIn space-y-5 lg:space-y-6">
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl">
                        Transform Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-white">Body & Mind</span>
                    </h2>
                    <p className="text-base lg:text-lg text-purple-100/90 leading-relaxed font-light tracking-wide max-w-md">
                        Join thousands of users transforming their lives with personalized workout plans and AI-driven coaching.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-purple-400 bg-purple-900/60 flex items-center justify-center text-xs text-white font-bold backdrop-blur-sm shadow-sm">
                                    {i === 1 ? 'JD' : i === 2 ? 'AS' : 'MK'}
                                </div>
                            ))}
                        </div>
                        <div className="text-white font-medium text-sm text-opacity-90">
                            <span className="text-yellow-400 mr-1">★★★★★</span>
                            Trusted by 200+ members
                        </div>
                    </div>
                </div>

                {/* Right Side: Compact White Card */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end animate-fadeInUp lg:pl-8">
                    <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-2xl w-full max-w-[360px] relative z-20">

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {showOTPInput ? 'Verify Email' : (isLogin ? 'Welcome Back!' : 'Join FitLife Pro')}
                            </h2>
                            <p className="text-gray-500 text-xs font-medium">
                                {showOTPInput ? 'Enter code sent to email' :
                                    isLogin ? 'Login to continue' :
                                        'Start your journey today'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        {validationErrors.length > 0 && (
                            <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                <p className="text-red-700 font-bold text-xs mb-1">Please fix:</p>
                                <ul className="space-y-0.5">
                                    {validationErrors.map((err, i) => (
                                        <li key={i} className="text-red-600 text-xs flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                            <span className="capitalize font-semibold">{err.field}:</span> {err.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border border-green-100">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                {success}
                            </div>
                        )}

                        {showOTPInput ? (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                                    <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">Code sent to</p>
                                    <p className="text-purple-900 font-mono font-medium text-sm truncate px-2">{pendingEmail}</p>
                                </div>

                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full h-12 text-center text-2xl font-mono tracking-[0.5em] font-bold text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-gray-300"
                                    placeholder="000000"
                                    maxLength={6}
                                    autoFocus
                                />

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={resendCountdown > 0}
                                        className="text-purple-600 hover:text-purple-700 text-xs font-medium disabled:opacity-50"
                                    >
                                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </form>
                        ) : isLogin ? (
                            <div className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-3.5">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                placeholder="hello@example.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-0.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                            <span className="text-xs text-gray-500 font-medium">Remember me</span>
                                        </label>
                                        <button type="button" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot Password?</button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-1 text-sm"
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>

                                <div className="relative flex items-center justify-center pt-2 pb-1">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative px-3 bg-white text-xs text-gray-400 font-medium">Or</div>
                                </div>

                                <div className="flex justify-center w-full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap
                                        theme="outline"
                                        shape="pill"
                                        text="continue_with"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <form onSubmit={handleRegister} className="space-y-3.5">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={registerData.name}
                                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Gender</label>
                                                <select
                                                    value={registerData.gender}
                                                    onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm appearance-none"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Birth Date</label>
                                                <input
                                                    type="date"
                                                    value={registerData.dateOfBirth}
                                                    onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                placeholder="hello@example.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={registerData.password}
                                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                    placeholder="Create password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-1 text-sm"
                                    >
                                        {loading ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </form>

                                <div className="relative flex items-center justify-center pt-2 pb-1">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative px-3 bg-white text-xs text-gray-400 font-medium">Or</div>
                                </div>

                                <div className="flex justify-center w-full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        theme="outline"
                                        shape="pill"
                                        text="signup_with"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        )}

                        {!showOTPInput && (
                            <div className="mt-6 text-center border-t border-gray-100 pt-5">
                                <p className="text-gray-500 text-xs sm:text-sm">
                                    {isLogin ? "Don't have an account?" : "Already fit?"}
                                    <button
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError('');
                                            setValidationErrors([]);
                                            setSuccess('');
                                        }}
                                        className="ml-1.5 text-purple-600 font-bold hover:text-purple-700 hover:underline transition-all"
                                    >
                                        {isLogin ? "Sign up" : "Log in"}
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
