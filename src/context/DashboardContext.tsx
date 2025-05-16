import type { ChartConfig, ChartType } from '../types';
import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from 'react';

interface DashboardContextType {
	charts: ChartConfig[];
	addChart: (type: ChartType, title: string, dataKey: string) => void;
	removeChart: (id: string) => void;
}

const initialChart: ChartConfig[] = [
	{
		id: '1',
		type: 'line',
		title: 'Population over time',
		dataKey: 'Population',
	},
	{
		id: '2',
		type: 'bar',
		title: 'Population by year',
		dataKey: 'Population',
	},
	{
		id: '3',
		type: 'pie',
		title: 'Population distribution',
		dataKey: 'Population',
	},
	{
		id: '4',
		type: 'heatmap',
		title: 'Population heatmap',
		dataKey: 'Population',
	},
];

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const [charts, setCharts] = useState<ChartConfig[]>(initialChart);

	const addChart = useCallback(
		(type: ChartType, title: string, dataKey: string) => {
			const newChart: ChartConfig = {
				id: String(Math.floor(Math.random() * 400)),
				type,
				title,
				dataKey,
			};
			setCharts((prevCharts) => [...prevCharts, newChart]);
		},
		[]
	);

	// remove chart by id
	const removeChart = useCallback((id: string) => {
		setCharts((prevCharts) =>
			prevCharts.filter((chart) => chart.id !== id)
		);
	}, []);
	return (
		<DashboardContext.Provider value={{ charts, addChart, removeChart }}>
			{children}
		</DashboardContext.Provider>
	);
};

// create context
export const DashboardContext = createContext<DashboardContextType>({
	charts: [],
	addChart: () => {},
	removeChart: () => {},
});
