
export const GOLDEN_RATIO = 1.61803398875;
export const PEAK_COUNT = 5;

export const formatTime = (seconds: number | undefined | null, format: 'min_sec' | 'seconds' = 'min_sec') => {
    if (seconds === undefined || seconds === null) return '';
    
    if (format === 'seconds') {
        return `${seconds.toFixed(2)}s`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedSecs = secs.toFixed(2);
    return `${mins}:${secs < 10 ? '0' : ''}${formattedSecs}`;
};
