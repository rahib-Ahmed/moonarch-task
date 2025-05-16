import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { useGetLocationsQuery } from './../../store/api/statsData';

import {
	selectSelectedState,
	selectSelectedYear,
	setSelectedState,
	setSelectedYear,
} from './../../store/slices/filterSlice';

import { YEAR_FILTER } from '../../utils/common';

import FilterDropdown from '../../ui/Filter/Filter';
import { DashboardContext } from '../../context/DashboardContext';
import ChartRenderer from '../../components/DataViz/ChartRenderer';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import TableContent from '../../components/DataViz/TableContent';
import { usePopulationData } from '../../hooks/usePopulationData';

const Dashboard = () => {
	// Fetching all country states
	const {
		data: allStates,
		isLoading: gettingStates,
		refetch: refetchData,
	} = useGetLocationsQuery();

	const { charts, addChart, removeChart } = useContext(DashboardContext);

	const dispatch = useDispatch();

	const globalSelectedState = useSelector(selectSelectedState);
	const globalSelectedYear = useSelector(selectSelectedYear);

	const filterParams = useMemo(
		() => ({
			state: globalSelectedState,
			year: globalSelectedYear,
		}),
		[globalSelectedState, globalSelectedYear]
	);

	const {
		data: populationData,
		isLoading: gettingPopulation,
		selectedYear,
		setSelectedYear: setSelectedLocalYear,
	} = usePopulationData(filterParams.year, filterParams.state);

	// memoize the dispatch for state filter
	const handleStateChange = useCallback((value: string) => {
		dispatch(setSelectedState(value));
	}, []);

	// memoize the dispatch for year filter
	const handleYearChange = useCallback((value: string) => {
		dispatch(setSelectedYear(value));
	}, []);

	// add random chart
	const handleAddChart = () => {
		const chartTypes = ['bar', 'line', 'pie', 'heatmap'];
		const randomType =
			chartTypes[Math.floor(Math.random() * chartTypes.length)];
		const title = `Chart ${randomType}`;
		addChart(randomType, title, 'population');
	};

	// force refresh data
	const handleAddRefresh = () => {
		// handle refresh
		refetchData();
	};

	if (gettingStates || gettingPopulation) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="loader">Loading...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-4 text-black">
					Dashboard
				</h2>

				{/* Global filters */}
				<div className="flex flex-row justify-between items-center mb-4 flex-wrap gap-2">
					<FilterDropdown
						label="Select state"
						options={allStates}
						isLoading={gettingStates}
						onChange={handleStateChange}
						selectedValue={filterParams.state}
					/>
					<FilterDropdown
						label="Select year"
						options={YEAR_FILTER}
						isLoading={gettingStates}
						onChange={handleYearChange}
						selectedValue={filterParams.year}
					/>
					<button
						onClick={handleAddChart}
						className="flex bg-black py-2 px-4 w-full rounded-xl align-middle justify-between flex-row gap-1 sm:w-fit cursor-pointer"
					>
						<PlusCircle />
						<p className="flex-1 text-center">Add random viz</p>
					</button>
					<button
						onClick={handleAddRefresh}
						className="flex bg-black py-2 px-4 w-full rounded-xl align-middle justify-between flex-row gap-1 sm:w-fit cursor-pointer"
					>
						<RefreshCcw />
						<p className="flex-1 text-center">Refresh</p>
					</button>
				</div>

				{/* Charts container */}
				{Array.isArray(charts) && charts.length <= 0 ? (
					<div>
						<p className="text-black">No data found</p>
					</div>
				) : (
					<div className="flex flex-wrap gap-4 w-full">
						{charts.map((chartData, index) => (
							<div
								key={index}
								className="w-full sm:w-[calc(50%-0.5rem)]"
							>
								<ChartRenderer
									config={chartData}
									onRemove={removeChart}
									data={populationData}
									selectedYear={selectedYear}
								/>
							</div>
						))}
					</div>
				)}

				{/* Table container */}
				<div className="w-full mt-9">
					<TableContent filteredData={populationData} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
