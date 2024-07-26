import { setSearchResults, setQuery, setStartIndex } from "@/features/search/searchSlice";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ServerApi from "../api/ServerAPI";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Searchbar() {
    const [query, setQueryLocal] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = async () => {
        console.log("handleSearch called with query:", query);
        dispatch(setQuery(query));
        dispatch(setStartIndex(0)); // Reset startIndex to 0 for new search
        try {
            const results = await ServerApi.searchBooks(query, 0);
            console.log("Search Results: ", results.books);
            dispatch(setSearchResults(results.books));
            navigate("/search");
        } catch (error) {
            console.error("Error searching books, ", error);
        }
    };

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
