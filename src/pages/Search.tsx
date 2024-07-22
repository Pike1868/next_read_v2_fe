import BooksContainer from "@/components/BooksContainer";
import Searchbar from "@/components/Searchbar";
import { RootState } from "@/store/rootReducer";
import { useSelector } from "react-redux";

export default function Search() {
    const books = useSelector((state: RootState) => state.search.results);

    return (
        <div>
            <Searchbar />
            {books.length > 0 ? (
                <BooksContainer books={books} />
            ) : (
                <p>No books found. Try searching for something else!</p>
            )}
        </div>
    );
}
