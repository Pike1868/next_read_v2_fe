import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/books";
import { Link } from "react-router-dom";

interface BooksListProps {
    books: Book[];
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BooksList({ books }: BooksListProps) {
    return (
        <div className="flex flex-col mt-12 gap-y-8">
            {books.map((book) => (
                <Link
                    to={`/book/${book.google_books_id}`}
                    key={book.google_books_id}
                    className="no-underline"
                >
                    <Card>
                        <CardContent className="flex p-8 gap-x-4">
                            <img
                                src={book.thumbnail_url || DEFAULT_IMAGE}
                                alt={book.title}
                                className="object-contain w-32 h-32 rounded-md"
                            />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-xl font-semibold capitalize">
                                    {book.title}
                                </h2>
                                <h4>{book.authors.join(", ")}</h4>
                                <p>
                                    Published Date:{" "}
                                    {new Date(
                                        book.published_date
                                    ).getFullYear()}
                                </p>
                                <p>Page Count: {book.page_count}</p>
                                <p>Categories: {book.categories.join(", ")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
