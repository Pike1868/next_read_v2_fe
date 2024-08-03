import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { loginUser, setUserProfile } from "@/features/user/userSlice";
import { mapUserProfileResponse } from "@/util/mapUserProfileResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import FormInput from "./FormInput";

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        })
        .regex(/[^A-Za-z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupForm() {
    const dispatch = useDispatch();
    // Initialize the form with react-hook-form, using zod for validation
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();

    const handleSubmit = async (data: FormData) => {
        try {
            const user = await ServerApi.signin(data);
            dispatch(loginUser(user));

            // Set the token in the ServerApi instance
            ServerApi.setToken(user.token);

            // Fetch and store user profile
            const response = await ServerApi.getUserProfile();
            const userProfile = mapUserProfileResponse(response);
            dispatch(setUserProfile(userProfile));

            navigate("/");
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
                    <CardTitle className="text-center">Sign Up</CardTitle>
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
                                name="password"
                                type="password"
                            />
                            <Button
                                type="submit"
                                className="w-full text-xl font-bold text-green-800 bg-white hover:text-white hover:bg-green-800"
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
