import { useEffect, useMemo, useState } from 'react';
import { useGetPopulationQuery } from './../store/api/statsData';

type PopulationDataItem = {
	id: string | number;
	year: string;
	population: number;
};

type PopulationHookResult = {
	data:
		| {
				id: string | number;
				name: string;
				value: number;
		  }[]
		| undefined;
	isLoading: boolean;
	selectedYear: string;
	setSelectedYear: (year: string) => void;
};

/**
 * Custom hook for handling population data fetching and processing
 * @param globalYear - The year selected in the global state
 * @param globalState - The geographic state selected in the global state
 * @returns Object with data, loading state, and year selection handlers
 */
export const usePopulationData = (
	globalYear: string,
	globalState: string
): PopulationHookResult => {
	const [selectedYear, setSelectedYear] = useState<string>(globalYear);
	const [populationRetrieved, setPopulationRetrieved] = useState<
		PopulationDataItem[] | null
	>([]);
	console.log(globalYear, globalState, 'State');
	// Configure query parameters based on current selections
	const queryParams = {
		drilldowns: globalState === 'Nation' ? 'Nation' : 'State',
		geography: globalState,
		year: selectedYear,
	};

	// Fetch population data using RTK Query
	const { data: populationData, isLoading } =
		useGetPopulationQuery(queryParams);

	// Update local state when global state or data changes
	useEffect(() => {
		if (globalYear) {
			setSelectedYear(globalYear);
		}
		if (!isLoading) {
			setPopulationRetrieved(populationData);
		}
	}, [globalYear, isLoading, populationData]);

	// Transform raw data into the format needed by charts
	const data = useMemo(
		() =>
			populationRetrieved?.map((data) => ({
				id: data.id,
				name: data.year,
				value: data.population,
			})),
		[populationRetrieved]
	);

	return {
		data,
		isLoading,
		selectedYear,
		setSelectedYear,
	};
};
