// util/mapUserProfileResponse.ts
import { UserProfileResponse } from "@/types/api";
import { UserProfileProps } from "@/types/user";

export const mapUserProfileResponse = (response: UserProfileResponse): UserProfileProps => {
    return {
        username: response.username,
        email: response.email,
        bio: response.bio || "None",
        location: response.location || "None",
        creationDate: response.creation_date,
        imageUrl: response.image_url,
    };
};
