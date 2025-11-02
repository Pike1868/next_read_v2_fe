import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ServerApi from "@/api/ServerAPI";
import { QuizQuestion, QuizSubmitRequest } from "@/types/api";
import { Button } from "@/components/ui/button";

interface RootState {
    user: {
        user: { id?: number; username?: string; email?: string; token?: string } | null;
    };
}

export default function Quiz() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        fetchQuestions();
    }, [user, navigate]);

    async function fetchQuestions() {
        setLoading(true);
        setError(null);
        try {
            const resp = await ServerApi.getQuizQuestions();
            setQuestions(resp.data.questions);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load quiz questions";
            setError(errorMessage);
            console.error("Error fetching quiz questions:", err);
        } finally {
            setLoading(false);
        }
    }

    function handleAnswerSelect(answer: string) {
        setAnswers({
            ...answers,
            [questions[currentQuestionIndex].id]: answer,
        });
    }

    function handleNext() {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    function handlePrevious() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    async function handleSubmit() {
        setSubmitting(true);
        setError(null);
        try {
            const answersArray = questions.map((q) => ({
                question: q.id,
                answer: answers[q.id] || "",
            }));

            const submitData: QuizSubmitRequest = {
                answers: answersArray,
            };

            await ServerApi.submitQuizAnswers(submitData);
            navigate("/quiz-results");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to submit quiz";
            setError(errorMessage);
            console.error("Error submitting quiz:", err);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-gray-600 font-medium">Loading your reading personality quiz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Quiz</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={fetchQuestions} className="w-full bg-green-700 hover:bg-green-800">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-yellow-500 text-5xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
                    <p className="text-gray-600 mb-6">Unable to load quiz questions. Please try again later.</p>
                    <Button onClick={fetchQuestions} className="w-full bg-green-700 hover:bg-green-800">
                        Reload Quiz
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isAnswered = answers[currentQuestion.id] !== undefined;
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        📚 What's Your Reading Personality?
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover your unique reading style in just 5 questions
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <span className="text-sm font-semibold text-green-700">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

                        {/* Answer Options */}
                        <div className="space-y-3">
                            {currentQuestion.answers.map((answer) => (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerSelect(answer.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                                        answers[currentQuestion.id] === answer.id
                                            ? "border-green-600 bg-green-50 text-green-900"
                                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-green-400 hover:bg-green-50"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                answers[currentQuestion.id] === answer.id
                                                    ? "border-green-600 bg-green-600"
                                                    : "border-gray-400"
                                            }`}
                                        >
                                            {answers[currentQuestion.id] === answer.id && (
                                                <span className="text-white text-sm">✓</span>
                                            )}
                                        </div>
                                        {answer.text}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                        <Button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            variant="outline"
                            className="px-6"
                        >
                            ← Previous
                        </Button>

                        {currentQuestionIndex < questions.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className="px-6 bg-green-700 hover:bg-green-800"
                            >
                                Next →
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!allAnswered || submitting}
                                className="px-8 bg-green-700 hover:bg-green-800"
                            >
                                {submitting ? "Submitting..." : "See My Results"}
                            </Button>
                        )}
                    </div>

                    {/* Answer Status */}
                    {!isAnswered && (
                        <p className="text-sm text-orange-600 mt-4 text-center font-medium">
                            Please select an answer to continue
                        </p>
                    )}
                </div>

                {/* Question Counter */}
                <div className="text-center text-gray-600 text-sm">
                    You've answered {Object.keys(answers).length} of {questions.length} questions
                </div>
            </div>
        </div>
    );
}
