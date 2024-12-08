import { removeBookFromServer } from "@/features/book/bookSlice";
import { RootState } from "@/store/rootReducer";
import { AppDispatch } from "@/store/store";
import { Book } from "@/types/books";
import { useDispatch, useSelector } from "react-redux";

interface SavedBooksModalProps {
    onClose: () => void;
}

const SavedBooksModal = ({ onClose }: SavedBooksModalProps) => {
    const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch here
    const savedBooks = useSelector(
        (state: RootState) => state.book.savedBooks
    ) || {
        currentlyReading: [],
        wantToRead: [],
        previouslyRead: [],
    };

    // Function to handle removing a book
    const handleRemoveBook = (googleBooksId: string) => {
        dispatch(removeBookFromServer(googleBooksId)); // Dispatch the thunk
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-11/12 max-w-3xl p-6 bg-white rounded-lg"
            >
                <button
                    onClick={onClose}
                    className="close-button"
                    aria-label="Close Modal"
                >
                    Close
                </button>
                <h2 className="mb-4 text-xl font-bold">Your Saved Books</h2>

                {/* Currently Reading Section */}
                {savedBooks.currentlyReading.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-semibold">
                            Currently Reading
                        </h3>
                        <ul className="space-y-2">
                            {savedBooks.currentlyReading.map((book: Book) => (
                                <li
                                    key={book.google_books_id}
                                    className="flex items-center justify-between"
                                >
                                    <span>{book.title}</span>
                                    <button
                                        onClick={() =>
                                            handleRemoveBook(
                                                book.google_books_id
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Want to Read Section */}
                {savedBooks.wantToRead.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-semibold">
                            Want to Read
                        </h3>
                        <ul className="space-y-2">
                            {savedBooks.wantToRead.map((book: Book) => (
                                <li
                                    key={book.google_books_id}
                                    className="flex items-center justify-between"
                                >
                                    <span>{book.title}</span>
                                    <button
                                        onClick={() =>
                                            handleRemoveBook(
                                                book.google_books_id
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Previously Read Section */}
                {savedBooks.previouslyRead.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-semibold">
                            Previously Read
                        </h3>
                        <ul className="space-y-2">
                            {savedBooks.previouslyRead.map((book: Book) => (
                                <li
                                    key={book.google_books_id}
                                    className="flex items-center justify-between"
                                >
                                    <span>{book.title}</span>
                                    <button
                                        onClick={() =>
                                            handleRemoveBook(
                                                book.google_books_id
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* If no books in any category */}
                {savedBooks.currentlyReading.length === 0 &&
                    savedBooks.wantToRead.length === 0 &&
                    savedBooks.previouslyRead.length === 0 && (
                        <p>You have no saved books.</p>
                    )}
            </div>
        </div>
    );
};

export default SavedBooksModal;
