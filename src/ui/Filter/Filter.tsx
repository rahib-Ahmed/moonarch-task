/* eslint-disable indent */
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import { ChevronDown, ChevronUp, Check, X, Filter } from 'lucide-react';

// Type definitions
type Option = {
	value: string;
	label: string;
};

interface FilterDropdownProps {
	label: string;
	options: Option[];
	selectedValue: string | string[];
	onChange: (value: string | string[]) => void;
	multiple?: boolean;
	searchable?: boolean;
	className?: string;
	isLoading?: boolean;
	disabled?: boolean;
}

// filter dropdown component
const FilterDropdown: React.FC<FilterDropdownProps> = React.memo(
	({
		label,
		options,
		selectedValue,
		onChange,
		multiple = false,
		searchable = false,
		className = '',
		isLoading = false,
		disabled = false,
	}) => {
		const [isOpen, setIsOpen] = useState<boolean>(false);
		const [search, setSearch] = useState<string>('');
		const dropdownRef = useRef<HTMLDivElement>(null);
		const [selected, setSelected] = useState<string | string[]>(
			multiple
				? Array.isArray(selectedValue)
					? selectedValue
					: []
				: selectedValue || ''
		);

		// Handle outside click to close dropdown
		useEffect(() => {
			const handleOutsideClick = (event: MouseEvent): void => {
				if (
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);
			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}, []);

		// Update selected when prop changes
		useEffect(() => {
			if (multiple) {
				if (Array.isArray(selectedValue)) {
					setSelected(selectedValue);
				}
			} else {
				setSelected(selectedValue || '');
			}
		}, [selectedValue, multiple]);

		// Reset search when dropdown closes
		useEffect(() => {
			if (!isOpen) {
				setSearch('');
			}
		}, [isOpen]);

		// Filter options based on search term - memoized to avoid recalculation
		const filteredOptions = useMemo(
			() =>
				options.filter((option) =>
					option.label.toLowerCase().includes(search.toLowerCase())
				),
			[options, search]
		);

		// Handle selection change with useCallback to avoid recreation
		const handleSelect = useCallback(
			(value: string): void => {
				if (multiple) {
					const selectedArray = Array.isArray(selected)
						? selected
						: [];
					const newSelected = selectedArray.includes(value)
						? selectedArray.filter((item) => item !== value)
						: [...selectedArray, value];

					setSelected(newSelected);
					onChange(newSelected);
				} else {
					setSelected(value);
					onChange(value);
					setIsOpen(false);
				}
			},
			[multiple, selected, onChange]
		);

		// Clear all selections for multiple select
		const handleClearAll = useCallback((): void => {
			const emptyValue = multiple ? [] : '';
			setSelected(emptyValue);
			onChange(emptyValue);
		}, [multiple, onChange]);

		// Toggle dropdown
		const toggleDropdown = useCallback((): void => {
			if (!disabled) {
				setIsOpen((prev) => !prev);
			}
		}, [disabled]);

		// Handle search input changes
		const handleSearchChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>): void => {
				setSearch(e.target.value);
			},
			[]
		);

		// Get display text for selected value(s) - memoized to avoid recalculation
		const displayValue = useMemo(() => {
			if (multiple && Array.isArray(selected)) {
				if (selected.length === 0) return label;
				if (selected.length === 1) {
					const option = options.find(
						(opt) => opt.value === selected[0]
					);
					return option ? option.label : label;
				}
				return `${selected.length} selected`;
			} else {
				const option = options.find((opt) => opt.value === selected);
				return option ? option.label : label;
			}
		}, [multiple, selected, options, label]);

		// Keyboard navigation
		const handleKeyDown = useCallback(
			(
				e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
			): void => {
				if (e.key === 'Escape') {
					setIsOpen(false);
				} else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					// Implementation for keyboard navigation would go here
				}
			},
			[]
		);

		return (
			<div className="relative" ref={dropdownRef}>
				{/* Button to toggle dropdown */}
				<button
					type="button"
					className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} 
          ${className}`}
					onClick={toggleDropdown}
					onKeyDown={handleKeyDown}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					disabled={disabled}
				>
					<div className="flex items-center">
						<Filter className="w-4 h-4 mr-2 text-gray-500" />
						<span className="truncate">{displayValue}</span>
					</div>
					{isOpen ? (
						<ChevronUp className="w-4 h-4 ml-2 text-gray-500" />
					) : (
						<ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
					)}
				</button>

				{/* Dropdown menu */}
				{isOpen && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
						{/* Search input for searchable dropdown */}
						{searchable && (
							<div className="sticky top-0 p-2 bg-white border-b border-gray-200">
								<input
									type="text"
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Search..."
									value={search}
									onChange={handleSearchChange}
									onKeyDown={handleKeyDown}
									autoFocus
								/>
							</div>
						)}

						{/* Loading state */}
						{isLoading && (
							<div className="px-4 py-2 text-sm text-gray-500">
								Loading...
							</div>
						)}

						{/* No results message */}
						{!isLoading && filteredOptions.length === 0 && (
							<div className="px-4 py-2 text-sm text-gray-500">
								No results found
							</div>
						)}

						{/* Option list */}
						<ul
							className="py-1"
							role="listbox"
							aria-labelledby="dropdown-button"
						>
							{filteredOptions.map((option) => {
								const isItemSelected =
									multiple && Array.isArray(selected)
										? selected.includes(option.value)
										: selected === option.value;

								return (
									<li
										key={option.value}
										onClick={() =>
											handleSelect(option.value)
										}
										className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${isItemSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900 hover:bg-gray-100'}`}
										role="option"
										aria-selected={isItemSelected}
									>
										<span>{option.label}</span>
										{isItemSelected && (
											<Check className="w-4 h-4 text-blue-600" />
										)}
									</li>
								);
							})}
						</ul>

						{/* Footer for multiple select */}
						{multiple &&
							Array.isArray(selected) &&
							selected.length > 0 && (
								<div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200">
									<span className="text-xs text-gray-500">
										{selected.length} selected
									</span>
									<button
										type="button"
										className="text-xs text-red-600 hover:text-red-800 flex items-center"
										onClick={handleClearAll}
									>
										<X className="w-3 h-3 mr-1" />
										Clear all
									</button>
								</div>
							)}
					</div>
				)}
			</div>
		);
	}
);

export default FilterDropdown;
