import ServerApi from "@/api/ServerAPI";
import FeaturedBookCard from "@/components/books/FeaturedBookCard";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { Button } from "@/components/ui/button";
import { FeaturedListsResponse } from "@/types/api";
import { useEffect, useState } from "react";

export default function Featured() {
    const [featuredData, setFeaturedData] =
        useState<FeaturedListsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedLists();
    }, []);

    async function fetchFeaturedLists() {
        setIsLoading(true);
        try {
            const resp = await ServerApi.getFeaturedLists();
            setFeaturedData(resp.data);
        } catch (error) {
            console.error("Error fetching featured lists:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Helper function to create more concise list titles
    const formatListName = (originalName: string) => {
        const simplifications: { [key: string]: string } = {
            "Hardcover Nonfiction": "Nonfiction Bestsellers",
            "Hardcover Fiction": "Fiction Bestsellers",
            "Paperback Nonfiction": "Paperback Nonfiction",
            "Advice How-To and Miscellaneous": "Advice & How-To",
            "Combined Print & E-Book Nonfiction": "Print & E-Book Nonfiction",
        };

        return simplifications[originalName] || originalName;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Featured Books</h1>
            <p className="mt-4 text-lg">Discover Trending Reads</p>

            <Button
                onClick={fetchFeaturedLists}
                variant="outline"
                className="mt-4 text-green-800"
            >
                Refresh Lists
            </Button>

            <div className="w-full px-4 mt-6 space-y-6">
                {isLoading && (
                    <>
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <ListSkeleton key={idx} itemCount={5} />
                        ))}
                    </>
                )}

                {!isLoading &&
                    featuredData &&
                    featuredData.featured_lists.map((listObj) => (
                        <div key={listObj.list_name} className="mb-4 w-full">
                            <h2 className="text-xl sm:text-2xl font-semibold">
                                {formatListName(listObj.display_name)}
                            </h2>
                            <hr className="my-2" />

                            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x">
                                {listObj.books.map((book) => (
                                    <div
                                        key={book.google_books_id}
                                        className="snap-start"
                                    >
                                        <FeaturedBookCard book={book} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                {!isLoading && !featuredData && (
                    <p className="text-gray-600 dark:text-gray-400">
                        No featured lists available.
                    </p>
                )}
            </div>
        </div>
    );
}
