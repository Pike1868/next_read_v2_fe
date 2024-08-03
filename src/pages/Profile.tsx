import UserProfile from "@/components/user/UserProfile";
import { useSelector } from "react-redux";

import { RootState } from "@/store/rootReducer"; 

export default function Profile() {
    const userProfile = useSelector(
        (state: RootState) => state.user.userProfile
    );

    if (!userProfile) {
        return <div>Loading...something is wrong with state saved user profile info</div>;
    }

    return <UserProfile {...userProfile} />;
}
