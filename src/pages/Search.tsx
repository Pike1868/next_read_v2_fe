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
                return a.authors[0].localeCompare(b.authors[0]);
            case "year":
                return (
                    new Date(b.published_date).getFullYear() -
                    new Date(a.published_date).getFullYear()
                );
            case "page length":
                return a.page_count - b.page_count;
            case "categories":
                return a.categories[0].localeCompare(b.categories[0]);
            default:
                return 0;
        }
    });

    return (
        <div>
            <SearchFilters />
            {books.length > 0 ? (
                <>
                    <BooksContainer books={sortedBooks} />
                    <Pagination />
                </>
            ) : (
                <p className="m-8 text-center mb-96">
                    No books found. Try searching for something else!
                </p>
            )}
        </div>
    );
}
