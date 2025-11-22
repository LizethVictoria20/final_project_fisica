
import React from 'react';

const FileUpload = ({ onFileChange, onAnalyze, audioFile, isLoading }) => (
    <div className="bg-blue-50 dark:bg-slate-800/50 border-2 border-dashed border-blue-200 dark:border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 transition-colors hover:border-blue-400 dark:hover:border-blue-500 mb-8">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 text-blue-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.975.285 1.8.655 2.566 1.052.325.168.65.351.975.548.325-.197.65-.38.975-.548.766-.397 1.59-.767 2.566-1.052a1.803 1.803 0 01-.99 3.59l-1.32-.377a2.25 2.25 0 01-1.632-2.163v-3.75m0-6.64V2.625c0-1.036-.84-1.875-1.875-1.875h-1.5c-1.036 0-1.875.84-1.875 1.875v11.193a3.725 3.725 0 01-1.313 2.887l-.282.236a3.75 3.75 0 00-5.808 4.216l.252.365a2.25 2.25 0 003.148.618l.282-.188a3.75 3.75 0 001.815-2.762l.122-.918a3.75 3.75 0 00-1.815-3.433l-.282-.188a3.75 3.75 0 00-2.074-.417l-.94.188" />
                </svg>
            </div>
            <label htmlFor="audio-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Seleccionar archivo de audio
            </label>
            <input id="audio-upload" type="file" accept="audio/*" onChange={onFileChange} className="hidden" />
        </div>
        
        {audioFile && (
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-blue-100 dark:border-slate-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{audioFile.name}</span>
            </div>
        )}
        
        <button 
            onClick={onAnalyze} 
            disabled={!audioFile || isLoading} 
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform active:scale-95 ${
                !audioFile || isLoading 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-blue-500/30'
            }`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando...
                </span>
            ) : 'Analizar Composición'}
        </button>
    </div>
);

export default FileUpload;
