import FilterDropdown from '../../ui/Filter/Filter';
import { YEAR_FILTER } from '../../utils/common';
import TinyLineChart from '../../ui/Charts/TinyLineChart';
import RemoveViz from '../general/RemoveViz';
import { usePopulationData } from '../../hooks/usePopulationData';

const PopulationOverTime = ({ data, id, removeViz, selectedYear }) => {
	const handleRemove = () => {
		removeViz(id);
	};

	return (
		<TinyLineChart
			data={data}
			title="Population Over Time"
			subtitle="Demonstrating step line pattern"
			referenceLineLabel="Target"
			lineType="monotone"
			lineColor="#6366F1"
			showReferenceLine={true}
			dotType="dot"
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

export default PopulationOverTime;
