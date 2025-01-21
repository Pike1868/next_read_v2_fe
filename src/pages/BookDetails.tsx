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
import {
    clearBookDetails,
    saveBookToServer,
    setBookDetails,
} from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import {
    Book,
    BookDetailsResponse,
    BookStatus,
    BookStatuses,
} from "@/types/books";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

console.log("saveBookToServer:", saveBookToServer); // Should log a function

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

            // Ensure authors is always an array
            const authors = Array.isArray(bookData.authors)
                ? bookData.authors
                : [bookData.authors || "Unknown Author"];

            console.log("Normalized authors:", authors, Array.isArray(authors));

            // Transform BookDetailsResponse to Book
            const book: Book = {
                google_books_id: volumeId,
                title: bookData.title || "Unknown Title",
                authors, // Already normalized as an array
                thumbnail_url: bookData.imageLinks?.thumbnail || DEFAULT_IMAGE,
                published_date: bookData.publishedDate || "",
                page_count: bookData.pageCount || 0,
                categories: bookData.categories || [],
                retail_price: 0, // Default value
                currency_code: "USD", // Default value
                description:
                    bookData.description || "Description not available",
                publisher: bookData.publisher || "Publisher not available",
            };
            dispatch(setBookDetails(book));
        } catch (error) {
            console.error("Error loading book details:", error);
        }
    }

    // Function to handle saving the book status

    async function saveBookStatus(status: string) {
        if (!book) {
            return (
                <div className="mt-10 text-center">
                    <h2 className="text-xl font-semibold">Book not found</h2>
                    <p className="text-gray-600">
                        The book details you're looking for are not available.
                        Please try a different book.
                    </p>
                </div>
            );
        }

        // Map human-readable status to the corresponding BookStatus enum value
        const statusMap: Record<string, BookStatus> = {
            "Previously Read": BookStatuses.PREVIOUSLY_READ,
            "Currently Reading": BookStatuses.CURRENTLY_READING,
            "Want To Read": BookStatuses.WANT_TO_READ,
        };

        const mappedStatus = statusMap[status];
        if (!mappedStatus) {
            console.error("Unknown status:", status);
            return;
        }

        try {
            // Dispatch the thunk with the mapped status
            await dispatch(
                saveBookToServer({
                    google_books_id: book.google_books_id,
                    status: mappedStatus,
                })
            );

            console.log("Dispatched saveBookToServer"); // Confirm dispatch

            toast({
                description: `Book status saved as: ${status}`,
                variant: "default",
            });
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
                            onClick={() => saveBookStatus("Previously Read")}
                        >
                            Previously Read
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => saveBookStatus("Currently Reading")}
                        >
                            Currently Reading
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => saveBookStatus("Want To Read")}
                        >
                            Want to Read
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
