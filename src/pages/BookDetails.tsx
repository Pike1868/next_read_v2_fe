import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { clearBookDetails, setBookDetails } from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BookDetails() {
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
            dispatch(setBookDetails(response.data.book)); // Dispatch to Redux store
        } catch (error) {
            console.error("Failed to load book details:", error);
            toast({
                description: "Failed to load book details. Please try again.",
                variant: "destructive",
            });
        }
    }

    if (!book) {
        return <div>Loading...</div>; // Show loading state until book is available
    }

    return (
        <Card className="w-full max-w-3xl mx-auto ">
            <CardHeader className="mb-4">
                <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div>
                    <img
                        src={book.imageLinks?.thumbnail || DEFAULT_IMAGE}
                        alt={book.title}
                        className="object-contain w-full max-w-xs mx-auto rounded-md max-h-80"
                    />

                    <div
                        dangerouslySetInnerHTML={{
                            __html: isExpanded
                                ? book.description ||
                                  "Description not available" // Fallback text if description is missing
                                : (book.description?.slice(0, 300) ||
                                      "Description not available") + "...", // Safely slice if description exists
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
                        Published Date: {book.publishedDate}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
