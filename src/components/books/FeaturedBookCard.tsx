import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeaturedBook } from "@/types/api";

interface FeaturedBookCardProps {
    book: FeaturedBook;
    onClick: () => void;
}

export default function FeaturedBookCard({
    book,
    onClick,
}: FeaturedBookCardProps) {
    const imgSrc =
        book.thumbnail_url ||
        book.book_image ||
        book.google_thumbnail_url ||
        "/fallback.png";

    return (
        <Card
            className="w-40 overflow-hidden cursor-pointer sm:w-48 md:w-56 lg:w-64 shrink-0"
            onClick={onClick}
        >
            <CardHeader className="p-2">
                <CardTitle className="text-sm line-clamp-2">
                    {book.title || "Untitled"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <img
                    src={imgSrc}
                    alt={book.title || "No title available"}
                    className="object-contain w-auto h-48 mb-2"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/fallback.png";
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    by {book.author || "Unknown"}
                </p>
                {book.rank && (
                    <p className="text-xs text-muted-foreground">
                        Rank: {book.rank}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
