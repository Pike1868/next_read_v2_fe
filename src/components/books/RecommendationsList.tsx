import { useEffect, useState } from "react";
import ServerApi from "@/api/ServerAPI";
import { RecommendationBook } from "@/types/api";
import { Button } from "@/components/ui/button";
import RecommendationCard from "./RecommendationCard";
import { motion } from "framer-motion";

interface RecommendationsListProps {
    limit?: number;
    showTitle?: boolean;
    onBookSaved?: () => void;
}

export default function RecommendationsList({
    limit = 6,
    showTitle = true,
    onBookSaved,
}: RecommendationsListProps) {
    const [recommendations, setRecommendations] = useState<RecommendationBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    async function fetchRecommendations() {
        setLoading(true);
        setError(null);
        try {
            const resp = await ServerApi.getRecommendations(limit);
            setRecommendations(resp.data.recommendations);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load recommendations";
            setError(errorMessage);
            if (import.meta.env.DEV) console.error("Error fetching recommendations:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveBook(googleBooksId: string) {
        setSavingId(googleBooksId);
        try {
            await ServerApi.saveBookStatus(googleBooksId, "want_to_read");
            onBookSaved?.();
        } catch (err) {
            if (import.meta.env.DEV) console.error("Error saving book:", err);
        } finally {
            setSavingId(null);
        }
    }

    if (loading) {
        return (
            <div className="py-12">
                {showTitle && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Readers Like You Enjoy</h2>
                        <p className="text-gray-600 mt-2">Finding books that match your style...</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(limit)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12">
                {showTitle && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Readers Like You Enjoy</h2>
                    </div>
                )}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-700 mb-4">{error}</p>
                    <Button onClick={fetchRecommendations} className="bg-red-600 hover:bg-red-700">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="py-12">
                {showTitle && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Readers Like You Enjoy</h2>
                    </div>
                )}
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <p className="text-green-800 mb-2 font-medium">
                        We're building your personalized picks!
                    </p>
                    <p className="text-green-700 mb-4 text-sm">
                        Take the reading personality quiz or add books to your library to get recommendations tailored to your style.
                    </p>
                    <Button className="bg-green-700 hover:bg-green-800">Take the Quiz</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            {showTitle && (
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900">Readers Like You Enjoy</h2>
                    <p className="text-gray-600 mt-2">
                        {recommendations.length} picks based on your reading personality and what's trending
                    </p>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((book, i) => (
                    <motion.div
                        key={book.google_books_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                        <RecommendationCard
                            book={book}
                            onSave={handleSaveBook}
                            isSaving={savingId === book.google_books_id}
                        />
                    </motion.div>
                ))}
            </div>

            {recommendations.length > 0 && (
                <div className="mt-8 text-center">
                    <Button
                        onClick={fetchRecommendations}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                        Refresh Recommendations
                    </Button>
                </div>
            )}
        </div>
    );
}
