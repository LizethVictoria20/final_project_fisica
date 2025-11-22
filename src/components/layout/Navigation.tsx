
import React from 'react';

const Navigation = ({ activeView, onNavigate }) => (
    <nav className="flex justify-center gap-2 mb-8">
        <button
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                activeView === 'analyzer' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
            onClick={() => onNavigate('analyzer')}
        >
            Analizador
        </button>
        <button
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                activeView === 'history' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
            onClick={() => onNavigate('history')}
        >
            Historial
        </button>
    </nav>
);

export default Navigation;
