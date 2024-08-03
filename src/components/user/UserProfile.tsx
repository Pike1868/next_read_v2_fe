import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
        <section className="container p-8 mx-auto">
            <div className="flex items-center mb-6 space-x-4">
                <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage src={imageUrl} alt={username} />
                    <AvatarFallback>
                        <FaUserAstronaut />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">{username}</h2>
                    <p className="text-gray-600">{email}</p>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Bio:</strong> {bio || "None"}
                    </p>
                    <p>
                        <strong>Location:</strong> {location || "None"}
                    </p>
                    <p>
                        <strong>Member Since:</strong> {formattedDate}
                    </p>
                </CardContent>
            </Card>

            <div className="flex space-x-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="destructive">Delete Profile</Button>
            </div>
        </section>
    );
}
