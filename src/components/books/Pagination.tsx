import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { setStartIndex, setSearchResults } from "@/features/search/searchSlice";
import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Pagination() {
    const dispatch = useDispatch();
    const startIndex = useSelector((state: RootState) => state.search.startIndex);
    const query = useSelector((state: RootState) => state.search.query);
    const books = useSelector((state: RootState) => state.search.results);
    const [isLoading, setIsLoading] = useState(false);

    const currentPage = Math.floor(startIndex / 5) + 1;
    const BOOKS_PER_PAGE = 5;
    const hasMoreBooks = books.length === BOOKS_PER_PAGE;

    const handlePageChange = async (newIndex: number) => {
        if (newIndex < 0) return;
        setIsLoading(true);
        try {
            dispatch(setStartIndex(newIndex));
            const results = await ServerApi.searchBooks(query, newIndex);
            dispatch(setSearchResults(results.data.books));
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Error fetching page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousPage = () => {
        if (startIndex > 0) {
            handlePageChange(startIndex - 5);
        }
    };

    const handleNextPage = () => {
        if (hasMoreBooks) {
            handlePageChange(startIndex + 5);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(startPage + 2, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <Button
                onClick={handlePreviousPage}
                disabled={startIndex === 0 || isLoading}
                variant="outline"
                className="gap-2 border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex gap-1">
                {getPageNumbers().map((pageNum) => (
                    <Button
                        key={pageNum}
                        onClick={() => handlePageChange((pageNum - 1) * 5)}
                        disabled={isLoading}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        className={`w-10 h-10 p-0 transition-all ${
                            pageNum === currentPage
                                ? "bg-green-700 hover:bg-green-600 text-white"
                                : "border-green-700 text-green-700 hover:bg-green-50"
                        } disabled:opacity-50`}
                    >
                        {pageNum}
                    </Button>
                ))}
            </div>

            <Button
                onClick={handleNextPage}
                disabled={!hasMoreBooks || isLoading}
                variant="outline"
                className="gap-2 border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
