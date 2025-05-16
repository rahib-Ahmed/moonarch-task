import { X } from 'lucide-react';

interface RemoveVizProps {
	removeItem: () => void;
}

const RemoveViz = ({ removeItem }: RemoveVizProps) => {
	const handleItemRemove = () => {
		removeItem();
	};

	return (
		<button
			onClick={handleItemRemove}
			className="flex flex-row rounded-xl cursor-pointer bg-gray-50 text-red-500 py-1.5 px-4 border-1 align-middle gap-2"
		>
			<X />
			Remove Viz
		</button>
	);
};

export default RemoveViz;
