import SimpleTreeMap from '../../ui/Charts/SimpleTreeMap';
import RemoveViz from '../general/RemoveViz';
import { usePopulationData } from '../../hooks/usePopulationData';

const PopulationHeatmap = ({ data, selectedYear, id, removeViz }) => {
	const handleRemove = () => {
		removeViz(id);
	};

	return (
		<SimpleTreeMap
			data={data}
			title="Population Heatmap"
			subtitle="Demonstrating step line pattern"
			filters={[<RemoveViz removeItem={handleRemove} />]}
		/>
	);
};

export default PopulationHeatmap;
