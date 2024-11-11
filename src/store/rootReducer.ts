
import bookReducer, { BookState } from '@/features/book/bookSlice';
import searchReducer, { SearchState } from '@/features/search/searchSlice';
import userReducer, { UserState } from '@/features/user/userSlice';
import { combineReducers } from '@reduxjs/toolkit';

// Define the RootState interface
export interface RootState {
    user: UserState;
    search: SearchState;
    book: BookState;
}

const rootReducer = combineReducers({
    user: userReducer,
    search: searchReducer,
    book: bookReducer,
});

export default rootReducer;
