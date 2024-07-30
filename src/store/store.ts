import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

// Defines the interface for the preloaded state
interface PreloadedState {
    search: RootState['search'];
    user: RootState['user'];
}

// Function to load state from session storage
const loadState = (): PreloadedState | undefined => {
    try {
        // Retrieve stored data from session storage
        const serializedResults = sessionStorage.getItem('searchResults');
        const serializedQuery = sessionStorage.getItem('searchQuery');
        const serializedStartIndex = sessionStorage.getItem('startIndex');
        const serializedSorting = sessionStorage.getItem('sorting');
        const serializedUser = localStorage.getItem('user');

        // If any of the search data is missing, return undefined
        if (
            serializedResults === null ||
            serializedQuery === null ||
            serializedStartIndex === null ||
            serializedSorting === null
        ) {
            return undefined;
        }

        // Parse and return the preloaded state
        return {
            search: {
                results: JSON.parse(serializedResults),
                query: serializedQuery,
                sorting: serializedSorting as RootState['search']['sorting'],
                startIndex: JSON.parse(serializedStartIndex),
            },
            user: serializedUser ? JSON.parse(serializedUser) : null, // Handle missing user data
        };
    } catch (error) {
        return undefined;
    }
};

// Load the preloaded state from session storage
const preloadedState = loadState();

// Configure the Redux store with the root reducer and preloaded state
const store = configureStore({
    reducer: rootReducer,
    preloadedState,
});

export type AppDispatch = typeof store.dispatch;
export default store;
