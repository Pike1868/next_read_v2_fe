import BooksGrid from "@/components/BooksGrid";
import BooksList from "@/components/BooksList";
import { Book } from "@/types/books";
import { useState } from "react";
import { FaTh as FaGrid, FaList } from "react-icons/fa";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface BooksContainerProps {
    books: Book[];
}

export default function BooksContainer({ books }: BooksContainerProps) {
    const [layout, setLayout] = useState<"grid" | "list">("grid");

    return (
        <>
            <section>
                <div className="flex items-center justify-between mt-8">
                    <h4 className="font-medium text-md">
                        {books.length} book{books.length > 1 && "s"}
                    </h4>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setLayout("grid")}
                            variant={layout === "grid" ? "default" : "ghost"}
                            size="icon"
                        >
                            <FaGrid />
                        </Button>
                        <Button
                            onClick={() => setLayout("list")}
                            variant={layout === "list" ? "default" : "ghost"}
                            size="icon"
                        >
                            <FaList />
                        </Button>
                    </div>
                </div>
                <Separator className="mt-4" />
            </section>
            <div>
                {books.length === 0 ? (
                    <h5 className="mt-16 text-2xl">
                        Sorry, no books matched search...
                    </h5>
                ) : layout === "grid" ? (
                    <BooksGrid books={books} />
                ) : (
                    <BooksList books={books} />
                )}
            </div>
        </>
    );
}
