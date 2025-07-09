import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FeaturedBook } from "@/types/api";
import { useNavigate } from "react-router-dom";

interface FeaturedBookCardProps {
    book: FeaturedBook;
    onClick?: () => void;
}

export default function FeaturedBookCard({ book }: FeaturedBookCardProps) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/book/${book.google_books_id}`);
    };

    const imgSrc =
        book.thumbnail_url ||
        book.book_image ||
        book.google_thumbnail_url ||
        "/fallback.png";

    return (
        <Card
            className={cn(
                "group w-32 sm:w-36 md:w-40 lg:w-48 overflow-hidden cursor-pointer shrink-0",
                "hover:shadow-lg transition-all duration-200 ease-in-out",
                "border border-gray-200 hover:border-primary/50",
                "h-[280px] sm:h-[320px]"
            )}
            onClick={handleCardClick}
        >
            <CardHeader className="p-2 h-[60px] flex-shrink-0">
                <CardTitle
                    className={cn(
                        "text-[11px] sm:text-xs font-semibold leading-tight",
                        "line-clamp-2 overflow-hidden",
                        "group-hover:text-primary transition-colors"
                    )}
                >
                    {book.title || "Untitled"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 flex flex-col h-[calc(100%-60px)]">
                <div className="aspect-[2/3] relative mb-2 overflow-hidden rounded-sm flex-shrink-0">
                    {book.rank && (
                        <div className="absolute top-2 right-2 z-10">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-[10px] font-medium rounded-full bg-white/90 text-primary shadow-sm">
                                #{book.rank}
                            </span>
                        </div>
                    )}
                    <img
                        src={imgSrc}
                        alt={book.title || "No title available"}
                        className={cn(
                            "object-cover w-full h-full",
                            "transform group-hover:scale-105 transition-transform duration-200"
                        )}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "/fallback.png";
                        }}
                    />
                </div>
                <div className="mt-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 w-full">
                        by {book.author || "Unknown"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
