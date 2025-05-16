import { useMemo } from 'react';
import DataTable from '../../ui/Table/DataTable';

const TableContent = ({ filteredData }) => {
	console.log(filteredData, 'from tabale');

	const manipulatedData = useMemo(
		() =>
			filteredData.map((data, index) => ({
				id: index,
				label: data.id,
				year: data.name,
				value: data.value,
			})),
		[filteredData]
	);

	const columns = [
		{ header: 'Label', accessor: 'label', sortable: true },
		{ header: 'Year', accessor: 'year', sortable: true },
		{ header: 'Value', accessor: 'value', sortable: true },
	];

	return (
		<DataTable
			data={manipulatedData}
			columns={columns}
			title="Data Table"
			onSearch={(query) => console.log('Search query:', query)}
			onDownload={() => console.log('download')}
		/>
	);
};

export default TableContent;
