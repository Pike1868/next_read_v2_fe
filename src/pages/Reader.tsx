import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/rootReducer";
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

    // Periodic position saving
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

    // Load saved reading position on mount
    useEffect(() => {
        if (!user || !googleBooksId) return;

        async function loadPosition() {
            try {
                const response = await ServerApi.getReaderPosition(googleBooksId);
                if (response.data.current_page > 0) {
                    currentPageRef.current = response.data.current_page;
                }
            } catch {
                // Position not found is fine, start from beginning
            }
        }

        loadPosition();
    }, [user, googleBooksId]);

    // Set up periodic position saving (every 30 seconds)
    useEffect(() => {
        if (!user || !googleBooksId) return;

        saveIntervalRef.current = setInterval(() => {
            if (currentPageRef.current > 0) {
                ServerApi.saveReaderPosition(
                    googleBooksId,
                    currentPageRef.current,
                    0
                ).catch(() => {
                    // Silent fail for background saves
                });
            }
        }, 30000);

        return () => {
            // Save position on unmount
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Unable to Load Reader
                </h2>
                <p className="text-gray-600">{error}</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-lg text-gray-600">Loading reader...</p>
            </div>
        );
    }

    if (!readerUrl) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    No Free Version Available
                </h2>
                <p className="text-gray-600">
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
                    >
                        Search to Purchase
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full" style={{ height: "calc(100vh - 80px)" }}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        size="sm"
                    >
                        &larr; Back
                    </Button>
                    <h1 className="text-sm font-medium text-gray-800 truncate max-w-[200px] sm:max-w-md md:max-w-lg">
                        {bookTitle}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (iframeRef.current) {
                                iframeRef.current.requestFullscreen?.();
                            }
                        }}
                    >
                        Fullscreen
                    </Button>
                </div>
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
        </div>
    );
}
