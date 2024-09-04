import { toast } from "@/components/ui/use-toast";
import { logoutUser, setUserProfile } from '@/features/user/userSlice';
import { RootState } from '@/store/rootReducer';
import { isTokenExpired } from '@/util/jwtHelper';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

// Create the listener middleware
const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
    matcher: isAnyOf(setUserProfile),
    effect: async (action, listenerApi) => {
        // Retrieve the current state of the store using listenerApi.getState()
        const state = listenerApi.getState() as RootState;
        const token = state.user?.user?.token;

        if (token && isTokenExpired(token)) {
            listenerApi.dispatch(logoutUser());
            // Show a toast notification to inform the user that their session has expired
            toast({
                description: "Session expired, Please sign in again.",
                variant: "destructive"
            });
            // Cancel any other active listeners, preventing further actions from being processed
            listenerApi.cancelActiveListeners();
        }
    },
});

export default authListenerMiddleware;
