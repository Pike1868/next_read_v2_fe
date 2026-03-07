import ServerApi from "@/api/ServerAPI";
import FeaturedBookCard from "@/components/books/FeaturedBookCard";
import { Button } from "@/components/ui/button";
import { FeaturedBook, FeaturedListsResponse } from "@/types/api";
import { useEffect, useState } from "react";

export default function Featured() {
    const [featuredData, setFeaturedData] =
        useState<FeaturedListsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        fetchFeaturedLists();
    }, []);

    // Function to fetch featured lists
    async function fetchFeaturedLists() {
        setLoading(true);
        try {
            const resp = await ServerApi.getFeaturedLists();
            const uniqueBooks = deduplicateBooks(resp.data.featured_lists);
            setFeaturedData({ ...resp.data, featured_lists: uniqueBooks });
        } catch (error) {
            console.error("Error fetching featured lists:", error);
        } finally {
            setLoading(false);
        }
    }

    // Deduplication function
    function deduplicateBooks(lists: FeaturedListsResponse["featured_lists"]) {
        const bookMap = new Map<string, FeaturedBook>();

        lists.forEach((list) => {
            list.books.forEach((book) => {
                // Use a combination of title and author as the key for deduplication
                const uniqueKey = `${book.title.toLowerCase()}_${book.author.toLowerCase()}`;

                // Only add to the map if the key doesn't exist
                if (!bookMap.has(uniqueKey)) {
                    bookMap.set(uniqueKey, book);
                }
            });
        });

        // Convert map back to array of lists
        return lists.map((list) => ({
            ...list,
            books: list.books.filter((book) => {
                const uniqueKey = `${book.title.toLowerCase()}_${book.author.toLowerCase()}`;
                return bookMap.has(uniqueKey);
            }),
        }));
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Bestseller Collections
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 mb-6">
                        Discover what's trending across different genres
                    </p>
                    <Button
                        onClick={fetchFeaturedLists}
                        variant="outline"
                        className="bg-white text-green-700 hover:bg-green-50 border-0 font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh Lists"}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Loading bestseller collections...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && featuredData && featuredData.featured_lists.length === 0 && (
                    <div className="text-center py-16">
                        <div className="mb-4 text-gray-300">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747m0-13c5.5 0 10 4.745 10 10.747M9 9h6m-6 4h6m-11 5h.01M9 20h6" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No featured lists available</p>
                        <p className="text-gray-500 text-sm mt-2">Make sure your NYT API key is valid</p>
                        {featuredData.note && (
                            <p className="text-sm text-gray-400 mt-3 bg-gray-100 p-3 rounded-lg">{featuredData.note}</p>
                        )}
                    </div>
                )}

                {/* Render featured lists */}
                {!loading && featuredData && featuredData.featured_lists.length > 0 && (
                    <div className="space-y-12">
                        {featuredData.featured_lists.map((listObj) => (
                            <div key={listObj.list_name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {listObj.display_name}
                                    </h2>
                                    <div className="w-20 h-1 bg-gradient-to-r from-green-700 to-green-500 rounded-full"></div>
                                </div>

                                {/* Horizontal scroll area for the book cards */}
                                <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                                    {listObj.books.map((book, idx) => (
                                        <div key={book.google_books_id} style={{ animation: `slideInLeft 0.5s ease-out ${idx * 100}ms both` }}>
                                            <FeaturedBookCard
                                                book={book}
                                                onClick={() =>
                                                    window.location.href = `/book/${book.google_books_id}`
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
