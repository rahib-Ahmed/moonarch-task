import { useEffect, useMemo, useState } from 'react';
import FilterDropdown from '../../ui/Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';
import { useGetPopulationQuery } from './../../store/api/statsData';
import PieChartWithCustomizedLabel from '../../ui/Charts/PieChartWithCustomizedLabel';
import RemoveViz from '../general/RemoveViz';
import { usePopulationData } from '../../hooks/usePopulationData';

const PopulationDistribution = ({ data, id, removeViz, selectedYear }) => {
	const handleRemove = () => {
		removeViz(id);
	};

	return (
		<PieChartWithCustomizedLabel
			data={data}
			title="Population Distribution"
			subtitle="Demonstrating step line pattern"
			showLabels={true}
			labelPosition="outside"
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

export default PopulationDistribution;
