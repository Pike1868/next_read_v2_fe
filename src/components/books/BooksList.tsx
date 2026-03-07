import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/books";
import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";

interface BooksListProps {
    books: Book[];
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function BooksList({ books }: BooksListProps) {
    return (
        <div className="flex flex-col mt-12 gap-4">
            {books.map((book, index) => (
                <Link
                    to={`/book/${book.google_books_id}`}
                    key={book.google_books_id}
                    className="no-underline group"
                >
                    <Card className="transition-all duration-300 hover:shadow-xl hover:border-green-400 border border-transparent bg-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-green-50 overflow-hidden"
                        style={{
                            animation: `fadeInLeft 0.5s ease-out ${index * 50}ms both`,
                        }}
                    >
                        <CardContent className="flex gap-4 md:gap-6 p-4 md:p-6">
                            <div className="flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 group-hover:border-green-400 transition-colors">
                                <img
                                    src={book.thumbnail_url || DEFAULT_IMAGE}
                                    alt={book.title}
                                    className="object-cover w-20 md:w-32 h-28 md:h-48 transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex flex-col justify-between flex-grow min-w-0">
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold capitalize text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                                        {book.title}
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-1">
                                        by <span className="font-semibold">{Array.isArray(book.authors) ? book.authors[0] : book.authors}</span>
                                    </p>
                                </div>

                                <div className="space-y-2 text-xs md:text-sm text-gray-600 mt-3 border-t border-gray-200 pt-3">
                                    <div className="flex gap-4 flex-wrap">
                                        {book.published_date && (
                                            <div>
                                                <span className="font-semibold text-gray-700">Published:</span> {new Date(book.published_date).getFullYear()}
                                            </div>
                                        )}
                                        {book.page_count && (
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span><span className="font-semibold text-gray-700">Pages:</span> {book.page_count}</span>
                                            </div>
                                        )}
                                    </div>

                                    {book.categories && book.categories.length > 0 && (
                                        <div>
                                            <span className="font-semibold text-gray-700">Categories:</span> {book.categories.join(", ")}
                                        </div>
                                    )}

                                    {book.description && (
                                        <p className="text-gray-600 line-clamp-2 italic mt-2">
                                            {book.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {book.average_rating && (
                                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-green-700 text-white px-3 py-2 rounded-lg h-fit">
                                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300 mb-1" />
                                    <span className="font-bold text-sm">{book.average_rating.toFixed(1)}</span>
                                    {book.ratings_count && (
                                        <span className="text-xs opacity-80">({book.ratings_count})</span>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}

            <style>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
