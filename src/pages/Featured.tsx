import ServerApi from "@/api/ServerAPI";
import FeaturedBookCard from "@/components/books/FeaturedBookCard";
import ListSkeleton from "@/components/skeletons/ListSkeleton"; // Import the skeleton
import { Button } from "@/components/ui/button";
import { FeaturedListsResponse } from "@/types/api";
import { useEffect, useState } from "react";

export default function Featured() {
    const [featuredData, setFeaturedData] =
        useState<FeaturedListsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // Fetch data on mount
    useEffect(() => {
        fetchFeaturedLists();
    }, []);

    // Function to fetch featured lists
    async function fetchFeaturedLists() {
        setIsLoading(true); // Set loading state to true
        try {
            const resp = await ServerApi.getFeaturedLists();
            setFeaturedData(resp.data);
        } catch (error) {
            console.error("Error fetching featured lists:", error);
        } finally {
            setIsLoading(false); // Set loading state to false after fetching
        }
    }

    // Render the featured lists
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Header Section */}
            <h1 className="text-4xl font-bold">Featured</h1>
            <p className="mt-4 text-lg">Find Your Next Read By Genre</p>

            <Button
                onClick={fetchFeaturedLists}
                variant="outline"
                className="mt-4 text-green-800"
            >
                Refresh Lists
            </Button>

            {/* Featured Lists Section */}
            <div className="w-full px-4 mt-6 space-y-6">
                {isLoading && (
                    <>
                        {/* Render 3 skeletons uniformly */}
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <ListSkeleton key={idx} itemCount={5} />
                        ))}
                    </>
                )}

                {!isLoading &&
                    featuredData &&
                    featuredData.featured_lists.map((listObj) => (
                        <div key={listObj.list_name} className="mb-4">
                            {/* List Title */}
                            <h2 className="text-2xl font-semibold">
                                {listObj.display_name}
                            </h2>
                            <hr className="my-2" />

                            {/* Books in the list */}
                            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                                {listObj.books.map((book) => (
                                    <FeaturedBookCard
                                        key={book.google_books_id}
                                        book={book}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                {/* Fallback Message */}
                {!isLoading && !featuredData && (
                    <p className="text-gray-600 dark:text-gray-400">
                        No featured lists available.
                    </p>
                )}
            </div>
        </div>
    );
}
