import React, { useState, useCallback, useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import FilterDropdown from '../Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';

// Types for the chart data
type TreemapDataPoint = {
	name: string;
	value?: number;
	children?: TreemapDataPoint[];
	[key: string]: any; // For additional properties
};

// Props interface for SimpleTreemap
interface SimpleTreemapProps {
	data: TreemapDataPoint[];
	valueKey?: string;
	nameKey?: string;
	colors?: string[];
	height?: number | string;
	title?: string;
	subtitle?: string;
	filters?: React.ReactNode[];
	yearsRange?: number;
	initialYear?: string;
	onYearChange?: (year: string) => void;
	onFilterChange?: (filterName: string, value: string | string[]) => void;
	aspectRatio?: number;
	showTooltip?: boolean;
	animate?: boolean;
	colorOption?: 'depth' | 'category' | 'value';
	strokeWidth?: number;
	stroke?: string;
	dataMaxDepth?: number;
	nestingBy?: string;
	className?: string;
	showValues?: boolean;
}

// Custom content component for treemap cells
const CustomizedContent = (props: any) => {
	const {
		x,
		y,
		width,
		height,
		depth,
		name,
		value,
		colors,
		backgroundColor,
		colorOption,
		showValues,
	} = props;

	// Determine color based on the colorOption prop
	const getColor = () => {
		if (colorOption === 'depth') {
			return colors[depth % colors.length];
		} else if (colorOption === 'value') {
			const maxValue = Math.max(
				...props.root.children.map((child: any) => child.value)
			);
			const ratio = value / maxValue;
			const colorIndex = Math.floor(ratio * (colors.length - 1));
			return colors[colorIndex];
		}
		// Default to category (use common color for items with same name)
		const nameHash = name
			.split('')
			.reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
		return colors[nameHash % colors.length];
	};

	// Determine if this is a small cell (for font sizing)
	const isSmallCell = width < 50 || height < 50;
	const isVerySmallCell = width < 30 || height < 30;

	// No labels for very small cells
	if (isVerySmallCell) {
		return (
			<g>
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					fill={backgroundColor || getColor()}
					stroke="#fff"
					strokeWidth={1}
				/>
			</g>
		);
	}

	return (
		<g>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={backgroundColor || getColor()}
				stroke="#fff"
				strokeWidth={1}
			/>
			{/* Cell name */}
			<text
				x={x + width / 2}
				y={y + height / 2 - (showValues ? 8 : 0)}
				textAnchor="middle"
				dominantBaseline="middle"
				fill="#fff"
				fontSize={isSmallCell ? 10 : 12}
				fontWeight="bold"
			>
				{name}
			</text>
			{/* Cell value - Only show if enough space and showValues is true */}
			{showValues && !isSmallCell && (
				<text
					x={x + width / 2}
					y={y + height / 2 + 10}
					textAnchor="middle"
					dominantBaseline="middle"
					fill="#fff"
					fontSize={10}
				>
					{value}
				</text>
			)}
		</g>
	);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		const { name, value, depth, root } = payload[0].payload;

		// Calculate percentage
		let totalValue = 0;
		if (root && root.children) {
			totalValue = root.children.reduce(
				(sum: number, child: any) => sum + child.value,
				0
			);
		}

		const percentage =
			totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : 0;

		return (
			<div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
				<p className="font-semibold">{name}</p>
				<p className="text-gray-700">Value: {value}</p>
				<p className="text-gray-600">{percentage}% of total</p>
				{depth > 0 && <p className="text-gray-500">Level: {depth}</p>}
			</div>
		);
	}
	return null;
};

// Main SimpleTreemap component
const SimpleTreeMap: React.FC<SimpleTreemapProps> = React.memo(
	({
		data,
		valueKey = 'value',
		nameKey = 'name',
		colors = [
			'#6366F1',
			'#8B5CF6',
			'#EC4899',
			'#F43F5E',
			'#EF4444',
			'#F97316',
			'#F59E0B',
			'#10B981',
			'#14B8A6',
			'#0EA5E9',
		],
		height = '100%',
		title,
		subtitle,
		filters = [],
		yearsRange = 10,
		initialYear,
		onYearChange,
		onFilterChange,
		aspectRatio = 1.6, // Default aspect ratio for treemaps
		showTooltip = true,
		animate = true,
		colorOption = 'depth',
		strokeWidth = 1,
		stroke = '#fff',
		dataMaxDepth = 2,
		nestingBy,
		className = '',
		showValues = true,
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

		// Process data if nestingBy is provided
		const processedData = useMemo(() => {
			if (!nestingBy || nestingBy === '') return data;

			// Group data by the nestingBy property
			const groupedData: { [key: string]: TreemapDataPoint[] } = {};
			data.forEach((item) => {
				const key = item[nestingBy] || 'Other';
				if (!groupedData[key]) {
					groupedData[key] = [];
				}
				groupedData[key].push(item);
			});

			// Convert grouped data to treemap format
			return Object.keys(groupedData).map((key) => ({
				name: key,
				children: groupedData[key],
			}));
		}, [data, nestingBy]);

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
						<Treemap
							data={processedData}
							dataKey={valueKey}
							nameKey={nameKey}
							stroke={stroke}
							strokeWidth={strokeWidth}
							isAnimationActive={animate}
							maxDepth={dataMaxDepth}
							content={
								<CustomizedContent
									colors={colors}
									colorOption={colorOption}
									showValues={showValues}
								/>
							}
						>
							{showTooltip && (
								<Tooltip content={<CustomTooltip />} />
							)}
						</Treemap>
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

export default SimpleTreeMap;
