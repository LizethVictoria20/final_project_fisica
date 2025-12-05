type TimeFormat = "min_sec" | "seconds";

interface TimeFormatSelectorProps {
  format: TimeFormat;
  onToggle: (format: TimeFormat) => void;
}

const TimeFormatSelector = ({ format, onToggle }: TimeFormatSelectorProps) => (
  <div className="flex bg-blue-50 dark:bg-slate-700 rounded-lg p-1 border border-blue-100 dark:border-slate-600">
    <button
      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
        format === "min_sec"
          ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
      }`}
      onClick={() => onToggle("min_sec")}
      title="Ver en Minutos:Segundos"
    >
      Min:Seg
    </button>

    <button
      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
        format === "seconds"
          ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
      }`}
      onClick={() => onToggle("seconds")}
      title="Ver en Segundos totales"
    >
      Seg
    </button>
  </div>
);

export default TimeFormatSelector;
