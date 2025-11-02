import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BookStatuses, BookStatus } from "@/constants/bookStatuses";
import {
  fetchUserBooks,
  removeBookFromServer,
  saveBookToServer,
} from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book } from "@/types/books";
import { AlertCircle, BookMarked, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_IMAGE = "/bookcover-na.jpg";

const statusConfig: Record<BookStatus, { label: string; color: string; bgColor: string }> = {
  [BookStatuses.CURRENTLY_READING]: {
    label: "Reading",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  [BookStatuses.PREVIOUSLY_READ]: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  [BookStatuses.WANT_TO_READ]: {
    label: "Want to Read",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
};

interface TabConfig {
  id: BookStatus;
  label: string;
  count: number;
}

export default function MyBooks() {
  const dispatch = useDispatch<AppDispatch>();
  const savedBooks = useSelector((state: RootState) => state.book.savedBooks);
  const [activeTab, setActiveTab] = useState<BookStatus>(BookStatuses.CURRENTLY_READING);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchUserBooks());
      } catch (error) {
        toast({
          description: "Failed to load your library",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, [dispatch]);

  const getBooksForTab = (): (Book & { status: BookStatus })[] => {
    switch (activeTab) {
      case BookStatuses.CURRENTLY_READING:
        return savedBooks.currentlyReading;
      case BookStatuses.PREVIOUSLY_READ:
        return savedBooks.previouslyRead;
      case BookStatuses.WANT_TO_READ:
        return savedBooks.wantToRead;
      default:
        return [];
    }
  };

  const tabs: TabConfig[] = [
    {
      id: BookStatuses.CURRENTLY_READING,
      label: "Reading",
      count: savedBooks.currentlyReading.length,
    },
    {
      id: BookStatuses.PREVIOUSLY_READ,
      label: "Completed",
      count: savedBooks.previouslyRead.length,
    },
    {
      id: BookStatuses.WANT_TO_READ,
      label: "Want to Read",
      count: savedBooks.wantToRead.length,
    },
  ];

  const booksInTab = getBooksForTab();

  const handleStatusChange = async (bookId: string, newStatus: BookStatus) => {
    setChangingStatus(bookId);
    try {
      await dispatch(saveBookToServer({ google_books_id: bookId, status: newStatus }));
      setActiveTab(newStatus);
      toast({
        description: "Book status updated",
      });
    } catch (error) {
      toast({
        description: "Failed to update book status",
        variant: "destructive",
      });
    } finally {
      setChangingStatus(null);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    setRemovingId(bookId);
    try {
      await dispatch(removeBookFromServer(bookId));
      setShowRemoveDialog(null);
      toast({
        description: "Book removed from library",
      });
    } catch (error) {
      toast({
        description: "Failed to remove book",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="w-8 h-8 md:w-10 md:h-10 text-gray-700" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            My Library
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          Manage your reading collection
        </p>
      </div>

      <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs md:text-sm">({tab.count})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      ) : booksInTab.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
            No books yet
          </h3>
          <p className="text-gray-600 text-sm md:text-base max-w-sm">
            Start adding books to your {statusConfig[activeTab].label.toLowerCase()} list
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {booksInTab.map((book) => (
            <Card
              key={book.google_books_id}
              className="h-full flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-3 md:p-4 flex-1">
                <div className="mb-3">
                  <img
                    src={book.thumbnail_url || DEFAULT_IMAGE}
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-1">
                  {book.authors.join(", ")}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 p-3 md:p-4 border-t">
                <div
                  className={`w-full text-center px-2 py-1 rounded text-xs md:text-sm font-medium ${statusConfig[activeTab].color} ${statusConfig[activeTab].bgColor}`}
                >
                  {statusConfig[activeTab].label}
                </div>

                <Select
                  value={activeTab}
                  onValueChange={(value) =>
                    handleStatusChange(book.google_books_id, value as BookStatus)
                  }
                  disabled={changingStatus === book.google_books_id}
                >
                  <SelectTrigger className="h-8 md:h-9 text-xs md:text-sm">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BookStatuses.CURRENTLY_READING}>
                      {statusConfig[BookStatuses.CURRENTLY_READING].label}
                    </SelectItem>
                    <SelectItem value={BookStatuses.PREVIOUSLY_READ}>
                      {statusConfig[BookStatuses.PREVIOUSLY_READ].label}
                    </SelectItem>
                    <SelectItem value={BookStatuses.WANT_TO_READ}>
                      {statusConfig[BookStatuses.WANT_TO_READ].label}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  {showRemoveDialog === book.google_books_id && (
                    <div className="absolute bottom-full mb-2 bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-10">
                      <p className="mb-2">Remove this book?</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRemoveDialog(null)}
                          className="h-6 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRemoveBook(book.google_books_id)}
                          disabled={removingId === book.google_books_id}
                          className="h-6 text-xs bg-red-600 hover:bg-red-700"
                        >
                          {removingId === book.google_books_id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 md:h-9 text-xs md:text-sm text-red-600 hover:bg-red-50"
                    onClick={() =>
                      setShowRemoveDialog(
                        showRemoveDialog === book.google_books_id ? null : book.google_books_id
                      )
                    }
                    disabled={removingId === book.google_books_id}
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden md:inline">Remove</span>
                    <span className="md:hidden">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
