
import { GOLDEN_RATIO, PEAK_COUNT } from './helpers';

export const calculateEnergyData = (buffer: AudioBuffer, width: number) => {
    const rawData = buffer.getChannelData(0);
    const samples = Math.floor(width);
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
    }
    return filteredData;
};

export const calculateWaveformData = (buffer: AudioBuffer, samples: number) => {
    const rawData = buffer.getChannelData(0); // Left channel
    const blockSize = Math.floor(rawData.length / samples);
    const waveform = [];
    
    // Optimization: Sampling step to avoid freezing on large files
    const step = Math.ceil(blockSize / 10); 

    for (let i = 0; i < samples; i++) {
        let min = 0;
        let max = 0;
        const blockStart = i * blockSize;
        
        for (let j = 0; j < blockSize; j += step) {
            const val = rawData[blockStart + j];
            if (val < min) min = val;
            if (val > max) max = val;
        }
        waveform.push({ min, max });
    }
    return waveform;
};

export const analyzeAudio = async (file: File) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const duration = decodedBuffer.duration;
    
    // 1. Calcular Puntos Áureos
    const mainGoldenPoint = duration / GOLDEN_RATIO;
    const secondaryGoldenPoint = duration - mainGoldenPoint;
    const goldenPoints = [mainGoldenPoint, secondaryGoldenPoint].sort((a,b) => a-b);
    
    const rawData = decodedBuffer.getChannelData(0);
    const sampleRate = decodedBuffer.sampleRate;
    
    // 2. Análisis RMS (Root Mean Square) por ventanas de 100ms
    // Esto es mejor que el promedio simple para medir "intensidad sonora" perciba
    const windowSize = Math.floor(sampleRate * 0.1); // 0.1 segundos
    const rmsChunks = [];
    
    let totalEnergy = 0;

    for (let i = 0; i < rawData.length; i += windowSize) {
        let sumSquares = 0;
        // Limite del chunk para no desbordar el array
        const end = Math.min(i + windowSize, rawData.length);
        const length = end - i;

        for (let j = i; j < end; j++) {
            sumSquares += rawData[j] * rawData[j];
        }
        
        const rms = Math.sqrt(sumSquares / length);
        totalEnergy += rms;
        
        rmsChunks.push({
            time: i / sampleRate,
            energy: rms
        });
    }
    
    // Normalizar energía (0 a 1) y calcular promedio
    const maxEnergyValue = Math.max(...rmsChunks.map(c => c.energy)) || 1;
    const averageEnergy = (totalEnergy / rmsChunks.length) / maxEnergyValue;
    
    rmsChunks.forEach(c => c.energy /= maxEnergyValue);

    // 3. Algoritmo de Detección de Picos (Local Maxima con Umbral)
    // Un pico es un punto mayor que sus vecinos y mayor que un umbral dinámico (ej. 1.5x el promedio)
    const peaks = [];
    const threshold = averageEnergy * 1.2; // Debe ser al menos 20% más fuerte que el promedio
    const minPeakDistance = 5; // Mínimo 5 segundos entre picos para evitar agrupamiento

    for (let i = 1; i < rmsChunks.length - 1; i++) {
        const current = rmsChunks[i];
        const prev = rmsChunks[i-1];
        const next = rmsChunks[i+1];

        // Es un máximo local?
        if (current.energy > prev.energy && current.energy > next.energy) {
            // Supera el umbral de ruido?
            if (current.energy > threshold) {
                peaks.push(current);
            }
        }
    }

    // Ordenar por energía descendente
    peaks.sort((a, b) => b.energy - a.energy);

    // Filtrar picos para asegurar diversidad temporal (no 5 picos en el mismo coro)
    const distinctPeaks = [];
    for (const peak of peaks) {
        if (distinctPeaks.length >= PEAK_COUNT) break;
        
        // Solo agregar si está lejos de los picos ya seleccionados
        const isDistinct = distinctPeaks.every(p => Math.abs(p.time - peak.time) > minPeakDistance);
        
        if (isDistinct) {
            distinctPeaks.push(peak);
        }
    }
    
    // Si no encontramos suficientes picos distintos, rellenar con los más altos restantes
    if (distinctPeaks.length < PEAK_COUNT) {
        const remaining = peaks
            .filter(p => !distinctPeaks.includes(p))
            .slice(0, PEAK_COUNT - distinctPeaks.length);
        distinctPeaks.push(...remaining);
    }

    // Ordenar los picos finales cronológicamente para mostrarlos
    const topPeaks = distinctPeaks.sort((a, b) => a.time - b.time);

    // 4. Calcular Simetría
    let totalProximity = 0;
    topPeaks.forEach(peak => {
        const minDistance = Math.min(...goldenPoints.map(gp => Math.abs(peak.time - gp)));
        // Penalización suavizada basada en la duración total
        totalProximity += (minDistance / duration);
    });
    
    // Normalizar score (0 a 100, donde 0 es match perfecto)
    // Multiplicamos por un factor para que sea legible
    const proximityScore = Math.min((totalProximity / topPeaks.length) * 100, 100);

    // Datos para visualización
    const energyData = calculateEnergyData(decodedBuffer, 800);
    const waveformData = calculateWaveformData(decodedBuffer, 1000);
    
    return {
        fileName: file.name,
        duration,
        goldenPoints,
        peaks: topPeaks,
        proximityScore,
        energyData,
        waveformData,
    };
};
