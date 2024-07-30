import userReducer, { UserState } from '@/features/user/userSlice';
import searchReducer, { SearchState } from '@/features/search/searchSlice';
import { combineReducers } from '@reduxjs/toolkit';

// Define the RootState interface
export interface RootState {
    user: UserState;
    search: SearchState;
}

const rootReducer = combineReducers({
    user: userReducer,
    search: searchReducer,
});

export default rootReducer;
