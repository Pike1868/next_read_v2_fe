import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { clearBookDetails, setBookDetails } from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book, BookDetailsResponse } from "@/types/books";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BookDetails() {
    const user = useSelector((state: RootState) => state.user.user); // Get the user from Redux state
    const { volume_id } = useParams<{ volume_id: string }>();
    const book = useSelector((state: RootState) => state.book.currentBook); // Get book from Redux state
    const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type
    const [isExpanded, setIsExpanded] = useState(false); // Track if description is expanded

    useEffect(() => {
        // Clear previous book details before loading new ones
        dispatch(clearBookDetails());

        // Fetch book details from API if not already available in Redux state
        if (volume_id) {
            loadBookDetails(volume_id, dispatch);
        }
    }, [volume_id, dispatch]); // Trigger whenever volume_id changes

    // Function to load book details from the API
    async function loadBookDetails(volumeId: string, dispatch: AppDispatch) {
        try {
            const response = await ServerApi.getBookDetails(volumeId);
            const bookData: BookDetailsResponse = response.data.book;

            // Map the BookDetailsResponse to the full Book object
            const book: Book = {
                google_books_id: volumeId, // Use volumeId as google_books_id
                title: bookData.title,
                authors: bookData.authors,
                thumbnail_url: bookData.imageLinks?.thumbnail || DEFAULT_IMAGE, // Default image if not available
                published_date: bookData.publishedDate,
                page_count: 0, // Default or fetch this field if available elsewhere
                categories: [], // Categories may need to be fetched or mapped separately
                retail_price: 0, // If available from another source, set this field
                currency_code: "USD", // You can adjust this as needed
                description:
                    bookData.description || "Description not available", // Add description
                publisher: bookData.publisher || "Publisher not available", // Add publisher
            };

            // Dispatch the book details to Redux
            dispatch(setBookDetails(book));
        } catch (error) {
            console.error("Failed to load book details:", error);
            toast({
                description: "Failed to load book details. Please try again.",
                variant: "destructive",
            });
        }
    }

    // Function to handle saving the book status
    async function saveBookStatus(status: string) {
        try {
            // Use the null assertion operator to tell TypeScript book is not null
            const response = await ServerApi.saveBookStatus(
                book!.google_books_id,
                status
            );
            toast({
                description: `Book status saved as: ${status}`,
                variant: "default",
            });

            console.log(response);
        } catch (error) {
            console.error("Failed to save book status:", error);
            toast({
                description: "Error saving book status.",
                variant: "destructive",
            });
        }
    }

    if (!book) {
        return <div>Loading...</div>; // Show loading state until book is available
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="mb-4">
                <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div>
                    <img
                        src={book.thumbnail_url || DEFAULT_IMAGE}
                        alt={book.title}
                        className="object-contain w-full max-w-xs mx-auto rounded-md max-h-80"
                    />

                    <div
                        dangerouslySetInnerHTML={{
                            __html: isExpanded
                                ? book.description
                                : book.description.slice(0, 300) + "...",
                        }}
                        className={`max-w-full text-gray-700 ${
                            isExpanded
                                ? "max-h-none"
                                : "max-h-60 overflow-hidden"
                        } transition-all ease-in-out`}
                    />

                    <div className="py-2">
                        <Button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="self-start mt-2"
                        >
                            {isExpanded ? "Show Less" : "Read More"}
                        </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Authors: {book.authors.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                        Publisher: {book.publisher}
                    </p>
                    <p className="text-sm text-gray-600">
                        Published Date: {book.published_date}
                    </p>
                </div>
            </CardContent>

            {user && ( // Conditionally render the footer if user is logged in
                <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-lg font-semibold">
                        Add to your reading list:
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => saveBookStatus("previously_read")}
                        >
                            Previously Read
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => saveBookStatus("currently_reading")}
                        >
                            Currently Reading
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => saveBookStatus("want_to_read")}
                        >
                            Want to Read
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
