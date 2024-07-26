import { Book } from "@/types/books";
import { Card, CardContent } from "./ui/card";

interface BooksGridProps {
    books: Book[];
}
const DEFAULT_IMAGE = "/bookcover-na.jpg";
export default function BooksGrid({ books }: BooksGridProps) {
    return (
        <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
                <Card key={book.google_books_id} className="h-full">
                    <CardContent className="p-4">
                        <img
                            src={book.thumbnail_url || DEFAULT_IMAGE}
                            alt={book.title}
                            className="object-contain w-full h-48 rounded-md"
                        />
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold capitalize">
                                {book.title}
                            </h2>
                            <h4>
                                <b>by: </b>
                                {book.authors.join(", ")}
                            </h4>
                            <p>
                                Published:{" "}
                                {new Date(book.published_date).getFullYear()}
                            </p>
                            <p>Page Count: {book.page_count}</p>
                            <p>Categories: {book.categories.join(", ")}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
