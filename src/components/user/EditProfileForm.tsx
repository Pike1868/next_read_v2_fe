import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { setUserProfile } from "@/features/user/userSlice";
import { UserProfileProps } from "@/types/user";
import { mapUserProfileResponse } from "@/util/mapUserProfileResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import FormInput from "./FormInput";

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." }),
    email: z.string(),
    bio: z.string(),
    location: z.string(),
    image_url: z.string(),
    password: z.string(),
});

type FormData = z.infer<typeof formSchema>;
interface EditProfileFormProps extends UserProfileProps {
    closeModal: () => void;
}

export default function EditProfileForm({
    username,
    email,
    bio,
    location,
    imageUrl,
    closeModal,
}: EditProfileFormProps) {
    const dispatch = useDispatch();
    // Initialize the form with react-hook-form, using zod for validation
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username,
            email,
            bio,
            location,
            image_url: imageUrl,
            password: "",
        },
    });

    const handleSubmit = async (data: FormData) => {
        try {
            const response = await ServerApi.editUser(data);

            if (response.status === 200) {
                // Fetch and store user profile
                const user = await ServerApi.getUserProfile();
                const userProfile = mapUserProfileResponse(user.data);
                dispatch(setUserProfile(userProfile));

                //Close edit form and toast feedback to user
                closeModal();
                toast({ description: response.data.msg, variant: "default" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                toast({ description: error.message, variant: "destructive" });
            }
        }
    };

    return (
        <section className="grid h-screen place-items-center">
            <Card className="w-96 bg-muted">
                <CardHeader>
                    <CardTitle className="text-center">
                        Edit Your Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8"
                        >
                            <FormInput<FormData>
                                control={form.control}
                                name="username"
                                type="text"
                            />
                            <FormInput<FormData>
                                control={form.control}
                                name="email"
                                type="email"
                            />
                            <FormInput<FormData>
                                control={form.control}
                                name="bio"
                                type="text"
                            />
                            <FormInput<FormData>
                                control={form.control}
                                name="location"
                                type="text"
                            />
                            <FormInput<FormData>
                                control={form.control}
                                name="image_url"
                                type="text"
                            />
                            <FormInput<FormData>
                                control={form.control}
                                name="password"
                                type="password"
                            />
                            <div className="flex justify-around">
                                <Button
                                    type="submit"
                                    className="text-blue-500 bg-white hover:text-white hover:bg-blue-600"
                                >
                                    Update Profile
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-800 hover:text-white hover:bg-red-800"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
