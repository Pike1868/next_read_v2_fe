import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/books";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface BooksGridProps {
    books: Book[];
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BooksGrid({ books }: BooksGridProps) {
    return (
        <div className="grid gap-4 md:gap-6 mt-8 md:mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book, index) => (
                <Link
                    to={`/book/${book.google_books_id}`}
                    key={book.google_books_id}
                    className="no-underline group"
                >
                    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 group-hover:border-green-400 border border-transparent bg-white overflow-hidden rounded-lg"
                        style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 50}ms both`,
                        }}
                    >
                        <CardContent className="p-3 md:p-4 flex flex-col h-full">
                            <div className="aspect-[3/4] relative mb-3 overflow-hidden rounded-lg">
                                <img
                                    src={book.thumbnail_url || DEFAULT_IMAGE}
                                    alt={book.title}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {book.average_rating && (
                                    <div className="absolute top-2 right-2 bg-green-700 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-md">
                                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                                        {book.average_rating.toFixed(1)}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 flex-grow">
                                <h2 className="text-sm md:text-base lg:text-lg font-semibold line-clamp-2 capitalize text-gray-800 group-hover:text-green-700 transition-colors">
                                    {book.title}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-1">
                                    <span className="font-medium">by:</span> {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                                </p>
                                <div className="space-y-1 text-xs md:text-sm text-gray-500 border-t pt-2">
                                    {book.published_date && (
                                        <p>
                                            <span className="font-medium">Published:</span> {new Date(book.published_date).getFullYear()}
                                        </p>
                                    )}
                                    {book.page_count && (
                                        <p>
                                            <span className="font-medium">Pages:</span> {book.page_count}
                                        </p>
                                    )}
                                    {book.categories && book.categories.length > 0 && (
                                        <p className="line-clamp-1">
                                            <span className="font-medium">Category:</span> {book.categories[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
