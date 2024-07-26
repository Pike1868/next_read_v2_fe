import { Book } from "@/types/books";
import { Card, CardContent } from "@/components/ui/card";

interface BooksListProps {
    books: Book[];
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BooksList({ books }: BooksListProps) {
    return (
        <div className="flex flex-col mt-12 gap-y-8">
            {books.map((book) => (
                <Card key={book.google_books_id}>
                    <CardContent className="flex p-8 gap-x-4">
                        <img
                            src={
                                book.thumbnail_url !== ""
                                    ? book.thumbnail_url
                                    : DEFAULT_IMAGE
                            }
                            alt={book.title}
                            className="object-contain w-32 h-32 rounded-md"
                        />
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-semibold capitalize">
                                {book.title}
                            </h2>
                            <h4>{book.authors.join(", ")}</h4>
                            <p>Published Date: {new Date(book.published_date).getFullYear()}</p>
                            <p>Page Count: {book.page_count}</p>
                            <p>Categories: {book.categories.join(", ")}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
