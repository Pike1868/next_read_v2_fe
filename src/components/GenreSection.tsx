import ServerApi from "@/api/ServerAPI";
import {
    setQuery,
    setSearchResults,
    setSorting,
    setStartIndex,
} from "@/features/search/searchSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

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
            dispatch(setSearchResults(results.books));

            // Navigate to the search page to display results
            navigate("/search");
        } catch (error) {
            console.error("Error searching books by genre:", error);
        }
    };

    return (
        <section className="w-full px-6 py-20 bg-white">
            <h2 className="mb-8 text-4xl font-bold text-center">
                Find Your Next Read By Genre
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
                {TOP_GENRES.map((genre, index) => (
                    <Card
                        key={index}
                        className="w-full max-w-sm p-0 overflow-hidden transition-transform duration-200 transform rounded-lg shadow-md cursor-pointer hover:scale-105"
                        onClick={() => handleGenreClick(genre.name)}
                    >
                        <img
                            src={genre.imgSrc}
                            alt={genre.name}
                            className="object-cover w-full h-48 rounded-t-lg"
                        />
                        <CardContent className="h-full p-4 text-center bg-white ">
                            <h3 className="ml-4 text-xl font-semibold ">
                                {genre.name}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
