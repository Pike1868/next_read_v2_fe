import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { setStartIndex, setSearchResults } from "@/features/search/searchSlice";
import ServerApi from "@/api/ServerAPI";

export default function Pagination() {
    const dispatch = useDispatch();
    const startIndex = useSelector((state: RootState) => state.search.startIndex);
    const query = useSelector((state: RootState) => state.search.query);

    const handleNextPage = async () => {
        const newIndex = startIndex + 40;
        dispatch(setStartIndex(newIndex));
        const results = await ServerApi.searchBooks(query, newIndex);
        dispatch(setSearchResults(results.books));
    };

    const handlePreviousPage = async () => {
        if (startIndex > 0) {
            const newIndex = startIndex - 40;
            dispatch(setStartIndex(newIndex));
            const results = await ServerApi.searchBooks(query, newIndex);
            dispatch(setSearchResults(results.books));
        }
    };

    return (
        <div className="flex items-center justify-center mt-4">
            <button 
                onClick={handlePreviousPage} 
                disabled={startIndex === 0} 
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="mx-4">{startIndex / 40 + 1}</span>
            <button 
                onClick={handleNextPage} 
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
                Next
            </button>
        </div>
    );
}
