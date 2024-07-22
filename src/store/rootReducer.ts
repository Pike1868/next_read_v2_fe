import { combineReducers } from '@reduxjs/toolkit';
import searchReducer, { SearchState } from '../features/search/searchSlice';

const rootReducer = combineReducers({
    search: searchReducer,
});

export type RootState = ReturnType<typeof rootReducer> & {
    search: SearchState;
};

export default rootReducer;
