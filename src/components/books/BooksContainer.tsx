import BooksGrid from "@/components/books/BooksGrid";
import BooksList from "@/components/books/BooksList";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/books";
import { useState } from "react";
import { FaTh as FaGrid, FaList } from "react-icons/fa";
import { LayoutGrid, List } from "lucide-react";

interface BooksContainerProps {
    books: Book[];
}

export default function BooksContainer({ books }: BooksContainerProps) {
    const [layout, setLayout] = useState<"grid" | "list">("grid");

    return (
        <>
            <section className="mt-6 md:mt-8">
                <div className="flex items-center justify-between gap-4 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900">
                            {books.length} <span className="text-green-700">result{books.length !== 1 && "s"}</span>
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                            Found for your search
                        </p>
                    </div>
                    <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-white">
                        <Button
                            onClick={() => setLayout("grid")}
                            variant={layout === "grid" ? "default" : "ghost"}
                            size="sm"
                            className={`transition-all ${
                                layout === "grid"
                                    ? "bg-green-700 hover:bg-green-600 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            } p-2`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button
                            onClick={() => setLayout("list")}
                            variant={layout === "list" ? "default" : "ghost"}
                            size="sm"
                            className={`transition-all ${
                                layout === "list"
                                    ? "bg-green-700 hover:bg-green-600 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            } p-2`}
                            title="List View"
                        >
                            <List className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            <div>
                {books.length === 0 ? (
                    <div className="text-center mt-16 md:mt-24 py-12">
                        <div className="mb-4">
                            <LayoutGrid className="w-16 h-16 mx-auto text-gray-300" />
                        </div>
                        <h5 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
                            No books found
                        </h5>
                        <p className="text-gray-500 text-sm md:text-base">
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                ) : layout === "grid" ? (
                    <BooksGrid books={books} />
                ) : (
                    <BooksList books={books} />
                )}
            </div>
        </>
    );
}
