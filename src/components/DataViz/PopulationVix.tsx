import { useEffect, useMemo, useState } from 'react';
import TinyBarChart from '../../ui/Charts/TinyBarChart';
import FilterDropdown from '../../ui/Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';
import { useGetPopulationQuery } from './../../store/api/statsData';
import RemoveViz from '../general/RemoveViz';
import { usePopulationData } from '../../hooks/usePopulationData';

const PopulationViz = ({ id, removeViz, selectedYear, data }) => {
	const handleRemove = () => {
		removeViz(id);
	};

	return (
		<TinyBarChart
			data={data}
			title="Population"
			showGridLines
			subtitle="Population through out the year"
			filters={[
				<FilterDropdown
					label="Select year"
					options={YEAR_FILTER}
					onChange={(value) => console.log(value)}
					selectedValue={selectedYear}
				/>,
				<RemoveViz removeItem={handleRemove} />,
			]}
		/>
	);
};

export default PopulationViz;
