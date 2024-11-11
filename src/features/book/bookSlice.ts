// src/features/book/bookSlice.ts
import { BookDetailsResponse } from '@/types/books';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookState {
    currentBook: BookDetailsResponse | null;
}

const initialState: BookState = {
    currentBook: null,
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBookDetails(state, action: PayloadAction<BookDetailsResponse>) {
            state.currentBook = action.payload;
        },
        clearBookDetails(state) {
            state.currentBook = null;
        },
    },
});

export const { setBookDetails, clearBookDetails } = bookSlice.actions;
export default bookSlice.reducer;
