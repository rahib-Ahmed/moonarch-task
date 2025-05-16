import React, { useState, useCallback, useMemo } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import FilterDropdown from '../Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';

// Types for the chart data
type DataPoint = {
	name: string;
	value: number;
	[key: string]: any;
};

// Props interface for TinyBarChart
interface TinyBarChartProps {
	data: DataPoint[];
	dataKey?: string;
	xAxisKey?: string;
	barColor?: string;
	barColors?: string[];
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
	aspectRatio?: number;
	className?: string;
}

// Custom tooltip component for the chart
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
				<p className="font-semibold">{`${label}`}</p>
				<p className="text-blue-600">{`${payload[0].value}`}</p>
			</div>
		);
	}
	return null;
};

// Main TinyBarChart component
const TinyBarChart: React.FC<TinyBarChartProps> = React.memo(
	({
		data,
		dataKey = 'value',
		xAxisKey = 'name',
		barColor = '#6366F1', // Default Indigo color
		barColors,
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
		aspectRatio = 2, // Default aspect ratio (width/height)
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

		return (
			<div className={`w-full ${className}`}>
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
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 10,
								left: 10,
								bottom: 5,
							}}
							barSize={32}
							barGap={8}
						>
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
							<Bar
								dataKey={dataKey}
								radius={[4, 4, 0, 0]} // Slightly rounded corners
							>
								{/* Conditional rendering based on whether multiple colors are provided */}
								{barColors ? (
									data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												barColors[
													index % barColors.length
												]
											}
										/>
									))
								) : (
									<Cell fill={barColor} />
								)}
							</Bar>
						</BarChart>
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

export default TinyBarChart;
