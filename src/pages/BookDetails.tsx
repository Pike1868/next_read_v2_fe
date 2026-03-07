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
import { clearBookDetails, setBookDetails, saveBookToServer, fetchUserBooks } from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book, BookDetailsResponse } from "@/types/books";
import FreeReadButton from "@/components/books/FreeReadButton";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BookStatuses } from "@/constants/bookStatuses";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BookDetails() {
    const user = useSelector((state: RootState) => state.user.user);
    const { volume_id } = useParams<{ volume_id: string }>();
    const book = useSelector((state: RootState) => state.book.currentBook);
    const dispatch = useDispatch<AppDispatch>();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        dispatch(clearBookDetails());
        if (volume_id) {
            loadBookDetails(volume_id, dispatch);
        }
    }, [volume_id, dispatch]);

    async function loadBookDetails(volumeId: string, dispatch: AppDispatch) {
        try {
            const response = await ServerApi.getBookDetails(volumeId);
            const bookData: BookDetailsResponse = response.data.book;

            const book: Book = {
                google_books_id: volumeId,
                title: bookData.title || "Unknown Title",
                authors: bookData.authors || ["Unknown Author"],
                thumbnail_url: bookData.imageLinks?.thumbnail || DEFAULT_IMAGE,
                published_date: bookData.publishedDate || "",
                page_count: bookData.pageCount || 0,
                categories: bookData.categories || [],
                retail_price: 0,
                currency_code: "USD",
                description:
                    bookData.description || "Description not available",
                publisher: bookData.publisher || "Publisher not available",
            };

            dispatch(setBookDetails(book));
        } catch {
            toast({
                description: "Failed to load book details. Please try again.",
                variant: "destructive",
            });
        }
    }

    async function saveBookStatus(status: string) {
        if (!book) return;
        try {
            let mappedStatus: string;
            switch (status) {
                case "Previously Read":
                    mappedStatus = BookStatuses.PREVIOUSLY_READ;
                    break;
                case "Currently Reading":
                    mappedStatus = BookStatuses.CURRENTLY_READING;
                    break;
                case "Want To Read":
                    mappedStatus = BookStatuses.WANT_TO_READ;
                    break;
                default:
                    return;
            }
            await dispatch(saveBookToServer({
                google_books_id: book.google_books_id,
                status: mappedStatus,
            }));

            await dispatch(fetchUserBooks());

            toast({
                description: `Book status saved as: ${status}`,
                variant: "default",
            });
        } catch {
            toast({
                description: "Error saving book status.",
                variant: "destructive",
            });
        }
    }

    if (!book) {
        return (
            <div className="w-full max-w-3xl mx-auto space-y-4 py-8" role="status">
                <span className="sr-only">Loading...</span>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-80 w-full max-w-xs mx-auto bg-gray-200 rounded-md animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="mb-4">
                    <CardTitle>{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <div>
                        <motion.img
                            src={book.thumbnail_url || DEFAULT_IMAGE}
                            alt={book.title}
                            className="object-contain w-full max-w-xs mx-auto rounded-md max-h-80"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(isExpanded
                                    ? book.description
                                    : book.description.slice(0, 300) + "..."),
                            }}
                            className={`max-w-full text-gray-700 mt-4 ${
                                isExpanded
                                    ? "max-h-none"
                                    : "max-h-60 overflow-hidden"
                            } transition-all duration-300 ease-in-out`}
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
                        <div className="mt-4">
                            <FreeReadButton
                                googleBooksId={book.google_books_id}
                                bookTitle={book.title}
                            />
                        </div>
                    </div>
                </CardContent>

                <AnimatePresence>
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardFooter className="flex flex-col items-center space-y-2">
                                <p className="text-lg font-semibold">
                                    Add to your reading list:
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => saveBookStatus("Previously Read")}
                                        className="hover:bg-green-50 hover:border-green-300 transition-colors"
                                    >
                                        Previously Read
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => saveBookStatus("Currently Reading")}
                                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    >
                                        Currently Reading
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => saveBookStatus("Want To Read")}
                                        className="hover:bg-amber-50 hover:border-amber-300 transition-colors"
                                    >
                                        Want to Read
                                    </Button>
                                </div>
                            </CardFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
