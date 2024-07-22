import { Book } from '@/types/books';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
    results: Book[];
}

const initialState: SearchState = {
    results: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults(state, action: PayloadAction<Book[]>) {
            state.results = action.payload;
        },
    },
});

export const { setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
