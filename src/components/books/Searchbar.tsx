import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    setQuery,
    setSearchResults,
    setSorting,
    setStartIndex,
} from "@/features/search/searchSlice";
import { useState } from "react";
import { Search, Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ServerApi from "@/api/ServerAPI";

export default function Searchbar() {
    const [query, setQueryLocal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        dispatch(setQuery(query));
        dispatch(setStartIndex(0));
        dispatch(setSorting("none"));

        try {
            const results = await ServerApi.searchBooks(query, 0);
            dispatch(setSearchResults(results.data.books));
            navigate("/book/search");
        } catch (error) {
            console.error("Error searching books, ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
            className="w-full"
        >
            <div className="flex gap-2 w-full">
                <Input
                    type="text"
                    placeholder="Search by title, author, or genre..."
                    value={query}
                    onChange={(e) => setQueryLocal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:border-green-400 focus:outline-none bg-white text-black placeholder-gray-500 transition-colors"
                />
                <Button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline font-medium">
                        {isLoading ? "Searching..." : "Search"}
                    </span>
                </Button>
            </div>
        </form>
    );
}
