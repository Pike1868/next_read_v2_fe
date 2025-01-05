import ServerApi from "@/api/ServerAPI";
import FeaturedBookCard from "@/components/books/FeaturedBookCard";
import { Button } from "@/components/ui/button";
import { FeaturedBook, FeaturedListsResponse } from "@/types/api";
import { useEffect, useState } from "react";

export default function Featured() {
    const [featuredData, setFeaturedData] =
        useState<FeaturedListsResponse | null>(null);

    // Fetch data on mount
    useEffect(() => {
        fetchFeaturedLists();
    }, []);

    // Function to fetch featured lists
    async function fetchFeaturedLists() {
        try {
            const resp = await ServerApi.getFeaturedLists();
            console.log("API Response:", resp.data);

            // Log the image URLs for debugging
            resp.data.featured_lists.forEach((list) => {
                list.books.forEach((book) => {
                    console.log("Book Image:", book.book_image);
                    console.log("Google Thumbnail:", book.google_thumbnail_url);
                });
            });

            const uniqueBooks = deduplicateBooks(resp.data.featured_lists);
            console.log(uniqueBooks);
            setFeaturedData({ ...resp.data, featured_lists: uniqueBooks });
        } catch (error) {
            console.error("Error fetching featured lists:", error);
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

    // Render the featured lists
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Featured</h1>
            <p className="mt-4 text-lg">Find Your Next Read By Genre</p>

            {/* Button to manually fetch if you prefer */}
            <Button
                onClick={fetchFeaturedLists}
                variant="outline"
                className="mt-4 text-green-800"
            >
                Fetch and log featured lists
            </Button>

            {/* Render featured lists */}
            {featuredData && (
                <div className="w-full px-4 mt-6 space-y-6">
                    {featuredData.featured_lists.map((listObj) => (
                        <div key={listObj.list_name} className="mb-4">
                            <h2 className="text-2xl font-semibold">
                                {listObj.display_name}
                            </h2>
                            <hr className="my-2" />

                            {/* Horizontal scroll area for the book cards */}
                            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                                {listObj.books.map((book) => (
                                    <FeaturedBookCard
                                        key={book.google_books_id}
                                        book={book}
                                        onClick={() =>
                                            console.log(
                                                "Book card clicked:",
                                                book
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
