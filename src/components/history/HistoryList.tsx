
import React from 'react';
import { formatTime } from '../../utils/helpers';

const HistoryList = ({ history, onRestore, onClear, timeFormat }) => {
    if (!history || history.length === 0) {
        return (
            <section className="mt-8 text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-slate-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">Historial Vacío</h2>
                <p className="text-slate-500 text-sm">Aún no has realizado ningún análisis.</p>
            </section>
        );
    }

    return (
        <section className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900 dark:text-white">Historial de Análisis</h2>
                <button 
                    onClick={onClear} 
                    className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    Limpiar Historial
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700 overflow-hidden">
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                    {history.map((item, index) => (
                        <li 
                            key={index} 
                            onClick={() => onRestore(item)}
                            className="p-4 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors flex justify-between items-center group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 dark:bg-slate-600 p-2 rounded-full text-blue-600 dark:text-blue-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                        {item.fileName}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Duración: {formatTime(item.duration, timeFormat)} • Simetría: {item.proximityScore.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                            <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default HistoryList;
