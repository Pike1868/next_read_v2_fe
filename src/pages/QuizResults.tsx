import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ServerApi from "@/api/ServerAPI";
import { QuizResultResponse } from "@/types/api";
import { Button } from "@/components/ui/button";

interface RootState {
    user: {
        user: { id?: number; username?: string; email?: string; token?: string } | null;
    };
}

const PERSONA_ICONS: Record<string, string> = {
    "Fantasy Explorer": "🧙",
    "Knowledge Seeker": "📚",
    "Mystery Enthusiast": "🔍",
    "Emotional Deep Diver": "💭",
    "Sci-Fi Futurist": "🚀",
};

const PERSONA_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    "Fantasy Explorer": { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
    "Knowledge Seeker": { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
    "Mystery Enthusiast": { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" },
    "Emotional Deep Diver": { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-700" },
    "Sci-Fi Futurist": { bg: "bg-cyan-50", border: "border-cyan-300", text: "text-cyan-700" },
};

export default function QuizResults() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    const [result, setResult] = useState<QuizResultResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        fetchResult();
    }, [user, navigate]);

    async function fetchResult() {
        setLoading(true);
        setError(null);
        try {
            const resp = await ServerApi.getUserQuizResult();
            setResult(resp.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load quiz results";
            setError(errorMessage);
            console.error("Error fetching quiz result:", err);
        } finally {
            setLoading(false);
        }
    }

    function handleShareTwitter() {
        if (!result) return;
        const text = `I'm a "${result.persona}" on NextRead's Reading Personality Quiz! 📖 What's yours? #ReadingPersonality`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
        window.open(url, "_blank");
    }

    function handleShareFacebook() {
        if (!result) return;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
        window.open(url, "_blank");
    }

    function handleRetakeQuiz() {
        navigate("/quiz");
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-gray-600 font-medium">Loading your reading personality...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Results</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <Button onClick={fetchResult} className="w-full bg-green-700 hover:bg-green-800">
                            Try Again
                        </Button>
                        <Button onClick={() => navigate("/quiz")} variant="outline" className="w-full">
                            Back to Quiz
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-yellow-500 text-5xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
                    <p className="text-gray-600 mb-6">Please complete the quiz first to see your results.</p>
                    <Button onClick={() => navigate("/quiz")} className="w-full bg-green-700 hover:bg-green-800">
                        Take Quiz
                    </Button>
                </div>
            </div>
        );
    }

    const icon = PERSONA_ICONS[result.persona] || "📖";
    const colors = PERSONA_COLORS[result.persona] || PERSONA_COLORS["Book Lover"];

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Your Reading Personality
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover what kind of reader you are
                    </p>
                </div>

                {/* Main Result Card */}
                <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-8 md:p-12 mb-8 text-center`}>
                    <div className="text-6xl mb-6">{icon}</div>
                    <h2 className={`text-4xl font-bold ${colors.text} mb-4`}>
                        {result.persona}
                    </h2>
                    <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                        {result.description}
                    </p>

                    {/* Genres */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Genres</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {result.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className={`px-4 py-2 rounded-full bg-white border-2 ${colors.border} ${colors.text} font-medium`}
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Scores */}
                    <div className="bg-white rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Trait Scores</h3>
                        <div className="space-y-3">
                            {Object.entries(result.scores).map(([trait, score]) => (
                                <div key={trait} className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium capitalize">{trait}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full`}
                                                style={{ width: `${(score / Math.max(...Object.values(result.scores))) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-600 text-sm w-8 text-right">{score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 md:space-y-0 md:flex md:gap-4 mb-8">
                    <Button
                        onClick={handleShareTwitter}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                    >
                        🐦 Share on Twitter
                    </Button>
                    <Button
                        onClick={handleShareFacebook}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                    >
                        📘 Share on Facebook
                    </Button>
                </div>

                {/* Bottom Action */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Button
                        onClick={() => navigate("/user/library")}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3"
                    >
                        View Recommendations
                    </Button>
                    <Button
                        onClick={handleRetakeQuiz}
                        variant="outline"
                        className="flex-1 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3"
                    >
                        Retake Quiz
                    </Button>
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 What's Next?</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>✓ Check out personalized recommendations based on your reading personality</li>
                        <li>✓ Explore your library and discover books similar to your favorites</li>
                        <li>✓ Share your reading personality with friends and family</li>
                        <li>✓ Retake the quiz anytime to update your personality profile</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
