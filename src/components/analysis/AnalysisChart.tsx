
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatTime } from '../../utils/helpers';

const AnalysisChart = ({ result, timeFormat }) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!result || !result.energyData || !svgRef.current || !wrapperRef.current) return;

        const { duration, energyData, goldenPoints, peaks } = result;
        
        // Dimensions
        const margin = { top: 40, right: 40, bottom: 50, left: 50 };
        const width = wrapperRef.current.clientWidth - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

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

        const yScale = d3.scaleLinear()
            .domain([0, 1]) // Energy is normalized 0-1
            .range([height, 0]);

        // Gradients definition
        const defs = svg.append("defs");
        
        // Blue gradient for the wave
        const gradient = defs.append("linearGradient")
            .attr("id", "waveform-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#3b82f6") // blue-500
            .attr("stop-opacity", 0.8);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#3b82f6")
            .attr("stop-opacity", 0.1);

        // Axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(width > 600 ? 10 : 5)
            .tickFormat(d => formatTime(d as number, timeFormat));

        const yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(-width) // Grid lines
            .tickPadding(10);

        // Draw Grid
        g.append("g")
            .attr("class", "d3-axis d3-grid opacity-20")
            .call(yAxis)
            .selectAll("line")
            .attr("stroke", "currentColor");

        g.selectAll(".domain").remove(); // Remove Y axis line

        // Draw X Axis
        g.append("g")
            .attr("class", "d3-axis font-mono text-xs text-slate-500 dark:text-slate-400")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .select(".domain")
            .attr("stroke", "#cbd5e1"); // slate-300

        // Area Generator (The Waveform)
        const area = d3.area<number>()
            .x((d, i) => xScale((i / (energyData.length - 1)) * duration))
            .y0(height)
            .y1(d => yScale(d))
            .curve(d3.curveMonotoneX); // Smooth curve

        // Draw Area
        g.append("path")
            .datum(energyData)
            .attr("fill", "url(#waveform-gradient)")
            .attr("stroke", "#2563eb") // blue-600
            .attr("stroke-width", 2)
            .attr("d", area)
            .attr("filter", "drop-shadow(0px 4px 6px rgba(37, 99, 235, 0.2))");

        // Golden Points Lines
        goldenPoints.forEach((point, i) => {
            const xPos = xScale(point);
            
            const group = g.append("g").attr("class", "golden-group");

            // Line
            group.append("line")
                .attr("x1", xPos)
                .attr("x2", xPos)
                .attr("y1", -10)
                .attr("y2", height)
                .attr("stroke", "#d97706") // amber-600
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5");

            // Label Background
            group.append("rect")
                .attr("x", xPos - 30)
                .attr("y", -35)
                .attr("width", 60)
                .attr("height", 25)
                .attr("rx", 4)
                .attr("fill", "#fff7ed") // orange-50
                .attr("stroke", "#d97706")
                .attr("stroke-width", 1);

            // Label Text
            group.append("text")
                .attr("x", xPos)
                .attr("y", -18)
                .attr("text-anchor", "middle")
                .attr("fill", "#d97706")
                .attr("font-weight", "bold")
                .attr("font-size", "12px")
                .attr("font-family", "sans-serif")
                .text(`φ ${formatTime(point, timeFormat)}`);
        });

        // Peaks
        peaks.forEach((peak) => {
            const cx = xScale(peak.time);
            const cy = yScale(peak.energy);

            const group = g.append("g").attr("class", "peak-group");

            // Pulse effect circle
            group.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", 8)
                .attr("fill", "#ef4444") // red-500
                .attr("opacity", 0.3);

            // Main dot
            group.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", 4)
                .attr("fill", "#ef4444") // red-500
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
        });


    }, [result, timeFormat]);

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-blue-100 dark:border-slate-700 p-4 mb-8 transition-colors" ref={wrapperRef}>
             <svg ref={svgRef} className="w-full h-auto overflow-visible" aria-label="Visualización de la energía del audio con D3"></svg>
        </div>
    );
};

export default AnalysisChart;
