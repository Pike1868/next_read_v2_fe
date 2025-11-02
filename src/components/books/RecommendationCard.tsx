import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecommendationBook } from "@/types/api";

interface RecommendationCardProps {
    book: RecommendationBook;
    onSave?: (bookId: string) => void;
    isSaving?: boolean;
}

export default function RecommendationCard({
    book,
    onSave,
    isSaving = false,
}: RecommendationCardProps) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/book/${book.google_books_id}`);
    };

    const handleSave = () => {
        onSave?.(book.google_books_id);
    };

    const rating = book.average_rating ? parseFloat(book.average_rating.toString()).toFixed(1) : "N/A";
    const ratingCount = book.ratings_count ? book.ratings_count.toLocaleString() : "0";

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
            {/* Book Cover */}
            <div className="relative w-full bg-gray-100 h-64 overflow-hidden group">
                <img
                    src={book.thumbnail_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Recommendation Score Badge */}
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {Math.round(book.score)}% Match
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Title and Author */}
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    by {book.authors?.join(", ") || "Unknown"}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-lg ${
                                    i < Math.floor(parseFloat(rating))
                                        ? "text-yellow-400"
                                        : i < parseFloat(rating)
                                        ? "text-yellow-400 opacity-50"
                                        : "text-gray-300"
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-gray-700 font-semibold">{rating}</span>
                    <span className="text-xs text-gray-500">({ratingCount} ratings)</span>
                </div>

                {/* Reasons */}
                <div className="mb-4 flex-1">
                    <p className="text-xs font-semibold text-green-700 mb-2">Why recommended:</p>
                    <div className="space-y-1">
                        {book.reasons.slice(0, 2).map((reason, idx) => (
                            <p key={idx} className="text-xs text-gray-600 flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>{reason}</span>
                            </p>
                        ))}
                    </div>
                </div>

                {/* Description */}
                {book.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {book.description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        onClick={handleViewDetails}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        View Details
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50 text-sm"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
