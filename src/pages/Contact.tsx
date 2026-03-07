import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    subject: z.string().min(1, "Please select a subject"),
    message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
    const { toast } = useToast();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    function onSubmit(_data: ContactFormValues) {
        toast({
            title: "Message sent!",
            description:
                "Thank you for reaching out. We'll get back to you as soon as possible.",
        });
        form.reset();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Header */}
            <section className="relative w-full py-24 text-center bg-green-900">
                <div className="relative z-10 max-w-3xl px-6 mx-auto">
                    <h1 className="mb-4 text-5xl font-bold text-white">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-green-100">
                        Have a question, found a bug, or want to suggest a
                        feature? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="w-full px-6 py-20 bg-white">
                <div className="grid max-w-5xl gap-12 mx-auto lg:grid-cols-3">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                    Send us a message
                                </h2>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Your name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="you@example.com"
                                                                type="email"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Subject
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a subject" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="general">
                                                                General
                                                            </SelectItem>
                                                            <SelectItem value="bug">
                                                                Bug Report
                                                            </SelectItem>
                                                            <SelectItem value="feature">
                                                                Feature Request
                                                            </SelectItem>
                                                            <SelectItem value="other">
                                                                Other
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Message
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell us what's on your mind..."
                                                            rows={6}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-green-700 hover:bg-green-800 text-white sm:w-auto"
                                        >
                                            Send Message
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Contact Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 mt-0.5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Email
                                            </p>
                                            <a
                                                href="mailto:devs@nextread.pro"
                                                className="text-sm text-green-600 hover:underline"
                                            >
                                                devs@nextread.pro
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Github className="w-5 h-5 mt-0.5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                GitHub
                                            </p>
                                            <a
                                                href="https://github.com/Pike1868/next_read_book_tracker_app"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-green-600 hover:underline"
                                            >
                                                NextRead Repository
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    Response Time
                                </h3>
                                <p className="text-sm text-gray-600">
                                    We typically respond within 1-2 business
                                    days. For urgent issues, please include
                                    "Urgent" in the subject line.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
