import { Book } from '@/types/books';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
    results: Book[];
    sorting: "none" | "a-z" | "z-a";
}

const initialState: SearchState = {
    results: [],
    sorting: "none",
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults(state, action: PayloadAction<Book[]>) {
            state.results = action.payload;
        },
        setSorting(state, action: PayloadAction<"none" | "a-z" | "z-a">) {
            state.sorting = action.payload;
        }
    },
});

export const { setSearchResults, setSorting } = searchSlice.actions;
export default searchSlice.reducer;
