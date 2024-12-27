// bookSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ServerApi from "@/api/ServerAPI";
import { ApiBook, UserBooksResponse } from "@/types/api";
import { Book } from "@/types/books";
import { BookStatuses, BookStatus } from "@/constants/bookStatuses"; // Import constants

// Convert an ApiBook to your local Book model, adding status
const toBook = (apiBook: ApiBook, status: BookStatus): Book & { status: BookStatus } => {
  return {
    google_books_id: apiBook.google_books_id,
    title: apiBook.title || "Unknown Title",
    authors: apiBook.authors || ["Unknown Author"],
    thumbnail_url: apiBook.thumbnail_url || "/bookcover-na.jpg",
    published_date: apiBook.published_date || "",
    page_count: apiBook.page_count || 0,
    categories: apiBook.categories || [],
    retail_price: apiBook.retail_price || 0,
    currency_code: apiBook.currency_code || "USD",
    description: apiBook.description || "No description available.",
    publisher: apiBook.publisher || "Unknown Publisher",
    status,
  };
};

// --------------------- Thunks ---------------------

/**
 * Thunk: Remove a book on the server, then update local state.
 */
export const removeBookFromServer = createAsyncThunk(
  "book/removeBook",
  async (google_books_id: string, { rejectWithValue }) => {
    try {
      await ServerApi.removeBook(google_books_id);
      return { google_books_id }; // Return ID of the removed book
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to remove book:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error removing book:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

/**
 * Thunk: Save or update a book's status on the server, then update local state.
 */
export const saveBookToServer = createAsyncThunk(
  "book/saveBookToServer",
  async (
    {
      google_books_id,
      status,
    }: { google_books_id: string; status: BookStatus },
    { rejectWithValue }
  ) => {
    try {
      // 1) Call the API to save/update the book status on the server
      await ServerApi.saveBookStatus(google_books_id, status);

      // 2) Return the data needed to update Redux (the book ID & status)
      return { google_books_id, status };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to save book status:", error.message);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while saving the book");
    }
  }
);

// --------------------- Slice State & Reducers ---------------------

export interface BookState {
  currentBook: Book | null; // The book being viewed
  savedBooks: {
    currentlyReading: (Book & { status: BookStatus })[];
    wantToRead: (Book & { status: BookStatus })[];
    previouslyRead: (Book & { status: BookStatus })[];
  };
}

const initialState: BookState = {
  currentBook: null,
  savedBooks: {
    currentlyReading: [],
    wantToRead: [],
    previouslyRead: [],
  },
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setBookDetails(state, action: PayloadAction<Book>) {
      state.currentBook = action.payload;
    },
    clearBookDetails(state) {
      state.currentBook = null;
    },
    addSavedBook(state, action: PayloadAction<Book & { status: BookStatus }>) {
      const { status } = action.payload;
      if (status === BookStatuses.CURRENTLY_READING) {
        state.savedBooks.currentlyReading.push(action.payload);
      } else if (status === BookStatuses.WANT_TO_READ) {
        state.savedBooks.wantToRead.push(action.payload);
      } else if (status === BookStatuses.PREVIOUSLY_READ) {
        state.savedBooks.previouslyRead.push(action.payload);
      }
    },
    updateSavedBookStatus(
      state,
      action: PayloadAction<{ google_books_id: string; status: BookStatus }>
    ) {
      const { google_books_id, status } = action.payload;

      // Remove the book from all categories
      ["currentlyReading", "wantToRead", "previouslyRead"].forEach((category) => {
        state.savedBooks[category as keyof BookState["savedBooks"]].forEach((book, index) => {
          if (book.google_books_id === google_books_id) {
            state.savedBooks[category as keyof BookState["savedBooks"]].splice(index, 1);
          }
        });
      });

      // Find the book details from currentBook
      const bookToAdd = state.currentBook;
      if (bookToAdd) {
        const newBook: Book & { status: BookStatus } = {
          ...bookToAdd,
          status,
        };

        // Add the book to the new category
        if (status === BookStatuses.CURRENTLY_READING) {
          state.savedBooks.currentlyReading.push(newBook);
        } else if (status === BookStatuses.WANT_TO_READ) {
          state.savedBooks.wantToRead.push(newBook);
        } else if (status === BookStatuses.PREVIOUSLY_READ) {
          state.savedBooks.previouslyRead.push(newBook);
        }
      }
    },
    removeSavedBook(state, action: PayloadAction<{ google_books_id: string }>) {
      const { google_books_id } = action.payload;
      ["currentlyReading", "wantToRead", "previouslyRead"].forEach((category) => {
        state.savedBooks[category as keyof BookState["savedBooks"]] =
          state.savedBooks[category as keyof BookState["savedBooks"]].filter(
            (b) => b.google_books_id !== google_books_id
          );
      });
    },
    setSavedBooks(state, action: PayloadAction<UserBooksResponse>) {
      const { currently_reading, want_to_read, previously_read } = action.payload;

      state.savedBooks = {
        currentlyReading: currently_reading.map((b) => toBook(b, BookStatuses.CURRENTLY_READING)),
        wantToRead: want_to_read.map((b) => toBook(b, BookStatuses.WANT_TO_READ)),
        previouslyRead: previously_read.map((b) => toBook(b, BookStatuses.PREVIOUSLY_READ)),
      };
    },
  },
  extraReducers: (builder) => {
    // Remove Book
    builder.addCase(removeBookFromServer.fulfilled, (state, action) => {
      const { google_books_id } = action.payload;
      ["currentlyReading", "wantToRead", "previouslyRead"].forEach((category) => {
        state.savedBooks[category as keyof BookState["savedBooks"]] =
          state.savedBooks[category as keyof BookState["savedBooks"]].filter(
            (b) => b.google_books_id !== google_books_id
          );
      });
    });

    builder.addCase(removeBookFromServer.rejected, (state, action) => {
      console.error("Failed to remove book:", action.payload);
    });

    // Save Book
    builder.addCase(saveBookToServer.fulfilled, (state, action) => {
      const { google_books_id, status } = action.payload;
      console.log("saveBookToServer.fulfilled called with:", action.payload);
console.log("saveBookToServer.fulfilled called with:", action.payload);
      // Check if the book exists in any category
      let bookFound = false;

      ["currentlyReading", "wantToRead", "previouslyRead"].forEach((category) => {
        const idx = state.savedBooks[category as keyof BookState["savedBooks"]].findIndex(
          (b) => b.google_books_id === google_books_id
        );
        if (idx !== -1) {
          const [book] =
            state.savedBooks[category as keyof BookState["savedBooks"]].splice(idx, 1);
          book.status = status;
          state.savedBooks[category as keyof BookState["savedBooks"]].push(book);
          bookFound = true;
        }
      });

      if (!bookFound) {
        // Book is not in savedBooks, add it from currentBook
        if (state.currentBook && state.currentBook.google_books_id === google_books_id) {
          const newBook: Book & { status: BookStatus } = {
            ...state.currentBook,
            status,
          };

          if (status === BookStatuses.CURRENTLY_READING) {
            state.savedBooks.currentlyReading.push(newBook);
          } else if (status === BookStatuses.WANT_TO_READ) {
            state.savedBooks.wantToRead.push(newBook);
          } else if (status === BookStatuses.PREVIOUSLY_READ) {
            state.savedBooks.previouslyRead.push(newBook);
          }
        } else {
          console.warn("Current book not found in state to add to savedBooks");
        }
      }
    });

    builder.addCase(saveBookToServer.rejected, (state, action) => {
      console.error("Failed to save book status:", action.payload);
    });
  },
});

// Export the actions
export const {
  setBookDetails,
  clearBookDetails,
  addSavedBook,
  updateSavedBookStatus,
  removeSavedBook,
  setSavedBooks,
} = bookSlice.actions;

// Export the reducer
export default bookSlice.reducer;
