/* eslint-disable indent */
import { useSelector } from 'react-redux';
import type { ChartConfig } from '../../types';
import PopulationViz from './PopulationVix';
import {
	selectSelectedState,
	selectSelectedYear,
} from '../../store/slices/filterSlice';
import { useMemo } from 'react';
import PopulationOverTime from './PopulationOverTime';
import PopulationDistribution from './PopulationDistribution';
import PopulationHeatmap from './PopulationHeatmap';
import { usePopulationData } from '../../hooks/usePopulationData';

interface ChartRendererProps {
	config: ChartConfig;
	onRemove?: (id: string) => void;
	data: [];
	selectedYear: string | number;
}

export default function ChartRenderer({
	config,
	onRemove,
	data,
	selectedYear,
}: ChartRendererProps) {
	const { type, id, title, dataKey } = config;

	// Render the appropriate chart based on the type
	switch (type) {
		case 'bar':
			return (
				<PopulationViz
					selectedYear={selectedYear}
					data={data}
					id={id}
					removeViz={onRemove}
				/>
			);
		case 'line':
			return (
				<PopulationOverTime
					selectedYear={selectedYear}
					data={data}
					id={id}
					removeViz={onRemove}
				/>
			);
		case 'pie':
			return (
				<PopulationDistribution
					selectedYear={selectedYear}
					data={data}
					id={id}
					removeViz={onRemove}
				/>
			);
		case 'heatmap':
			return (
				<PopulationHeatmap
					selectedYear={selectedYear}
					data={data}
					id={id}
					removeViz={onRemove}
				/>
			);
		default:
			return null;
	}
}
