import React, { useState, useCallback, useMemo } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Dot,
	ReferenceLine,
} from 'recharts';
import FilterDropdown from '../Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';

// Types for the chart data
type DataPoint = {
	name: string;
	value: number;
	[key: string]: any; // For additional properties
};

// Types for customization options
type LineType =
	| 'monotone'
	| 'linear'
	| 'step'
	| 'stepAfter'
	| 'stepBefore'
	| 'natural';
type DotType = 'dot' | 'none' | 'custom';

// Props interface for TinyLineChart
interface TinyLineChartProps {
	data: DataPoint[];
	dataKey?: string;
	xAxisKey?: string;
	lineColor?: string;
	lineColors?: string[];
	lineType?: LineType;
	height?: number | string;
	title?: string;
	subtitle?: string;
	filters?: React.ReactNode[];
	yearsRange?: number;
	initialYear?: string;
	onYearChange?: (year: string) => void;
	onFilterChange?: (filterName: string, value: string | string[]) => void;
	showGridLines?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	dotType?: DotType;
	strokeWidth?: number;
	animate?: boolean;
	multipleLines?: { dataKey: string; color: string; name: string }[];
	aspectRatio?: number;
	enableGradient?: boolean;
	showReferenceLine?: boolean;
	referenceLineValue?: number;
	referenceLineLabel?: string;
	className?: string;
}

// Custom dot component
const CustomDot: React.FC<any> = ({ cx, cy, stroke, fill, value }) => {
	return (
		<Dot
			cx={cx}
			cy={cy}
			r={4}
			stroke={stroke}
			strokeWidth={1}
			fill={fill || '#FFF'}
		/>
	);
};

// Main TinyLineChart component
const TinyLineChart: React.FC<TinyLineChartProps> = React.memo(
	({
		data,
		dataKey = 'value',
		xAxisKey = 'name',
		lineColor = '#6366F1', // Default Indigo color
		lineColors,
		lineType = 'monotone',
		height = '100%',
		title,
		subtitle,
		filters = [],
		yearsRange = 10,
		initialYear,
		onYearChange,
		onFilterChange,
		showGridLines = true,
		showLegend = false,
		showTooltip = true,
		dotType = 'none',
		strokeWidth = 2,
		animate = true,
		multipleLines,
		aspectRatio = 3, // Default aspect ratio for line charts (typically wider than bar charts)
		enableGradient = false,
		showReferenceLine = false,
		referenceLineValue,
		referenceLineLabel,
		className = '',
	}) => {
		// Get the current year
		const currentYear = useMemo(() => new Date().getFullYear(), []);

		// State for selected year
		const [selectedYear, setSelectedYear] = useState<string>(
			initialYear || currentYear.toString()
		);

		// Handler for year filter changes
		const handleYearChange = useCallback(
			(year: string) => {
				setSelectedYear(year);
				if (onYearChange) {
					onYearChange(year);
				}
			},
			[onYearChange]
		);

		// Determine chart height based on viewport
		const chartHeight = useMemo(() => {
			if (typeof height === 'number') {
				return height;
			}
			// Default heights for different screen sizes
			return 'h-100';
		}, [height]);

		// Create gradient if enabled
		const renderGradient = useMemo(() => {
			if (!enableGradient) return null;

			return (
				<defs>
					<linearGradient
						id="colorGradient"
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop
							offset="5%"
							stopColor={lineColor}
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor={lineColor}
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
			);
		}, [enableGradient, lineColor]);

		// Custom tooltip component
		const CustomTooltip = useCallback(({ active, payload, label }: any) => {
			if (active && payload && payload.length) {
				return (
					<div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
						<p className="font-semibold">{label}</p>
						{payload.map((entry: any, index: number) => (
							<p
								key={`tooltip-${index}`}
								className="text-sm"
								style={{ color: entry.color }}
							>
								{`${entry.name}: ${entry.value}`}
							</p>
						))}
					</div>
				);
			}
			return null;
		}, []);

		// Get dot type component
		const getDotConfig = useCallback(() => {
			switch (dotType) {
				case 'dot':
					return true;
				case 'custom':
					return <CustomDot />;
				case 'none':
				default:
					return false;
			}
		}, [dotType]);

		// Render either single line or multiple lines
		const renderLines = useMemo(() => {
			if (multipleLines && multipleLines.length > 0) {
				return multipleLines.map((line, index) => (
					<Line
						key={`line-${index}`}
						type={lineType}
						dataKey={line.dataKey}
						stroke={line.color}
						strokeWidth={strokeWidth}
						name={line.name}
						dot={getDotConfig()}
						activeDot={{ r: 6 }}
						isAnimationActive={animate}
					/>
				));
			}

			return (
				<Line
					type={lineType}
					dataKey={dataKey}
					stroke={enableGradient ? 'url(#colorGradient)' : lineColor}
					strokeWidth={strokeWidth}
					dot={getDotConfig()}
					activeDot={{ r: 6 }}
					isAnimationActive={animate}
				/>
			);
		}, [
			multipleLines,
			lineType,
			dataKey,
			lineColor,
			strokeWidth,
			getDotConfig,
			animate,
			enableGradient,
		]);

		return (
			<div className={`w-full max-h-full ${className}`}>
				{/* Chart header with title and filters */}
				<div className="mb-4 space-y-4">
					{/* Title and subtitle */}
					{(title || subtitle) && (
						<div className="text-left">
							{title && (
								<h3 className="text-lg sm:text-xl font-bold text-gray-800">
									{title}
								</h3>
							)}
							{subtitle && (
								<p className="text-sm text-gray-500">
									{subtitle}
								</p>
							)}
						</div>
					)}

					{/* Filters container - using flex-wrap for responsiveness */}
					<div className="flex flex-wrap gap-2 sm:gap-4">
						{/* Year filter - always included */}
						{onYearChange && (
							<FilterDropdown
								options={YEAR_FILTER}
								selectedYear={selectedYear}
								onChange={handleYearChange}
							/>
						)}

						{/* Additional filters passed as props */}
						{filters.map((filter, index) => (
							<div
								key={`filter-${index}`}
								className="flex-grow sm:flex-grow-0"
							>
								{filter}
							</div>
						))}
					</div>
				</div>

				{/* The chart container with responsive design */}
				<div
					className={`w-full ${typeof height === 'string' ? chartHeight : `h-[${height}px]`}`}
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={data}
							margin={{
								top: 5,
								right: 10,
								left: 10,
								bottom: 5,
							}}
						>
							{renderGradient}

							{showGridLines && (
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#E5E7EB" // Light gray from Tailwind
								/>
							)}

							<XAxis
								dataKey={xAxisKey}
								tick={{ fontSize: 12 }}
								tickLine={false}
								axisLine={{ stroke: '#E5E7EB' }}
								interval="preserveStartEnd"
							/>

							<YAxis
								tick={{ fontSize: 12 }}
								tickLine={false}
								axisLine={{ stroke: '#E5E7EB' }}
								tickFormatter={(value) =>
									value.toLocaleString()
								}
							/>

							{showTooltip && (
								<Tooltip content={<CustomTooltip />} />
							)}
							{showLegend && (
								<Legend wrapperStyle={{ fontSize: '12px' }} />
							)}

							{/* Reference line if enabled */}
							{showReferenceLine &&
								referenceLineValue !== undefined && (
									<ReferenceLine
										y={referenceLineValue}
										label={referenceLineLabel}
										stroke="#F87171" // Light red
										strokeDasharray="3 3"
									/>
								)}

							{renderLines}
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Empty state message if no data */}
				{(!data || data.length === 0) && (
					<div className="absolute inset-0 flex items-center justify-center">
						<p className="text-gray-500">No data available</p>
					</div>
				)}
			</div>
		);
	}
);

export default TinyLineChart;
