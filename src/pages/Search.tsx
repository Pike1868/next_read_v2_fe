import BooksContainer from "@/components/books/BooksContainer";
import Pagination from "@/components/books/Pagination";
import SearchFilters from "@/components/books/SearchFilters";
import {
    setQuery,
    setSearchResults,
    setSorting,
    setStartIndex,
} from "@/features/search/searchSlice";
import { RootState } from "@/store/rootReducer";
import { BookFilterOptions } from "@/types/books";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Search() {
    const dispatch = useDispatch();
    const books = useSelector((state: RootState) => state.search.results);
    const sortOrder = useSelector((state: RootState) => state.search.sorting);

    useEffect(() => {
        const storedResults = sessionStorage.getItem("searchResults");
        const storedQuery = sessionStorage.getItem("searchQuery");
        const storedStartIndex = sessionStorage.getItem("startIndex");
        const storedSorting = sessionStorage.getItem("sorting");

        if (storedResults && storedQuery && storedStartIndex && storedSorting) {
            dispatch(setSearchResults(JSON.parse(storedResults)));
            dispatch(setQuery(storedQuery));
            dispatch(setStartIndex(JSON.parse(storedStartIndex)));
            dispatch(setSorting(storedSorting as BookFilterOptions));
        }
    }, [dispatch]);

    const sortedBooks = [...books].sort((a, b) => {
        switch (sortOrder) {
            case "a-z":
                return a.title.localeCompare(b.title);
            case "z-a":
                return b.title.localeCompare(a.title);
            case "author":
                const aAuthor = Array.isArray(a.authors) ? a.authors[0] || "" : a.authors || "";
                const bAuthor = Array.isArray(b.authors) ? b.authors[0] || "" : b.authors || "";
                return aAuthor.localeCompare(bAuthor);
            case "year":
                return (
                    new Date(b.published_date).getFullYear() -
                    new Date(a.published_date).getFullYear()
                );
            case "page length":
                return a.page_count - b.page_count;
            case "categories":
                return (a.categories[0] || "").localeCompare(b.categories[0] || "");
            default:
                return 0;
        }
    });

    return (
        <div className="w-full max-w-7xl mx-auto">
            <SearchFilters />
            {books.length > 0 ? (
                <>
                    <BooksContainer books={sortedBooks} />
                    <Pagination />
                </>
            ) : (
                <div className="text-center py-16 md:py-24">
                    <p className="text-base md:text-lg text-gray-600 mb-4">
                        No books found
                    </p>
                    <p className="text-sm md:text-base text-gray-500">
                        Try searching for something else!
                    </p>
                </div>
            )}
        </div>
    );
}
