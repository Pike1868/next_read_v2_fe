
import { toast } from "@/components/ui/use-toast";
import { logoutUser } from "@/features/user/userSlice";
import { AppDispatch } from "@/store/store";
import { ApiErrorResponse } from "@/types/api";

export const handleApiError = ({ msg, status }: ApiErrorResponse, dispatch: AppDispatch) => {
    if (status === 401) {
        dispatch(logoutUser());
        toast({
            description: "Session expired, Please sign in again.",
            variant: "destructive"
        });
    } else if (status >= 400 && status < 500) {
        toast({
            description: msg || "Client error occurred",
            variant: "destructive"
        });
    } else if (status >= 500) {
        toast({
            description: "Server error occurred. Please try again later.",
            variant: "destructive"
        });
    } else {
        toast({
            description: "An unexpected error occurred.",
            variant: "destructive"
        });
    }
};
