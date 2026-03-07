import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/rootReducer";
import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Reader() {
    const { identifier } = useParams<{ identifier: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    const bookTitle = searchParams.get("title") || "Book Reader";
    const googleBooksId = searchParams.get("bookId") || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const currentPageRef = useRef(0);
    const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const readerUrl = identifier
        ? `https://archive.org/embed/${identifier}`
        : null;

    useEffect(() => {
        if (!identifier) {
            setError("No book identifier provided.");
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [identifier]);

    useEffect(() => {
        if (!user || !googleBooksId) return;

        async function loadPosition() {
            try {
                const response = await ServerApi.getReaderPosition(googleBooksId);
                if (response.data.current_page > 0) {
                    currentPageRef.current = response.data.current_page;
                }
            } catch {
                // Position not found is fine
            }
        }

        loadPosition();
    }, [user, googleBooksId]);

    useEffect(() => {
        if (!user || !googleBooksId) return;

        saveIntervalRef.current = setInterval(() => {
            if (currentPageRef.current > 0) {
                ServerApi.saveReaderPosition(
                    googleBooksId,
                    currentPageRef.current,
                    0
                ).catch(() => {});
            }
        }, 30000);

        return () => {
            if (currentPageRef.current > 0) {
                ServerApi.saveReaderPosition(
                    googleBooksId,
                    currentPageRef.current,
                    0
                ).catch(() => {});
            }
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
        };
    }, [user, googleBooksId]);

    if (error) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <BookOpen className="w-16 h-16 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-800">
                    Unable to Load Reader
                </h2>
                <p className="text-gray-600">{error}</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </motion.div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col w-full" style={{ height: "calc(100vh - 80px)" }}>
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-10 h-10 border-3 border-gray-200 border-t-green-700 rounded-full animate-spin mb-3 mx-auto" />
                        <p className="text-sm text-gray-500">Loading reader...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!readerUrl) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <BookOpen className="w-16 h-16 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-800">
                    No Free Version Available
                </h2>
                <p className="text-gray-600 max-w-sm text-center">
                    This book is not available for free reading. You can search
                    for it on a bookstore or library.
                </p>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(-1)} variant="outline">
                        Go Back
                    </Button>
                    <Button
                        onClick={() =>
                            window.open(
                                `https://www.google.com/search?q=buy+${encodeURIComponent(bookTitle)}`,
                                "_blank"
                            )
                        }
                        className="bg-green-700 hover:bg-green-800"
                    >
                        Search to Purchase
                    </Button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex flex-col w-full"
            style={{ height: "calc(100vh - 80px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="w-px h-5 bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-700" />
                        <h1 className="text-sm font-medium text-gray-800 truncate max-w-[200px] sm:max-w-md md:max-w-lg">
                            {bookTitle}
                        </h1>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                        if (iframeRef.current) {
                            iframeRef.current.requestFullscreen?.();
                        }
                    }}
                >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Fullscreen
                </Button>
            </div>

            {/* Embedded reader */}
            <iframe
                ref={iframeRef}
                src={readerUrl}
                title={`Reading: ${bookTitle}`}
                className="flex-1 w-full border-0"
                allowFullScreen
                sandbox="allow-scripts allow-popups allow-forms"
            />
        </motion.div>
    );
}
