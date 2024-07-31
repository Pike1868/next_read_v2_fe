import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { loginUser } from "@/features/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import FormInput from "./FormInput";
import {toast} from "@/components/ui/use-toast"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupForm() {
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
            dispatch(loginUser(user));
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
                    <p className="text-center">Sign in below</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8"
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
                                className="w-full text-xl font-bold bg-green-800 hover:text-green-800 hover:bg-white"
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
