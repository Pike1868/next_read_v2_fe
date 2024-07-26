import { Book, BookFilterOptions } from '@/types/books';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
    results: Book[];
    sorting: BookFilterOptions;
    startIndex: number;
    query: string;
}

const initialState: SearchState = {
    results: [],
    sorting: "none",
    startIndex: 0,
    query: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults(state, action: PayloadAction<Book[]>) {
            state.results = action.payload;
        },
        setSorting(state, action: PayloadAction<BookFilterOptions>) {
            state.sorting = action.payload;
        },
        setStartIndex(state, action: PayloadAction<number>) {
            state.startIndex = action.payload;
        },
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        }
    },
});

export const { setSearchResults, setSorting, setStartIndex, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
