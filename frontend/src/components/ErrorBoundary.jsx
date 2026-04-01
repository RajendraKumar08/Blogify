import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-xl w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Oops!
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Something went wrong while loading this page. Our team has been notified and we're working to fix it.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
                    <div className="text-left">
                        <p className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-2">Error Details</p>
                        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-red-700 break-words opacity-80 overflow-auto max-h-40">
                            {error?.statusText || error?.message || "An unexpected dynamic error occurred."}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/"
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all duration-200 active:scale-95"
                    >
                        Back to Home
                    </Link>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all duration-200 active:scale-95"
                    >
                        Try Refreshing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
