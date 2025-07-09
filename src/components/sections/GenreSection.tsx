import ServerApi from "@/api/ServerAPI";
import { Card, CardContent } from "@/components/ui/card";
import {
    setQuery,
    setSearchResults,
    setSorting,
    setStartIndex,
} from "@/features/search/searchSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function GenresSection() {
    const TOP_GENRES = [
        {
            name: "Romance",
            imgSrc: "/romance.jpg",
        },
        {
            name: "Dystopian",
            imgSrc: "/dystopian.jpg",
        },
        {
            name: "Mystery",
            imgSrc: "/mystery.jpg",
        },
        {
            name: "Fantasy",
            imgSrc: "/fantasy.jpg",
        },
        {
            name: "Science Fiction",
            imgSrc: "/science-fiction.jpg",
        },
        {
            name: "Thriller",
            imgSrc: "/thriller.jpg",
        },
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Handles the click event on a genre card.
     * Sets the search query to the selected genre, resets pagination, and
     * fetches books by the selected genre. Updates the search results in the
     * Redux store and navigates to the search page.
     * @param genre - The selected genre name.
     */
    const handleGenreClick = async (genre: string) => {
        try {
            // Set the query to the selected genre and reset startIndex and sorting
            dispatch(setQuery(genre));
            dispatch(setStartIndex(0));
            dispatch(setSorting("none"));

            // Fetch books by the selected genre
            const results = await ServerApi.searchBooksByGenre(genre);

            // Update search results in the Redux store
            dispatch(setSearchResults(results.data.books));

            // Navigate to the search page to display results
            navigate("book/search");
        } catch (error) {
            console.error("Error searching books by genre:", error);
        }
    };

    return (
        <section className="w-full px-4 sm:px-6 py-12 sm:py-20 bg-white">
            <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                Find Your Next Read By Genre
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
                {TOP_GENRES.map((genre, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden transition-transform duration-200 transform rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg flex flex-col"
                        onClick={() => handleGenreClick(genre.name)}
                    >
                        <div className="relative h-36 sm:h-40">
                            <img
                                src={genre.imgSrc}
                                alt={genre.name}
                                className="absolute inset-0 object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>
                        <CardContent className="flex items-center justify-center p-4 text-center flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold">
                                {genre.name}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
