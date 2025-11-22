
import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import TimeFormatSelector from '../ui/TimeFormatSelector';

const Header = ({ theme, onToggleTheme, timeFormat, onToggleTimeFormat }) => (
    <header className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700 p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-white mb-1">Simetría Áurea Musical</h1>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Juan Manuel Hurtado Isaza & Lizeth Victoria Franco</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl">
            <TimeFormatSelector format={timeFormat} onToggle={onToggleTimeFormat} />
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
    </header>
);

export default Header;
