import { toast } from "@/components/ui/use-toast";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    username: string;
    token: string;
}

export interface UserState {
    user: User | null;
}

const getUserFromLocalStorage = (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const initialState: UserState = {
    user: getUserFromLocalStorage(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser(state, action: PayloadAction<User>) {
            const user = action.payload;
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));

            toast({ description: "Login successful" });

            if (user.username === "demo user") {
                toast({ description: "Welcome Guest User" });
            }
        },
        logoutUser(state) {
            state.user = null;
            localStorage.removeItem('user');
            toast({ description: "Logout successful" });
        }
    },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
