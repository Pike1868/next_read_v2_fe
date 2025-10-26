import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileProps } from "@/types/user";
import { FaUserAstronaut } from "react-icons/fa6";

export default function UserProfile({
    username,
    email,
    bio,
    location,
    creationDate,
    imageUrl,
}: UserProfileProps) {
    const formattedDate = new Date(creationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    });
    return (
        <section className="w-full p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto sm:mx-0">
                    <AvatarImage src={imageUrl} alt={username} />
                    <AvatarFallback>
                        <FaUserAstronaut className="w-8 h-8 md:w-10 md:h-10" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold">{username}</h2>
                    <p className="text-gray-600 text-sm md:text-base">{email}</p>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm md:text-base">
                        <strong>Bio:</strong> {bio || "None"}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>Location:</strong> {location || "None"}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>Member Since:</strong> {formattedDate}
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
