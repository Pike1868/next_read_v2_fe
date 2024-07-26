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
        /**
         * Sets the search results and saves them to session storage.
         * @param state - The current state of the search slice.
         * @param action - The action payload contains an array of Book objects.
         */
        setSearchResults(state, action: PayloadAction<Book[]>) {
            state.results = action.payload;
            sessionStorage.setItem('searchResults', JSON.stringify(action.payload));
        },
        
        /**
         * Sets the sorting option and saves it to session storage.
         * @param state - The current state of the search slice.
         * @param action - The action payload contains the sorting option.
         */
        setSorting(state, action: PayloadAction<BookFilterOptions>) {
            state.sorting = action.payload;
            sessionStorage.setItem('sorting', action.payload);
        },

        /**
         * Sets the start index for pagination and saves it to session storage.
         * @param state - The current state of the search slice.
         * @param action - The action payload contains the start index.
         */
        setStartIndex(state, action: PayloadAction<number>) {
            state.startIndex = action.payload;
            sessionStorage.setItem('startIndex', JSON.stringify(action.payload));
        },

        /**
         * Sets the search query and saves it to session storage.
         * @param state - The current state of the search slice.
         * @param action - The action payload contains the search query.
         */
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
            sessionStorage.setItem('searchQuery', action.payload);
        }
    },
});

export const { setSearchResults, setSorting, setStartIndex, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
