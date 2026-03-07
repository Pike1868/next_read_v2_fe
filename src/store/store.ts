import authListenerMiddleware from '@/middleware/authListenerMiddleware';
import { isTokenExpired } from '@/util/jwtHelper';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

// Function to save state to local storage
const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (error) {
        if (import.meta.env.DEV) console.error('Could not save state', error);
    }
};

// Function to load state from local storage
const loadState = (): RootState | undefined => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        const loadedState = JSON.parse(serializedState) as RootState;

        // Check if the token in the user slice is expired
        if (loadedState.user && loadedState.user.user && isTokenExpired(loadedState.user.user.token)) {
            return {
                ...loadedState,
                user: { user: null, userProfile: null }, // Reset the user state if token is expired
                book: {
                    currentBook: null, // Clear the book state as well
                    savedBooks: { // Initialize savedBooks with the correct structure
                        currentlyReading: [],
                        wantToRead: [],
                        previouslyRead: [],
                    },
                },
            };
        }

        // Ensure savedBooks has the correct structure
        if (!loadedState.book.savedBooks || Array.isArray(loadedState.book.savedBooks)) {
            loadedState.book.savedBooks = {
                currentlyReading: [],
                wantToRead: [],
                previouslyRead: [],
            };
        }

        return loadedState;
    } catch (error) {
        if (import.meta.env.DEV) console.error('Could not load state', error);
        return undefined;
    }
};

export function setupStore(preloadedState?: PreloadedState<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
    });
}

// Load the preloaded state from local storage
const preloadedState = loadState();

// Configure the Redux store with the root reducer and preloaded state
const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
});

// Subscribe to store updates and save the state to local storage
store.subscribe(() => {
    saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
export default store;
