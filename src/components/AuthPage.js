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

    // Forgot Password States
    const [forgotPasswordState, setForgotPasswordState] = useState('none'); // 'none', 'email', 'otp', 'reset'
    const [resetEmail, setResetEmail] = useState('');
    const [resetOTP, setResetOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

    const handleForgotPasswordEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.forgotPassword(resetEmail);
            if (response.success) {
                setSuccess('OTP sent to your email.');
                setForgotPasswordState('otp');
                setResendCountdown(60); // Re-using existing countdown
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code');
        }
        setLoading(false);
    };

    const handleForgotPasswordOTP = async (e) => {
        e.preventDefault();
        if (resetOTP.length !== 6) return;
        // Proceed to next step without making an API call yet, just visually
        // verification happens when setting the new password for security.
        setForgotPasswordState('reset');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.resetPassword(resetEmail, resetOTP, newPassword);
            if (response.success) {
                setSuccess('Password reset successfully!');
                setTimeout(() => {
                    setForgotPasswordState('none');
                    setIsLogin(true);
                    setSuccess('');
                    setResetEmail('');
                    setResetOTP('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                }, 2000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
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
            <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-between pt-20 sm:pt-24 lg:pt-32 px-6 lg:px-8 pb-10 gap-16 lg:gap-24">

                {/* Left Side: Text */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left animate-fadeIn space-y-6 lg:space-y-8 lg:pr-10">
                    <h2 className="text-4xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl">
                        Transform Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-white">Body & Mind</span>
                    </h2>
                    <p className="text-lg lg:text-xl text-purple-100/90 leading-relaxed font-light tracking-wide max-w-lg">
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

                {/* Right Side: Form Card */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fadeInUp">
                    <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-2xl w-full max-w-[440px] xl:max-w-[480px] relative z-20">

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {forgotPasswordState !== 'none'
                                    ? (forgotPasswordState === 'email' ? 'Reset Password' : forgotPasswordState === 'otp' ? 'Enter Code' : 'New Password')
                                    : showOTPInput ? 'Verify Email' : (isLogin ? 'Welcome Back!' : 'Join FitLife Pro')}
                            </h2>
                            <p className="text-gray-500 text-xs font-medium">
                                {forgotPasswordState !== 'none'
                                    ? (forgotPasswordState === 'email' ? 'We will send you a reset code' : forgotPasswordState === 'otp' ? 'Sent to your email' : 'Secure your account')
                                    : showOTPInput ? 'Enter code sent to email' :
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

                        {forgotPasswordState !== 'none' ? (
                            <div className="space-y-4">
                                {forgotPasswordState === 'email' && (
                                    <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                placeholder="Enter your email to reset"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {loading ? 'Sending...' : 'Send Reset Code'}
                                        </button>
                                    </form>
                                )}

                                {forgotPasswordState === 'otp' && (
                                    <form onSubmit={handleForgotPasswordOTP} className="space-y-4">
                                        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                                            <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">Code sent to</p>
                                            <p className="text-purple-900 font-mono font-medium text-sm truncate px-2">{resetEmail}</p>
                                        </div>
                                        <input
                                            type="text"
                                            value={resetOTP}
                                            onChange={(e) => setResetOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full h-12 text-center text-2xl font-mono tracking-[0.5em] font-bold text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-gray-300"
                                            placeholder="000000"
                                            maxLength={6}
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={resetOTP.length !== 6}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Continue
                                        </button>
                                    </form>
                                )}

                                {forgotPasswordState === 'reset' && (
                                    <form onSubmit={handleResetPassword} className="space-y-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
                                        >
                                            {loading ? 'Resetting...' : 'Set New Password'}
                                        </button>
                                    </form>
                                )}

                                <div className="text-center mt-4 pt-2">
                                    <button
                                        onClick={() => {
                                            setForgotPasswordState('none');
                                            setError('');
                                            setSuccess('');
                                        }}
                                        className="text-gray-500 hover:text-gray-700 text-xs font-medium underline"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        ) : showOTPInput ? (
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
                                        <button type="button" onClick={() => {
                                            setForgotPasswordState('email');
                                            setError('');
                                            setSuccess('');
                                            setValidationErrors([]);
                                        }} className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot Password?</button>
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

                        {!showOTPInput && forgotPasswordState === 'none' && (
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
