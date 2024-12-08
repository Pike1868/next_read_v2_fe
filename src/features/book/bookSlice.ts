import ServerApi from '@/api/ServerAPI';
import { ApiBook, UserBooksResponse } from '@/types/api';
import { Book } from '@/types/books'; // Import Book interface
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const toBook = (apiBook: ApiBook, status: string): Book & { status: string } => {
    return {
        google_books_id: apiBook.google_books_id,
        title: apiBook.title || "Unknown Title",
        authors: apiBook.authors || ["Unknown Author"],
        thumbnail_url: apiBook.thumbnail_url || "/bookcover-na.jpg",
        published_date: apiBook.published_date || "",
        page_count: apiBook.page_count || 0,
        categories: [], // Assume empty since it's not in the response
        retail_price: 0, // Assume default as it's not in the response
        currency_code: "", // Assume empty since it's not in the response
        description: apiBook.description || "No description available.",
        publisher: apiBook.publisher || "Unknown Publisher",
        status,
    };
};

// Thunk for removing a book
export const removeBookFromServer = createAsyncThunk(
    'book/removeBook',
    async (google_books_id: string, { rejectWithValue }) => {
        try {
            await ServerApi.removeBook(google_books_id);
            console.log("")
            return { google_books_id }; // Return the ID of the removed book

        } catch (error: unknown) {
            // Type guard to handle error type properly
            if (error instanceof Error) {
                console.error('Failed to remove book:', error.message);
                return rejectWithValue(error.message);
            } else {
                console.error('Unknown error occurred while removing book:', error);
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);


export interface BookState {
    currentBook: Book | null; // Current book being viewed for details
    savedBooks: {
        currentlyReading: (Book & { status: string })[];
        wantToRead: (Book & { status: string })[];
        previouslyRead: (Book & { status: string })[];
    };
}

const initialState: BookState = {
    currentBook: null,
    savedBooks: {
        currentlyReading: [],
        wantToRead: [],
        previouslyRead: [],
    }, // Initialize with empty arrays for each category
};




const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBookDetails(state, action: PayloadAction<Book>) {
            state.currentBook = action.payload;
        },
        clearBookDetails(state) {
            state.currentBook = null;
        },
        addSavedBook(state, action: PayloadAction<Book & { status: string }>) {
            const { status } = action.payload;
            switch (status) {
                case 'Currently Reading':
                    state.savedBooks.currentlyReading.push(action.payload);
                    break;
                case 'Want to Read':
                    state.savedBooks.wantToRead.push(action.payload);
                    break;
                case 'Previously Read':
                    state.savedBooks.previouslyRead.push(action.payload);
                    break;
                default:
                    break;
            }
        },
        updateSavedBookStatus(
            state,
            action: PayloadAction<{ google_books_id: string; status: string }>
        ) {
            const { google_books_id, status } = action.payload;
            // Find the book in the correct category and update its status
            ['currentlyReading', 'wantToRead', 'previouslyRead'].forEach(category => {
                const index = state.savedBooks[category as keyof BookState['savedBooks']].findIndex(
                    (book) => book.google_books_id === google_books_id
                );
                if (index !== -1) {
                    // Remove from old category and push to the new category
                    const [book] = state.savedBooks[category as keyof BookState['savedBooks']].splice(index, 1);
                    book.status = status;
                    state.savedBooks[status.toLowerCase().replace(' ', '') as keyof BookState['savedBooks']].push(book);
                }
            });
        },
        removeSavedBook(state, action: PayloadAction<{ google_books_id: string }>) {
            const { google_books_id } = action.payload;
            // Remove book from the respective category
            ['currentlyReading', 'wantToRead', 'previouslyRead'].forEach(category => {
                state.savedBooks[category as keyof BookState['savedBooks']] = state.savedBooks[category as keyof BookState['savedBooks']].filter(
                    (book) => book.google_books_id !== google_books_id
                );
            });
        },
        //maybe should change this to setSavedLibrary or something later
        setSavedBooks(state, action: PayloadAction<UserBooksResponse>) {
            const { currently_reading, want_to_read, previously_read } = action.payload;

            state.savedBooks = {
                currentlyReading: currently_reading.map((b) => toBook(b, "Currently Reading")),
                wantToRead: want_to_read.map((b) => toBook(b, "Want to Read")),
                previouslyRead: previously_read.map((b) => toBook(b, "Previously Read")),
            };
        }

    },
    extraReducers: (builder) => {
        builder.addCase(removeBookFromServer.fulfilled, (state, action) => {
            // Update the state when the backend confirms the book is removed
            state.savedBooks = {
                currentlyReading: state.savedBooks.currentlyReading?.filter(
                    (book) => book.google_books_id !== action.payload.google_books_id
                ) || [],
                wantToRead: state.savedBooks.wantToRead?.filter(
                    (book) => book.google_books_id !== action.payload.google_books_id
                ) || [],
                previouslyRead: state.savedBooks.previouslyRead?.filter(
                    (book) => book.google_books_id !== action.payload.google_books_id
                ) || [],
            };
        });
        builder.addCase(removeBookFromServer.rejected, (state, action) => {
            console.error("Failed to remove book:", action.payload);
        });

    },

});

export const {
    setBookDetails,
    clearBookDetails,
    addSavedBook,
    updateSavedBookStatus,
    removeSavedBook,
    setSavedBooks, //maybe should change this to setSavedLibrary or something later
} = bookSlice.actions;

export default bookSlice.reducer;
