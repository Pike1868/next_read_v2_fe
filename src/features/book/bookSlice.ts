import { Book } from '@/types/books'; // Import Book interface
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookState {
    currentBook: Book | null; // Current book being viewed for details
    savedBooks: (Book & { status: string })[]; // Array of saved books with their statuses
}

const initialState: BookState = {
    currentBook: null,
    savedBooks: [], // Initialize with an empty array
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        // Set the current book details when user clicks to view a book's details
        setBookDetails(state, action: PayloadAction<Book>) {
            state.currentBook = action.payload;
        },
        // Clear the current book details when leaving the book details page
        clearBookDetails(state) {
            state.currentBook = null;
        },
        // Add a book to the savedBooks list (when user saves a book)
        addSavedBook(state, action: PayloadAction<Book & { status: string }>) {
            state.savedBooks.push(action.payload); // Add saved book to the list with status
        },
        // Update the status of a saved book
        updateSavedBookStatus(
            state,
            action: PayloadAction<{ google_books_id: string; status: string }>
        ) {
            const index = state.savedBooks.findIndex(
                (book) => book.google_books_id === action.payload.google_books_id
            );
            if (index !== -1) {
                state.savedBooks[index].status = action.payload.status; // Update the status of the book
            }
        },
        // Remove a book from the savedBooks list
        removeSavedBook(state, action: PayloadAction<string>) {
            state.savedBooks = state.savedBooks.filter(
                (book) => book.google_books_id !== action.payload
            );
        },
        // Set the entire list of saved books (e.g., after fetching user books from backend)
        setSavedBooks(state, action: PayloadAction<(Book & { status: string })[]>) {
            state.savedBooks = action.payload; // Set all the user's saved books
        },
    },
});

export const {
    setBookDetails,
    clearBookDetails,
    addSavedBook,
    updateSavedBookStatus,
    removeSavedBook,
    setSavedBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
