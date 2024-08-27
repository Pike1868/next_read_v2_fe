import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ConfirmDeleteModal from "@/components/user/ConfirmDeleteModal";
import EditProfileForm from "@/components/user/EditProfileForm";
import UserProfile from "@/components/user/UserProfile";
import { logoutUser } from "@/features/user/userSlice";
import { RootState } from "@/store/rootReducer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
    const userProfile = useSelector(
        (state: RootState) => state.user.userProfile
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await ServerApi.deleteUser();
            if (response.status === 200) {
                toast({
                    description: "Your account has been deleted.",
                    variant: "destructive",
                });
                dispatch(logoutUser());
            } else {
                toast({
                    description: "Error deleting account. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({ description: error.message, variant: "destructive" });
            }
        } finally {
            setIsDeleteModalOpen(false);
        }
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
                        <Button
                            variant="destructive"
                            onClick={handleDeleteClick}
                        >
                            Delete Profile
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="modal">
                    <EditProfileForm
                        {...userProfile}
                        closeModal={handleCloseModal}
                    />
                </div>
            )}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
