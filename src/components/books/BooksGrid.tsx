import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/books";
import { Link } from "react-router-dom";

interface BooksGridProps {
    books: Book[];
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BooksGrid({ books }: BooksGridProps) {
    return (
        <div className="grid gap-4 mt-6 sm:mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
                <Link
                    to={`/book/${book.google_books_id}`}
                    key={book.google_books_id}
                    className="no-underline"
                >
                    <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <img
                                    src={book.thumbnail_url || DEFAULT_IMAGE}
                                    alt={book.title}
                                    className="object-contain w-full sm:w-24 h-40 sm:h-32 rounded-md mx-auto sm:mx-0"
                                />
                                <div className="mt-2 sm:mt-0">
                                    <h2 className="text-md sm:text-lg font-semibold capitalize line-clamp-2">
                                        {book.title}
                                    </h2>
                                    <h4 className="text-sm line-clamp-1">
                                        <b>by: </b>
                                        {book.authors.join(", ")}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Published:{" "}
                                        {new Date(
                                            book.published_date
                                        ).getFullYear()}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Page Count: {book.page_count}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                                        Categories: {book.categories.join(", ")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
