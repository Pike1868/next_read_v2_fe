import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
    fetchUserBooks,
    removeBookFromServer,
} from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book } from "@/types/books";
import {
    BookOpenIcon,
    BookmarkIcon,
    CheckCircleIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SavedBooksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const SavedBooksModal = ({ isOpen, onClose }: SavedBooksModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("currently-reading");

    const { savedBooks, loading } = useSelector(
        (state: RootState) => state.book
    );

    const currentlyReadingCount = savedBooks.currentlyReading.length;
    const wantToReadCount = savedBooks.wantToRead.length;
    const previouslyReadCount = savedBooks.previouslyRead.length;
    const totalBooks =
        currentlyReadingCount + wantToReadCount + previouslyReadCount;
    const handleRemoveBook = async (googleBooksId: string) => {
        setIsRemoving(googleBooksId);
        try {
            await dispatch(removeBookFromServer(googleBooksId));
            await dispatch(fetchUserBooks());
            toast({
                description: "Book removed successfully",
                variant: "default",
            });
        } catch (error) {
            toast({
                description: "Failed to remove book",
                variant: "destructive",
            });
        } finally {
            setIsRemoving(null);
        }
    };

    const handleViewBook = (googleBooksId: string) => {
        navigate(`/book/${googleBooksId}`);
        onClose();
    };

    const renderBookCard = (book: Book & { status: string }) => (
        <Card key={book.google_books_id} className="flex overflow-hidden">
            <div className="w-24 h-32 min-w-24 bg-muted">
                <img
                    src={book.thumbnail_url || "/bookcover-na.jpg"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col flex-1">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-md">
                                {book.title}
                            </h3>
                            <CardDescription>
                                {book.authors?.join(", ") || "Unknown Author"}
                            </CardDescription>
                        </div>
                        {isRemoving === book.google_books_id ? (
                            <Spinner className="w-5 h-5" />
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                    handleRemoveBook(book.google_books_id)
                                }
                            >
                                <Trash2Icon className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="py-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {book.description
                            ? stripHtml(book.description)
                            : "No description available"}
                    </p>
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewBook(book.google_books_id)}
                    >
                        View Details
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        My Library
                        <Badge variant="outline" className="ml-2">
                            {totalBooks} {totalBooks === 1 ? "book" : "books"}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 overflow-hidden flex flex-col"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                            value="currently-reading"
                            className="relative"
                        >
                            <BookOpenIcon className="w-4 h-4 mr-2" />
                            Currently Reading
                            {currentlyReadingCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {currentlyReadingCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="want-to-read">
                            <BookmarkIcon className="w-4 h-4 mr-2" />
                            Want to Read
                            {wantToReadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {wantToReadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="previously-read">
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Previously Read
                            {previouslyReadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {previouslyReadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-auto p-1">
                        <TabsContent
                            value="currently-reading"
                            className="mt-0 h-full overflow-auto"
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <Spinner className="w-8 h-8" />
                                </div>
                            ) : currentlyReadingCount > 0 ? (
                                <div className="grid gap-4">
                                    {savedBooks.currentlyReading.map(
                                        renderBookCard
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center">
                                    <BookOpenIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        You have no books in this category
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={onClose}
                                    >
                                        Browse Books
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent
                            value="want-to-read"
                            className="mt-0 h-full overflow-auto"
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <Spinner className="w-8 h-8" />
                                </div>
                            ) : wantToReadCount > 0 ? (
                                <div className="grid gap-4">
                                    {savedBooks.wantToRead.map(renderBookCard)}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center">
                                    <BookmarkIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        You have no books in this category
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={onClose}
                                    >
                                        Browse Books
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent
                            value="previously-read"
                            className="mt-0 h-full overflow-auto"
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <Spinner className="w-8 h-8" />
                                </div>
                            ) : previouslyReadCount > 0 ? (
                                <div className="grid gap-4">
                                    {savedBooks.previouslyRead.map(
                                        renderBookCard
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center">
                                    <CheckCircleIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        You have no books in this category
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={onClose}
                                    >
                                        Browse Books
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="flex justify-end">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SavedBooksModal;
