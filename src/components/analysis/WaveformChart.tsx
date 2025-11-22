
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatTime } from '../../utils/helpers';

const WaveformChart = ({ result, timeFormat }) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!result || !result.waveformData || !svgRef.current || !wrapperRef.current) return;

        const { duration, waveformData } = result;
        
        // Dimensions
        const margin = { top: 20, right: 40, bottom: 40, left: 50 };
        const width = wrapperRef.current.clientWidth - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom; // Slightly shorter height

        // Clear previous SVG
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, duration])
            .range([0, width]);

        // Y Scale for Amplitude (-1 to 1)
        const yScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        // Gradients definition
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "raw-wave-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#0ea5e9").attr("stop-opacity", 0.8); // Sky 500
        gradient.append("stop").attr("offset", "50%").attr("stop-color", "#22d3ee").attr("stop-opacity", 0.9); // Cyan 400
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#0ea5e9").attr("stop-opacity", 0.8);

        // Axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(width > 600 ? 10 : 5)
            .tickFormat(d => formatTime(d as number, timeFormat));

        // Center Line
        g.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(0))
            .attr("y2", yScale(0))
            .attr("stroke", "#cbd5e1") // slate-300
            .attr("stroke-width", 1)
            .attr("opacity", 0.5);

        // Wave Area Generator
        const area = d3.area<{ min: number, max: number }>()
            .x((d, i) => xScale((i / (waveformData.length - 1)) * duration))
            .y0(d => yScale(d.min))
            .y1(d => yScale(d.max))
            .curve(d3.curveLinear); // Linear is better for raw waves

        // Draw Wave
        g.append("path")
            .datum(waveformData)
            .attr("fill", "url(#raw-wave-gradient)")
            .attr("d", area);

        // Draw X Axis
        g.append("g")
            .attr("class", "d3-axis font-mono text-xs text-slate-500 dark:text-slate-400")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .select(".domain").remove();

    }, [result, timeFormat]);

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-blue-100 dark:border-slate-700 p-4 mb-8 transition-colors" ref={wrapperRef}>
             <svg ref={svgRef} className="w-full h-auto overflow-visible" aria-label="Visualización de la forma de onda detallada"></svg>
        </div>
    );
};

export default WaveformChart;
