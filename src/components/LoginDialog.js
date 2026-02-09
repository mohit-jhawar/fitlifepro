import React from 'react';
import { LogIn, X } from 'lucide-react';

const LoginDialog = ({ isOpen, onClose, onGoToLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Login Required</h3>
                            <p className="text-gray-600 text-sm">Save your progress</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-gray-700 mb-8 text-lg">
                    You need to login to save your plans and track your progress. Create an account or login to get started!
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onGoToLogin}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                        Go to Login Page
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    You can still generate and view plans without logging in
                </p>
            </div>
        </div>
    );
};

export default LoginDialog;
