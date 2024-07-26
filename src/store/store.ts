import { SearchState } from "@/features/search/searchSlice";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// Define the interface for the preloaded state
interface PreloadedState {
    search: SearchState;
}

// Function to load state from session storage
const loadState = (): PreloadedState | undefined => {
    try {
        // Retrieve stored data from session storage
        const serializedResults = sessionStorage.getItem('searchResults');
        const serializedQuery = sessionStorage.getItem('searchQuery');
        const serializedStartIndex = sessionStorage.getItem('startIndex');
        const serializedSorting = sessionStorage.getItem('sorting');

        if (serializedResults === null || serializedQuery === null || serializedStartIndex === null || serializedSorting === null) {
            return undefined;
        }


        return {
            search: {
                results: JSON.parse(serializedResults),
                query: serializedQuery,
                sorting: serializedSorting as SearchState['sorting'],
                startIndex: JSON.parse(serializedStartIndex),
            },
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
