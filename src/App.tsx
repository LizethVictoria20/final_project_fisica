
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';
import FileUpload from './components/analysis/FileUpload';
import AnalysisChart from './components/analysis/AnalysisChart';
import WaveformChart from './components/analysis/WaveformChart';
import ResultsSummary from './components/analysis/ResultsSummary';
import HistoryList from './components/history/HistoryList';
import Loader from './components/ui/Loader';
import ErrorMessage from './components/ui/ErrorMessage';
import { analyzeAudio } from './utils/audio';

const App = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [theme, setTheme] = useState('light');
    const [timeFormat, setTimeFormat] = useState('min_sec'); // 'min_sec' or 'seconds'
    const [activeView, setActiveView] = useState('analyzer');

    // Cargar historial, tema y formato de tiempo al iniciar
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('analysisHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                setTheme(storedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // Auto-detect system dark mode preference
                setTheme('dark');
            }
            
            const storedTimeFormat = localStorage.getItem('timeFormat');
            if (storedTimeFormat) {
                setTimeFormat(storedTimeFormat);
            }
        } catch (e) {
            console.error("Failed to parse from localStorage", e);
        }
    }, []);

    // Guardar historial
    useEffect(() => {
        localStorage.setItem('analysisHistory', JSON.stringify(history));
    }, [history]);

    // Aplicar y guardar tema (Updated for Tailwind 'dark' class)
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Guardar formato de tiempo
    useEffect(() => {
        localStorage.setItem('timeFormat', timeFormat);
    }, [timeFormat]);

    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleToggleTimeFormat = (format) => {
        setTimeFormat(format);
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file);
            setAnalysisResult(null);
            setError('');
        } else {
            setError('Por favor, selecciona un archivo de audio válido.');
            setAudioFile(null);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!audioFile) return;

        setIsLoading(true);
        setError('');
        setAnalysisResult(null);

        try {
            const newResult = await analyzeAudio(audioFile);
            setAnalysisResult(newResult);
            setHistory(prevHistory => [newResult, ...prevHistory.filter(h => h.fileName !== newResult.fileName)]);

        } catch (err) {
            console.error(err);
            setError('No se pudo procesar el archivo. Puede estar corrupto o en un formato no compatible.');
        } finally {
            setIsLoading(false);
        }
    }, [audioFile]);

    const handleDownloadJSON = () => {
        if (!analysisResult) return;

        const jsonString = JSON.stringify(analysisResult, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        
        a.href = url;
        const safeFileName = analysisResult.fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `analisis_${safeFileName}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestoreFromHistory = (item) => {
        setAnalysisResult(item);
        setAudioFile(null); 
        setError('');
        setActiveView('analyzer');
        window.scrollTo(0, 0);
    };

    const handleClearHistory = () => {
        setHistory([]);
    };
    
    return (
        <>
            <Header 
                theme={theme} 
                onToggleTheme={handleToggleTheme}
                timeFormat={timeFormat}
                onToggleTimeFormat={handleToggleTimeFormat}
            />
            <Navigation activeView={activeView} onNavigate={setActiveView} />
            
            <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeView === 'analyzer' && (
                    <>
                        <FileUpload 
                            onFileChange={handleFileChange}
                            onAnalyze={handleAnalyze}
                            audioFile={audioFile}
                            isLoading={isLoading}
                        />
                        
                        <ErrorMessage message={error} />
                        
                        {isLoading && <Loader />}

                        {analysisResult && (
                            <section className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-xl font-bold text-blue-900 dark:text-white">Visualización del Espectro</h2>
                                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-sm font-medium truncate max-w-[200px]">
                                        {analysisResult.fileName}
                                    </span>
                                </div>
                                
                                <div className="mb-2 flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300 font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                    Distribución de Energía y Puntos Áureos
                                </div>
                                <AnalysisChart result={analysisResult} timeFormat={timeFormat} />

                                {analysisResult.waveformData && (
                                    <>
                                        <div className="mb-2 flex items-center gap-2 text-sm text-sky-700 dark:text-sky-300 font-semibold mt-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                            </svg>
                                            Oscilograma (Forma de Onda Detallada)
                                        </div>
                                        <WaveformChart result={analysisResult} timeFormat={timeFormat} />
                                    </>
                                )}

                                <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4 mt-8">Resultados Matemáticos</h2>
                                <ResultsSummary result={analysisResult} timeFormat={timeFormat} />
                                
                                <div className="flex justify-end mt-8">
                                    <button 
                                        onClick={handleDownloadJSON} 
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-all shadow-lg shadow-slate-300 dark:shadow-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Descargar JSON
                                    </button>
                                </div>
                            </section>
                        )}
                    </>
                )}

                {activeView === 'history' && (
                    <HistoryList 
                        history={history}
                        onRestore={handleRestoreFromHistory}
                        onClear={handleClearHistory}
                        timeFormat={timeFormat}
                    />
                )}
            </main>
            
            <Footer />
        </>
    );
};

export default App;
