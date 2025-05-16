import React, { useState, useCallback, useMemo } from 'react';
import {
	ChevronDown,
	ChevronUp,
	Search,
	MoreHorizontal,
	Download,
	Filter,
} from 'lucide-react';

// Type definitions
type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDefinition<T> {
	header: string;
	accessor: keyof T | ((data: T) => React.ReactNode);
	width?: string;
	sortable?: boolean;
	filterable?: boolean;
	cell?: (data: T) => React.ReactNode;
}

interface TableAction<T> {
	label: string;
	icon?: React.ReactNode;
	onClick: (data: T) => void;
	showCondition?: (data: T) => boolean;
	buttonClassName?: string;
}

export interface DataTableProps<T> {
	data: T[];
	columns: ColumnDefinition<T>[];
	title?: string;
	subtitle?: string;
	actions?: TableAction<T>[];
	globalButton?: React.ReactNode;
	loading?: boolean;
	pagination?: {
		pageSize: number;
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	};
	onRowClick?: (data: T) => void;
	className?: string;
	emptyStateMessage?: string;
	searchable?: boolean;
	searchPlaceholder?: string;
	onSearch?: (query: string) => void;
	onDownload?: () => void;
	hideHeader?: boolean;
}

// Main DataTable component
function DataTable<T extends Record<string, any>>({
	data,
	columns,
	title,
	subtitle,
	actions,
	globalButton,
	loading = false,
	pagination,
	onRowClick,
	className = '',
	emptyStateMessage = 'No data available',
	searchable = false,
	searchPlaceholder = 'Search...',
	onSearch,
	onDownload,
	hideHeader = false,
}: DataTableProps<T>) {
	// State management
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>(null);
	const [currentPage, setCurrentPage] = useState<number>(
		pagination?.currentPage || 1
	);

	// Handle search input change
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const query = e.target.value;
			setSearchQuery(query);
			if (onSearch) {
				onSearch(query);
			}
		},
		[onSearch]
	);

	// Handle sorting
	const handleSort = useCallback(
		(columnKey: keyof T, sortable?: boolean) => {
			if (!sortable) return;

			let newDirection: SortDirection = 'asc';
			if (sortColumn === columnKey) {
				if (sortDirection === 'asc') {
					newDirection = 'desc';
				} else if (sortDirection === 'desc') {
					newDirection = null;
				}
			}

			setSortColumn(newDirection === null ? null : columnKey);
			setSortDirection(newDirection);
		},
		[sortColumn, sortDirection]
	);

	// Sort and filter data
	const processedData = useMemo(() => {
		let result = [...data];

		// Apply sorting if a column is selected
		if (sortColumn && sortDirection) {
			result.sort((a, b) => {
				const aValue = a[sortColumn];
				const bValue = b[sortColumn];

				if (aValue === bValue) return 0;

				const comparison = aValue < bValue ? -1 : 1;
				return sortDirection === 'asc' ? comparison : -comparison;
			});
		}

		// Apply client-side filtering if no onSearch handler is provided
		if (searchQuery && !onSearch) {
			const lowerQuery = searchQuery.toLowerCase();
			result = result.filter((item) =>
				Object.values(item).some(
					(val) =>
						val && val.toString().toLowerCase().includes(lowerQuery)
				)
			);
		}

		return result;
	}, [data, sortColumn, sortDirection, searchQuery, onSearch]);

	// Handle pagination
	const paginatedData = useMemo(() => {
		if (!pagination) return processedData;

		const { pageSize, currentPage: page } = pagination;
		const startIndex = (page - 1) * pageSize;
		return processedData.slice(startIndex, startIndex + pageSize);
	}, [processedData, pagination]);

	// Generate page numbers for pagination
	const pageNumbers = useMemo(() => {
		if (!pagination) return [];

		const { totalPages } = pagination;
		const currentPageNum = pagination.currentPage;

		let pages = [];

		// Always include first and last page
		// For smaller number of pages, show all
		if (totalPages <= 7) {
			pages = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			// For larger number of pages, show a subset with ellipsis
			pages = [1];

			const leftBound = Math.max(2, currentPageNum - 1);
			const rightBound = Math.min(totalPages - 1, currentPageNum + 1);

			if (leftBound > 2) {
				pages.push(-1); // Represents ellipsis
			}

			for (let i = leftBound; i <= rightBound; i++) {
				pages.push(i);
			}

			if (rightBound < totalPages - 1) {
				pages.push(-1); // Represents ellipsis
			}

			pages.push(totalPages);
		}

		return pages;
	}, [pagination]);

	// Handle page change
	const handlePageChange = useCallback(
		(page: number) => {
			if (pagination) {
				if (pagination.onPageChange) {
					pagination.onPageChange(page);
				} else {
					setCurrentPage(page);
				}
			}
		},
		[pagination]
	);

	// Render sorting indicator
	const renderSortIndicator = (columnKey: keyof T) => {
		if (sortColumn !== columnKey) return null;

		return sortDirection === 'asc' ? (
			<ChevronUp className="w-4 h-4 ml-1" />
		) : (
			<ChevronDown className="w-4 h-4 ml-1" />
		);
	};

	// Render cell content
	const renderCell = useCallback((row: T, column: ColumnDefinition<T>) => {
		const { accessor, cell } = column;

		if (cell) {
			return cell(row);
		}

		if (typeof accessor === 'function') {
			return accessor(row);
		}

		return row[accessor] as React.ReactNode;
	}, []);

	// Empty state component
	const EmptyState = useCallback(
		() => (
			<div className="py-8 text-center">
				<p className="text-gray-500">{emptyStateMessage}</p>
			</div>
		),
		[emptyStateMessage]
	);

	// Loading state component
	const LoadingState = useCallback(
		() => (
			<div className="py-8 text-center">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
				<p className="mt-2 text-gray-500">Loading data...</p>
			</div>
		),
		[]
	);

	return (
		<div className={`bg-white rounded-lg shadow ${className}`}>
			{/* Table header with title, search, and actions */}
			{!hideHeader && (
				<div className="px-4 py-3 border-b border-gray-200">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
						{/* Title section */}
						{(title || subtitle) && (
							<div>
								{title && (
									<h3 className="text-lg font-semibold text-black text-start">
										{title}
									</h3>
								)}
								{subtitle && (
									<p className="text-sm text-black">
										{subtitle}
									</p>
								)}
							</div>
						)}

						{/* Actions section */}
						<div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
							{/* Search */}
							{searchable && (
								<div className="relative flex-grow sm:max-w-xs">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Search className="h-4 w-4 text-gray-400" />
									</div>
									<input
										type="text"
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder={searchPlaceholder}
										value={searchQuery}
										onChange={handleSearchChange}
									/>
								</div>
							)}

							{/* Download button */}
							{onDownload && (
								<button
									className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
									onClick={onDownload}
								>
									<Download className="w-4 h-4 mr-2" />
									Export
								</button>
							)}

							{/* Global button from parent */}
							{globalButton}
						</div>
					</div>
				</div>
			)}

			{/* Table container */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{columns.map((column, index) => (
								<th
									key={`header-${index}`}
									className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''} ${column.sortable ? 'cursor-pointer' : ''}`}
									onClick={() =>
										handleSort(
											column.accessor as keyof T,
											column.sortable
										)
									}
									style={
										column.width
											? { width: column.width }
											: {}
									}
								>
									<div className="flex items-center">
										{column.header}
										{column.sortable &&
											renderSortIndicator(
												column.accessor as keyof T
											)}
									</div>
								</th>
							))}

							{/* Actions column if needed */}
							{actions && actions.length > 0 && (
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							)}
						</tr>
					</thead>

					<tbody className="bg-white divide-y divide-gray-200">
						{loading ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(actions && actions.length > 0 ? 1 : 0)
									}
								>
									<LoadingState />
								</td>
							</tr>
						) : paginatedData.length === 0 ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(actions && actions.length > 0 ? 1 : 0)
									}
								>
									<EmptyState />
								</td>
							</tr>
						) : (
							paginatedData.map((row, rowIndex) => (
								<tr
									key={`row-${rowIndex}`}
									className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
									onClick={
										onRowClick
											? () => onRowClick(row)
											: undefined
									}
								>
									{columns.map((column, colIndex) => (
										<td
											key={`cell-${rowIndex}-${colIndex}`}
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{renderCell(row, column)}
										</td>
									))}

									{/* Row actions if needed */}
									{actions && actions.length > 0 && (
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div
												className="flex justify-end space-x-2"
												onClick={(e) =>
													e.stopPropagation()
												}
											>
												{actions.map(
													(action, actionIndex) =>
														action.showCondition ===
															undefined ||
														action.showCondition(
															row
														) ? (
															<button
																key={`action-${actionIndex}`}
																className={`${action.buttonClassName || 'text-blue-600 hover:text-blue-900'}`}
																onClick={() =>
																	action.onClick(
																		row
																	)
																}
															>
																{action.icon ? (
																	<span className="flex items-center">
																		{
																			action.icon
																		}
																		<span className="ml-1">
																			{
																				action.label
																			}
																		</span>
																	</span>
																) : (
																	action.label
																)}
															</button>
														) : null
												)}
											</div>
										</td>
									)}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{pagination && !loading && paginatedData.length > 0 && (
				<div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
					<div className="flex-1 flex justify-between items-center">
						<p className="text-sm text-gray-700">
							Showing{' '}
							<span className="font-medium">
								{(pagination.currentPage - 1) *
									pagination.pageSize +
									1}
							</span>{' '}
							to{' '}
							<span className="font-medium">
								{Math.min(
									pagination.currentPage *
										pagination.pageSize,
									processedData.length
								)}
							</span>{' '}
							of{' '}
							<span className="font-medium">
								{processedData.length}
							</span>{' '}
							results
						</p>

						<div className="flex items-center space-x-2">
							<button
								onClick={() =>
									handlePageChange(pagination.currentPage - 1)
								}
								disabled={pagination.currentPage === 1}
								className={`${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50`}
							>
								Previous
							</button>

							{pageNumbers.map((page, index) => (
								<button
									key={`page-${index}`}
									onClick={() =>
										page !== -1 && handlePageChange(page)
									}
									disabled={
										page === -1 ||
										page === pagination.currentPage
									}
									className={`${
										page === -1
											? 'cursor-default bg-white'
											: page === pagination.currentPage
												? 'bg-blue-500 text-white'
												: 'bg-white hover:bg-gray-50 text-gray-700'
									} px-3 py-1 border border-gray-300 rounded-md text-sm font-medium`}
								>
									{page === -1 ? '...' : page}
								</button>
							))}

							<button
								onClick={() =>
									handlePageChange(pagination.currentPage + 1)
								}
								disabled={
									pagination.currentPage ===
									pagination.totalPages
								}
								className={`${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''} px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50`}
							>
								Next
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DataTable;
