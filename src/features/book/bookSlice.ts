import ServerApi from "@/api/ServerAPI";
import { BookStatus, BookStatuses } from "@/constants/bookStatuses";
import { ApiBook, UserBooksResponse } from "@/types/api";
import { Book } from "@/types/books";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const toBook = (apiBook: ApiBook, status: BookStatus): Book & { status: BookStatus } => {
  console.log("ApiBook received:", apiBook);

  return {
    google_books_id: apiBook.google_books_id,
    title: apiBook.title || "Unknown Title",
    authors: Array.isArray(apiBook.authors)
      ? apiBook.authors.flat()
      : [apiBook.authors || "Unknown Author"],
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

const getCategoryKey = (status: BookStatus): keyof BookState["savedBooks"] => {
  switch (status) {
    case BookStatuses.CURRENTLY_READING:
      return "currentlyReading";
    case BookStatuses.WANT_TO_READ:
      return "wantToRead";
    case BookStatuses.PREVIOUSLY_READ:
      return "previouslyRead";
    default:
      throw new Error(`Unknown book status: ${status}`);
  }
};

const removeBookFromAllCategories = (state: BookState, google_books_id: string) => {
  state.savedBooks.currentlyReading = state.savedBooks.currentlyReading.filter(
    (book) => book.google_books_id !== google_books_id
  );
  state.savedBooks.wantToRead = state.savedBooks.wantToRead.filter(
    (book) => book.google_books_id !== google_books_id
  );
  state.savedBooks.previouslyRead = state.savedBooks.previouslyRead.filter(
    (book) => book.google_books_id !== google_books_id
  );
};

const findBookInCategories = (state: BookState, google_books_id: string): (Book & { status: BookStatus }) | null => {
  const allBooks = [
    ...state.savedBooks.currentlyReading,
    ...state.savedBooks.wantToRead,
    ...state.savedBooks.previouslyRead
  ];
  return allBooks.find(book => book.google_books_id === google_books_id) || null;
};

export const fetchUserBooks = createAsyncThunk(
  "book/fetchUserBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ServerApi.getUserBooks();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to fetch user books:", error.message);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while fetching user books");
    }
  }
);

export const removeBookFromServer = createAsyncThunk(
  "book/removeBook",
  async (google_books_id: string, { rejectWithValue }) => {
    try {
      await ServerApi.removeBook(google_books_id);
      return { google_books_id };
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

export const saveBookToServer = createAsyncThunk(
  "book/saveBookToServer",
  async (
    {
      google_books_id,
      status,
      bookData,
    }: {
      google_books_id: string;
      status: BookStatus;
      bookData?: Book;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ServerApi.saveBookStatus(google_books_id, status);
      if (!response.data) {
        throw new Error('Failed to save book status');
      }
      return { google_books_id, status, bookData };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to save book status:", error.message);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while saving the book");
    }
  }
);

export interface BookState {
  currentBook: Book | null;
  savedBooks: {
    currentlyReading: (Book & { status: BookStatus })[];
    wantToRead: (Book & { status: BookStatus })[];
    previouslyRead: (Book & { status: BookStatus })[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  currentBook: null,
  savedBooks: {
    currentlyReading: [],
    wantToRead: [],
    previouslyRead: [],
  },
  loading: false,
  error: null,
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
      const { status, google_books_id } = action.payload;
      removeBookFromAllCategories(state, google_books_id);
      const categoryKey = getCategoryKey(status);
      state.savedBooks[categoryKey].push(action.payload);
    },
    updateSavedBookStatus(
      state,
      action: PayloadAction<{ google_books_id: string; status: BookStatus }>
    ) {
      const { google_books_id, status } = action.payload;
      const existingBook = findBookInCategories(state, google_books_id);

      if (existingBook) {
        removeBookFromAllCategories(state, google_books_id);
        const updatedBook = { ...existingBook, status };
        const categoryKey = getCategoryKey(status);
        state.savedBooks[categoryKey].push(updatedBook);
      } else if (state.currentBook?.google_books_id === google_books_id) {
        const newBook: Book & { status: BookStatus } = {
          ...state.currentBook,
          status,
        };
        const categoryKey = getCategoryKey(status);
        state.savedBooks[categoryKey].push(newBook);
      }
    },
    removeSavedBook(state, action: PayloadAction<{ google_books_id: string }>) {
      const { google_books_id } = action.payload;
      removeBookFromAllCategories(state, google_books_id);
    },
    setSavedBooks(state, action: PayloadAction<UserBooksResponse>) {
      const { currently_reading, want_to_read, previously_read } = action.payload;
      state.savedBooks = {
        currentlyReading: currently_reading.map((b) => toBook(b, BookStatuses.CURRENTLY_READING)),
        wantToRead: want_to_read.map((b) => toBook(b, BookStatuses.WANT_TO_READ)),
        previouslyRead: previously_read.map((b) => toBook(b, BookStatuses.PREVIOUSLY_READ)),
      };
    },
    clearBookError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBooks.fulfilled, (state, action) => {
        state.loading = false;
        const { currently_reading, want_to_read, previously_read } = action.payload;
        state.savedBooks = {
          currentlyReading: currently_reading.map((b) => toBook(b, BookStatuses.CURRENTLY_READING)),
          wantToRead: want_to_read.map((b) => toBook(b, BookStatuses.WANT_TO_READ)),
          previouslyRead: previously_read.map((b) => toBook(b, BookStatuses.PREVIOUSLY_READ)),
        };
      })
      .addCase(fetchUserBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeBookFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBookFromServer.fulfilled, (state, action) => {
        state.loading = false;
        const { google_books_id } = action.payload;
        removeBookFromAllCategories(state, google_books_id);
      })
      .addCase(removeBookFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to remove book:", action.payload);
      })
      .addCase(saveBookToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBookToServer.fulfilled, (state, action) => {
        state.loading = false;
        const { google_books_id, status, bookData } = action.payload;
        console.log("saveBookToServer.fulfilled called with:", action.payload);

        const existingBook = findBookInCategories(state, google_books_id);

        if (existingBook) {
          removeBookFromAllCategories(state, google_books_id);
          const updatedBook = { ...existingBook, status };
          const categoryKey = getCategoryKey(status);
          state.savedBooks[categoryKey] = [...state.savedBooks[categoryKey], updatedBook];
        } else {
          const bookToAdd = bookData || state.currentBook;
          if (bookToAdd && bookToAdd.google_books_id === google_books_id) {
            const newBook: Book & { status: BookStatus } = {
              ...bookToAdd,
              status,
            };
            const categoryKey = getCategoryKey(status);
            state.savedBooks[categoryKey] = [...state.savedBooks[categoryKey], newBook];
            console.log("✅ Book successfully added to savedBooks:", newBook);
          } else {
            console.warn("⚠️ Book data is missing, book could not be added!");
          }
        }
      })
      .addCase(saveBookToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to save book:", action.payload);
      });
  },
});

export const {
  setBookDetails,
  clearBookDetails,
  addSavedBook,
  updateSavedBookStatus,
  removeSavedBook,
  setSavedBooks,
  clearBookError,
} = bookSlice.actions;

export default bookSlice.reducer;