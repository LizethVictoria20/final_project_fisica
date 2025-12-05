const Loader = () => (
    <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">Procesando señal de audio...</p>
    </div>
);

export default Loader;
