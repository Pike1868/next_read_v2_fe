import { toast } from "@/components/ui/use-toast";
import { UserProfileProps } from "@/types/user";
import { isTokenExpired } from "@/util/jwtHelper";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    username: string;
    token: string;
}

export interface UserState {
    user: User | null;
    userProfile: UserProfileProps | null;
}

const getUserFromLocalStorage = (): User | null => {
    const user = localStorage.getItem("user");
    if (user) {
        const parsedUser = JSON.parse(user);
        if (isTokenExpired(parsedUser.token)) {
            localStorage.removeItem("user");
            return null
        }
        return parsedUser;
    }
    return null
};

const initialState: UserState = {
    user: getUserFromLocalStorage(),
    userProfile: null,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser(state, action: PayloadAction<User>) {
            const user = action.payload;
            state.user = user;
            toast({ description: "Login successful" });

            if (user.username === "demo user") {
                toast({ description: "Welcome Guest User" });
            }
        },
        setUserProfile(state, action: PayloadAction<UserProfileProps>) {
            state.userProfile = action.payload; // Update profile in state
        },
        logoutUser(state) {
            state.user = null;
            state.userProfile = null; // Clear profile on logout
            localStorage.removeItem('state');
            toast({ description: "Logout successful" });
        }
    },
});

export const { loginUser, setUserProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;
