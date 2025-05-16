/* eslint-disable indent */
import { lazy, Suspense } from 'react';
import type { ChartConfig } from '../../types';
import { Loader2 } from 'lucide-react';

const PopulationViz = lazy(() => import('./PopulationVix'));
const PopulationOverTime = lazy(() => import('./PopulationOverTime'));
const PopulationDistribution = lazy(() => import('./PopulationDistribution'));
const PopulationHeatmap = lazy(() => import('./PopulationHeatmap'));

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
	const { type, id } = config;

	const ChartLoading = () => (
		<div className="w-full h-64 flex items-center justify-center bg-white rounded-lg shadow">
			<Loader2 className="animate-spin h-8 w-8 text-gray-500" />
			<p className="ml-2 text-gray-500">Loading visualization...</p>
		</div>
	);

	// Render the appropriate chart based on the type
	switch (type) {
		case 'bar':
			return (
				<Suspense fallback={<ChartLoading />}>
					<PopulationViz
						selectedYear={selectedYear}
						data={data}
						id={id}
						removeViz={onRemove}
					/>
				</Suspense>
			);
		case 'line':
			return (
				<Suspense fallback={<ChartLoading />}>
					<PopulationOverTime
						selectedYear={selectedYear}
						data={data}
						id={id}
						removeViz={onRemove}
					/>
				</Suspense>
			);
		case 'pie':
			return (
				<Suspense fallback={<ChartLoading />}>
					<PopulationDistribution
						selectedYear={selectedYear}
						data={data}
						id={id}
						removeViz={onRemove}
					/>
				</Suspense>
			);
		case 'heatmap':
			return (
				<Suspense fallback={<ChartLoading />}>
					<PopulationHeatmap
						selectedYear={selectedYear}
						data={data}
						id={id}
						removeViz={onRemove}
					/>
				</Suspense>
			);
		default:
			return null;
	}
}
