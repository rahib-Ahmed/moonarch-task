import React, { useState, useCallback, useMemo } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Sector,
} from 'recharts';
import FilterDropdown from '../Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';

// Types for the chart data
type DataPoint = {
	name: string;
	value: number;
	[key: string]: any; // For additional properties
};

// Props interface for PieChartWithCustomizedLabel
interface PieChartWithCustomizedLabelProps {
	data: DataPoint[];
	dataKey?: string;
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
	outerRadius?: number | string;
	innerRadius?: number | string;
	paddingAngle?: number;
	showLegend?: boolean;
	showTooltip?: boolean;
	animate?: boolean;
	activeIndex?: number;
	enableActiveShape?: boolean;
	showLabels?: boolean;
	labelPosition?: 'inside' | 'outside';
	showPercentage?: boolean;
	className?: string;
}

// Custom active shape for hover effect
const renderActiveShape = (props: any) => {
	const {
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value,
	} = props;

	return (
		<g>
			<text
				x={cx}
				y={cy - 10}
				dy={8}
				textAnchor="middle"
				fill={fill}
				fontSize={16}
				fontWeight="bold"
			>
				{payload.name}
			</text>
			<text
				x={cx}
				y={cy + 15}
				dy={8}
				textAnchor="middle"
				fill="#999"
				fontSize={14}
			>
				{`${value} (${(percent * 100).toFixed(2)}%)`}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius + 10}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 12}
				outerRadius={outerRadius + 16}
				fill={fill}
			/>
		</g>
	);
};

// Custom label renderer
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
	name,
	value,
	fill,
}: any) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	const percentValue = `${(percent * 100).toFixed(0)}%`;

	return (
		<g>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill="#333"
				fontSize={12}
			>
				{name} ({percentValue})
			</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill="#999"
				fontSize={10}
			>
				{value}
			</text>
		</g>
	);
};

// Outside label renderer
const renderOutsideLabel = (props: any) => {
	const RADIAN = Math.PI / 180;
	const { cx, cy, midAngle, outerRadius, fill, percent, value, name } = props;

	// Calculate position for the line
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + outerRadius * cos;
	const sy = cy + outerRadius * sin;
	const mx = cx + (outerRadius + 15) * cos;
	const my = cy + (outerRadius + 15) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	const percentValue = `${(percent * 100).toFixed(0)}%`;

	return (
		<g>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill="#333"
				fontSize={12}
			>
				{name} ({percentValue})
			</text>
		</g>
	);
};

// Inside label renderer
const renderInsideLabel = (props: any) => {
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		value,
		name,
		fill,
	} = props;
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	const percentValue = `${(percent * 100).toFixed(0)}%`;

	return (
		<text
			x={x}
			y={y}
			fill="#fff"
			textAnchor="middle"
			dominantBaseline="central"
			fontSize={12}
			fontWeight="bold"
		>
			{percentValue}
		</text>
	);
};

// Main PieChartWithCustomizedLabel component
const PieChartWithCustomizedLabel: React.FC<PieChartWithCustomizedLabelProps> =
	React.memo(
		({
			data,
			dataKey = 'value',
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
			outerRadius = '60%',
			innerRadius = 0,
			paddingAngle = 0,
			showLegend = true,
			showTooltip = true,
			animate = true,
			activeIndex,
			enableActiveShape = false,
			showLabels = false,
			labelPosition = 'outside',
			showPercentage = true,
			className = '',
		}) => {
			// Get the current year
			const currentYear = useMemo(() => new Date().getFullYear(), []);

			// State for selected year
			const [selectedYear, setSelectedYear] = useState<string>(
				initialYear || currentYear.toString()
			);

			// State for active index (for hover effect)
			const [activeIdx, setActiveIdx] = useState<number | undefined>(
				activeIndex
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

			// Handler for pie segment hover
			const onPieEnter = useCallback(
				(_: any, index: number) => {
					if (enableActiveShape) {
						setActiveIdx(index);
					}
				},
				[enableActiveShape]
			);

			// Determine chart height based on viewport
			const chartHeight = useMemo(() => {
				if (typeof height === 'number') {
					return height;
				}
				// Default heights for different screen sizes
				return 'h-100';
			}, [height]);

			// Determine label renderer
			const labelRenderer = useMemo(() => {
				if (!showLabels) return null;

				if (labelPosition === 'inside') {
					return renderInsideLabel;
				}
				return renderOutsideLabel;
			}, [showLabels, labelPosition]);

			// Custom tooltip component
			const CustomTooltip = useCallback(({ active, payload }: any) => {
				if (active && payload && payload.length) {
					const data = payload[0];
					return (
						<div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
							<p
								className="font-semibold"
								style={{ color: data.payload.fill }}
							>
								{data.name}
							</p>
							<p className="text-gray-600">
								{data.value} (
								{(data.payload.percent * 100).toFixed(2)}%)
							</p>
						</div>
					);
				}
				return null;
			}, []);

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
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									labelLine={labelPosition === 'outside'}
									label={labelRenderer}
									outerRadius={outerRadius}
									innerRadius={innerRadius}
									paddingAngle={paddingAngle}
									dataKey={dataKey}
									nameKey={nameKey}
									activeIndex={activeIdx}
									activeShape={
										enableActiveShape
											? renderActiveShape
											: undefined
									}
									onMouseEnter={onPieEnter}
									isAnimationActive={animate}
								>
									{data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={colors[index % colors.length]}
										/>
									))}
								</Pie>

								{showTooltip && (
									<Tooltip content={<CustomTooltip />} />
								)}

								{showLegend && (
									<Legend
										layout="horizontal"
										verticalAlign="bottom"
										align="center"
										wrapperStyle={{
											fontSize: '12px',
											marginTop: '10px',
										}}
									/>
								)}
							</PieChart>
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

export default PieChartWithCustomizedLabel;
