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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Loading...</p>
                    <p className="text-sm text-gray-500 mt-2">Loading profile information</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-4xl mx-auto mb-16 md:mb-24">
                {!isEditing ? (
                    <div>
                        <UserProfile {...userProfile} />
                        <div className="flex flex-col sm:flex-row gap-4 px-4 md:px-8">
                            <Button 
                                variant="outline" 
                                onClick={handleEditClick}
                                className="w-full sm:w-auto"
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteClick}
                                className="w-full sm:w-auto"
                            >
                                Delete Profile
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <EditProfileForm
                            {...userProfile}
                            closeModal={handleCloseModal}
                        />
                    </div>
                )}
            </div>
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </>
    );
}
