import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    setQuery,
    setSearchResults,
    setSorting,
    setStartIndex,
} from "@/features/search/searchSlice";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
    const [query, setQueryLocal] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to handle the search action
    const handleSearch = async () => {
        if (!query.trim() || isSearching) return;

        console.log("handleSearch called with query:", query);
        setIsSearching(true);

        // Update Redux store with new search query, reset start index, and set default sorting
        dispatch(setQuery(query));
        dispatch(setStartIndex(0));
        dispatch(setSorting("none"));

        try {
            // Fetch search results from the API
            const results = await ServerApi.searchBooks(query, 0);
            console.log("Search Results: ", results.data.books);

            // Update Redux store with search results
            dispatch(setSearchResults(results.data.books));

            // Navigate to the search results page
            navigate("/book/search");
        } catch (error) {
            console.error("Error searching books, ", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Function to handle "Enter" key press in the search input
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex w-full max-w-full">
            <div className="flex w-full">
                <Input
                    className="p-2 px-4 py-2 text-black rounded-l-md sm:rounded-l-full flex-1 min-w-0"
                    placeholder="Search for books..."
                    value={query}
                    onChange={(e) => setQueryLocal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSearching}
                />
                <Button
                    className="flex items-center px-3 sm:px-4 py-2 text-white bg-green-800 rounded-r-md sm:rounded-r-full hover:bg-green-700 disabled:bg-green-600"
                    onClick={handleSearch}
                    disabled={isSearching || !query.trim()}
                >
                    {isSearching ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                        <FaSearch className="mr-2" />
                    )}
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </div>
        </div>
    );
}
