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
import ServerApi from "@/api/ServerAPI";

export default function Searchbar() {
    const [query, setQueryLocal] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to handle the search action
    const handleSearch = async () => {
        console.log("handleSearch called with query:", query);

        // Update Redux store with new search query, reset start index, and set default sorting
        dispatch(setQuery(query));
        dispatch(setStartIndex(0));
        dispatch(setSorting("none"));

        try {
            // Fetch search results from the API
            const results = await ServerApi.searchBooks(query, 0);
            console.log("Search Results: ", results.books);

            // Update Redux store with search results
            dispatch(setSearchResults(results.books));

            // Navigate to the search results page
            navigate("book/search");
        } catch (error) {
            console.error("Error searching books, ", error);
        }
    };

    // Function to handle "Enter" key press in the search input
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex py-4">
            <div className="flex max-h-20">
                <Input
                    className="p-2 px-4 py-2 text-black rounded-l-full "
                    placeholder="Search for books here..."
                    value={query}
                    onChange={(e) => setQueryLocal(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    className="flex items-center px-4 py-2 text-white bg-green-800 rounded-r-full hover:bg-green-500"
                    onClick={handleSearch}
                >
                    <FaSearch className="mr-2" />
                    Search
                </Button>
            </div>
        </div>
    );
}
