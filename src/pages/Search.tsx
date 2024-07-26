import BooksContainer from "@/components/BooksContainer";
import SearchFilters from "@/components/SearchFilters";
import Pagination from "@/components/Pagination";
import { RootState } from "@/store/rootReducer";
import { useSelector } from "react-redux";

export default function Search() {
    const books = useSelector((state: RootState) => state.search.results);
    const sortOrder = useSelector((state: RootState) => state.search.sorting);

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
