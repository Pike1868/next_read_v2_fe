import BooksContainer from "@/components/BooksContainer";
import SearchFilters from "@/components/SearchFilters";
import { RootState } from "@/store/rootReducer";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Search() {
    const [sortOrder, setSortOrder] = useState("");
    const books = useSelector((state: RootState) => state.search.results);

    const sortedBooks = [...books].sort((a, b) => {
        if (sortOrder === "a-z") {
            return a.title.localeCompare(b.title);
        } else if (sortOrder === "z-a") {
            return b.title.localeCompare(a.title);
        } else {
            return 0;
        }
    });

    console.log(sortedBooks);
    
    return (
        <div>
            <SearchFilters sortBooks={setSortOrder} />
            {books.length > 0 ? (
                <BooksContainer books={sortedBooks} />
            ) : (
                <p className="m-8 text-center mb-96">
                    No books found. Try searching for something else!
                </p>
            )}
        </div>
    );
}
