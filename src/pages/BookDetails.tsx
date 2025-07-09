import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { BookStatuses } from "@/constants/bookStatuses";
import {
    clearBookDetails,
    fetchUserBooks,
    saveBookToServer,
    setBookDetails,
} from "@/features/book/bookSlice";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book, BookDetailsResponse } from "@/types/books";
import { BookmarkIcon, BookOpenIcon, CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

const DISPLAY_TO_STATUS = {
    "Want To Read": BookStatuses.WANT_TO_READ,
    "Currently Reading": BookStatuses.CURRENTLY_READING,
    "Previously Read": BookStatuses.PREVIOUSLY_READ,
} as const;

type DisplayStatus = keyof typeof DISPLAY_TO_STATUS;

const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export default function BookDetails() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedStatus, setSavedStatus] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);
    const book = useSelector((state: RootState) => state.book.currentBook);
    const { volume_id } = useParams<{ volume_id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const currentStatus = useSelector((state: RootState) => {
        const allBooks = [
            ...state.book.savedBooks.currentlyReading,
            ...state.book.savedBooks.wantToRead,
            ...state.book.savedBooks.previouslyRead,
        ];
        return (
            allBooks.find((b) => b?.google_books_id === book?.google_books_id)
                ?.status || null
        );
    });

    const statusOptions = [
        {
            title: "Want To Read" as DisplayStatus,
            description: "Add this book to your reading wishlist",
            icon: BookmarkIcon,
            value: DISPLAY_TO_STATUS["Want To Read"],
        },
        {
            title: "Currently Reading" as DisplayStatus,
            description: "Mark this book as in progress",
            icon: BookOpenIcon,
            value: DISPLAY_TO_STATUS["Currently Reading"],
        },
        {
            title: "Previously Read" as DisplayStatus,
            description: "Mark this book as completed",
            icon: CheckCircleIcon,
            value: DISPLAY_TO_STATUS["Previously Read"],
        },
    ];

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

            const authors = Array.isArray(bookData.authors)
                ? bookData.authors.flat()
                : [bookData.authors || "Unknown Author"];

            const thumbnail_url =
                bookData.thumbnail_url ||
                (bookData.imageLinks && bookData.imageLinks.thumbnail) ||
                DEFAULT_IMAGE;

            const normalizedBook: Book = {
                google_books_id: volumeId,
                title: bookData.title || "Unknown Title",
                authors,
                thumbnail_url,
                published_date: bookData.publishedDate || "",
                page_count: bookData.pageCount || 0,
                categories: bookData.categories || [],
                retail_price: 0,
                currency_code: "USD",
                description:
                    bookData.description || "Description not available",
                publisher: bookData.publisher || "Publisher not available",
            };

            dispatch(setBookDetails(normalizedBook));
        } catch (error) {
            console.error("Error loading book details:", error);
        }
    }

    async function saveBookStatus(displayStatus: DisplayStatus) {
        if (!book) return;

        setIsSaving(true);
        try {
            const mappedStatus = DISPLAY_TO_STATUS[displayStatus];
            await dispatch(
                saveBookToServer({
                    google_books_id: book.google_books_id,
                    status: mappedStatus,
                    bookData: book,
                })
            );

            await dispatch(fetchUserBooks());

            setSavedStatus(displayStatus);

            toast({
                description: `Book status saved as: ${displayStatus}`,
                variant: "default",
            });

            setTimeout(() => {
                setIsDialogOpen(false);
                setSavedStatus(null);
            }, 1000);
        } catch (error) {
            console.error("Failed to save book status:", error);
            toast({
                description: "Error saving book status.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (!book) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="container px-4 py-6 mx-auto">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl">
                        {book.title}
                    </CardTitle>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        by {book.authors.join(", ")}
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex justify-center md:justify-start md:flex-shrink-0">
                            <img
                                src={book.thumbnail_url || DEFAULT_IMAGE}
                                alt={book.title}
                                className="object-contain w-48 sm:w-56 rounded-lg shadow-md"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <div
                                    className={cn(
                                        "prose prose-sm sm:prose-base max-w-none text-gray-700",
                                        !isExpanded && "line-clamp-4"
                                    )}
                                >
                                    {stripHtml(book.description)}
                                </div>
                                <Button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1"
                                >
                                    {isExpanded ? "Show Less" : "Read More"}
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Publisher
                                    </p>
                                    <p className="text-sm">{book.publisher}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Published Date
                                    </p>
                                    <p className="text-sm">
                                        {book.published_date}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Pages
                                    </p>
                                    <p className="text-sm">{book.page_count}</p>
                                </div>
                                {book.categories?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Categories
                                        </p>
                                        <p className="text-sm">
                                            {book.categories.join(", ")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>

                {user && (
                    <CardFooter className="flex flex-col items-stretch sm:items-center space-y-2 pt-6">
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto">
                                    {currentStatus ? (
                                        <span className="flex items-center gap-2">
                                            <span>
                                                Current Status:{" "}
                                                {
                                                    statusOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            currentStatus
                                                    )?.title
                                                }
                                            </span>
                                            <span className="text-muted-foreground">
                                                ·
                                            </span>
                                            <span className="text-muted-foreground">
                                                Change
                                            </span>
                                        </span>
                                    ) : (
                                        "Update Reading Status"
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Update Reading Status
                                    </DialogTitle>
                                    <DialogDescription>
                                        Choose the reading status for "
                                        {book.title}"
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {statusOptions.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start gap-2 h-auto p-4",
                                                savedStatus === option.title &&
                                                    "bg-green-50 border-green-500",
                                                currentStatus ===
                                                    option.value &&
                                                    "border-primary"
                                            )}
                                            disabled={isSaving}
                                            onClick={() =>
                                                saveBookStatus(option.title)
                                            }
                                        >
                                            {savedStatus === option.title ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <option.icon className="h-5 w-5" />
                                            )}
                                            <div className="text-left">
                                                <div className="font-semibold">
                                                    {option.title}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {option.description}
                                                </div>
                                            </div>
                                            {isSaving &&
                                                savedStatus ===
                                                    option.title && (
                                                    <div className="ml-auto">
                                                        <Spinner className="w-4 h-4" />
                                                    </div>
                                                )}
                                        </Button>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
