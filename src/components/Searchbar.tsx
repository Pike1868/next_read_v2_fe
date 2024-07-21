import { Book } from "@/types/books";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ServerApi from "../api/ServerAPI";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Searchbar() {
    const [query, setQuery] = useState("");
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const handleSearch = async () => {
        console.log("handleSearch called with query:", query);
        try {
            const results = await ServerApi.searchBooks(query);
            setBookResults(results.books);
            console.log("Search Results: ", results.books);
        } catch (error) {
            console.error("Error searching books, ", error);
        }
    };
    return (
        <div className="flex justify-center w-full py-4 ">
            <div className="flex max-h-20">
                <Input
                    className="p-2 px-4 py-2 text-black rounded-l-full"
                    placeholder="Search for books here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
