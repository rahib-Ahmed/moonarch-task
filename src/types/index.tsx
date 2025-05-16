export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap';

export interface ChartConfig {
	id: string;
	type: ChartType;
	title: string;
	dataKey: string;
}
