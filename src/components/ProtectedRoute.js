import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please login to access this feature</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
