
import React from 'react';
import { formatTime } from '../../utils/helpers';

const ResultsSummary = ({ result, timeFormat }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-blue-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full border-collapse">
            <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="p-4 text-left text-blue-800 dark:text-blue-300 font-semibold w-1/3 bg-blue-50/50 dark:bg-slate-700/50">Duración Total</th>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-200">{formatTime(result.duration, timeFormat)}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="p-4 text-left text-blue-800 dark:text-blue-300 font-semibold bg-blue-50/50 dark:bg-slate-700/50">Puntos Áureos (φ)</th>
                    <td className="p-4 text-amber-600 dark:text-amber-400 font-mono font-bold">
                        {result.goldenPoints.map(p => formatTime(p, timeFormat)).join(', ')}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="p-4 text-left text-blue-800 dark:text-blue-300 font-semibold bg-blue-50/50 dark:bg-slate-700/50">Picos de Energía Detectados</th>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-200">
                        <div className="flex flex-wrap gap-2">
                            {result.peaks.map((p, i) => (
                                <span key={i} className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                                    {formatTime(p.time, timeFormat)}
                                </span>
                            ))}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th className="p-4 text-left text-blue-800 dark:text-blue-300 font-semibold bg-blue-50/50 dark:bg-slate-700/50">Puntuación de Simetría</th>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${result.proximityScore < 5 ? 'text-green-500' : result.proximityScore < 15 ? 'text-blue-500' : 'text-amber-500'}`}>
                                {result.proximityScore.toFixed(2)}%
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                (Menor es mejor)
                            </span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default ResultsSummary;
