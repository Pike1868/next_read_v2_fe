import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { setSavedBooks } from "@/features/book/bookSlice";
import { loginUser, setUserProfile } from "@/features/user/userSlice";
import { mapUserProfileResponse } from "@/util/mapUserProfileResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import FormInput from "./FormInput";
import GoogleSignInButton from "./GoogleSignInButton";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function SigninForm() {
    const dispatch = useDispatch();
    // Initialize the form with react-hook-form, using zod for validation
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();

    const handleSubmit = async (data: FormData) => {
        try {
            const user = await ServerApi.signin(data);
            dispatch(loginUser(user.data));

            // Set the token in the ServerApi instance
            ServerApi.setToken(user.data.token);

            // Fetch and store user profile
            const response = await ServerApi.getUserProfile();
            const userProfile = mapUserProfileResponse(response.data);
            dispatch(setUserProfile(userProfile));

            // Fetch and store user's saved books
            const savedBooksResponse = await ServerApi.getUserBooks();
            dispatch(setSavedBooks(savedBooksResponse.data));

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
                    <CardTitle className="text-center">Welcome Back!</CardTitle>
                    <p className="text-center text-sm text-gray-600">Sign in below</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Google Sign In */}
                    <GoogleSignInButton variant="default" fullWidth showText />

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-gray-500 font-medium">OR</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Email/Password Form */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
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
                                className="w-full text-xl font-bold bg-green-800 hover:text-green-800 hover:bg-white transition-all"
                            >
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
