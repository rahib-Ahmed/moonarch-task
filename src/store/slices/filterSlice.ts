import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
	selectedState: string | null;
	selectedYear: number | string;
}

const initialState: FilterState = {
	selectedState: 'Nation',
	selectedYear: 'latest',
};

export const filterSlice = createSlice({
	name: 'globalFilter',
	initialState,
	reducers: {
		setSelectedState: (state, action: PayloadAction<string | null>) => {
			state.selectedState = action.payload;
		},
		setSelectedYear: (state, action: PayloadAction<number | string>) => {
			state.selectedYear = action.payload;
		},
	},
});

export const selectSelectedState = (state) => state.globalFilter.selectedState;
export const selectSelectedYear = (state) => state.globalFilter.selectedYear;

// actions
export const { setSelectedState, setSelectedYear } = filterSlice.actions;

export default filterSlice.reducer;
