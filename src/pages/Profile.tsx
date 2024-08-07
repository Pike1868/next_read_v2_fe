import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user/UserProfile";
import { useSelector } from "react-redux";

import EditProfileForm from "@/components/user/EditProfileForm";
import { RootState } from "@/store/rootReducer";
import { useState } from "react";

export default function Profile() {
    const userProfile = useSelector(
        (state: RootState) => state.user.userProfile
    );
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
    };

    if (!userProfile) {
        return (
            <div>
                Loading...something is wrong with state saved user profile info
            </div>
        );
    }

    return (
        <div className="mb-24">
            {!isEditing ? (
                <div>
                    <UserProfile {...userProfile} />
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={handleEditClick}>
                            Edit Profile
                        </Button>
                        <Button variant="destructive">Delete Profile</Button>
                    </div>
                </div>
            ) : (
                <div className="modal">
                    <EditProfileForm {...userProfile} closeModal={handleCloseModal} />
                </div>
            )}
        </div>
    );
}
