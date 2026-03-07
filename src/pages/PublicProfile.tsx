import ServerApi from "@/api/ServerAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface PublicProfileData {
    is_public: boolean;
    username?: string;
    bio?: string;
    image_url?: string;
    creation_date?: string;
    top_books?: Array<{
        google_books_id: string;
        title: string;
        authors: string[];
        thumbnail_url: string;
    }>;
    book_lists?: {
        currently_reading?: Array<{
            google_books_id: string;
            title: string;
            authors: string[];
            thumbnail_url: string;
        }>;
        want_to_read?: Array<{
            google_books_id: string;
            title: string;
            authors: string[];
            thumbnail_url: string;
        }>;
        previously_read?: Array<{
            google_books_id: string;
            title: string;
            authors: string[];
            thumbnail_url: string;
        }>;
    };
    msg?: string;
}

const DEFAULT_IMAGE = "/bookcover-na.jpg";

export default function PublicProfile() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<PublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            loadProfile(username);
        }
    }, [username]);

    async function loadProfile(uname: string) {
        setLoading(true);
        setError(null);
        try {
            const response = await ServerApi.getPublicProfile(uname);
            setProfile(response.data as PublicProfileData);
        } catch (err) {
            setError("User not found");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                <p className="text-gray-600">The user "{username}" does not exist.</p>
            </div>
        );
    }

    if (profile && !profile.is_public) {
        return (
            <div className="max-w-2xl mx-auto py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Private Profile</h2>
                <p className="text-gray-600">This user's profile is private.</p>
            </div>
        );
    }

    if (!profile) return null;

    const bookLists = profile.book_lists || {};
    const statusLabels: Record<string, string> = {
        currently_reading: "Currently Reading",
        want_to_read: "Want to Read",
        previously_read: "Previously Read",
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10">
                <img
                    src={profile.image_url || "/static/images/default-pic.png"}
                    alt={profile.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-600"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                    {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
                    {profile.creation_date && (
                        <p className="text-sm text-gray-400 mt-1">
                            Member since {new Date(profile.creation_date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Top Books */}
            {profile.top_books && profile.top_books.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Books</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {profile.top_books.map((book, idx) => (
                            <Link key={book.google_books_id} to={`/book/${book.google_books_id}`}>
                                <Card className="hover:shadow-lg transition-shadow h-full">
                                    <CardContent className="p-3">
                                        <div className="relative mb-2">
                                            <span className="absolute -top-1 -left-1 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                                #{idx + 1}
                                            </span>
                                            <img
                                                src={book.thumbnail_url || DEFAULT_IMAGE}
                                                alt={book.title}
                                                className="w-full h-40 object-contain rounded"
                                            />
                                        </div>
                                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{book.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{book.authors?.join(", ")}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Book Lists */}
            {Object.entries(bookLists).map(([status, books]) => {
                if (!books || books.length === 0) return null;
                return (
                    <section key={status} className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {statusLabels[status] || status}
                            <span className="text-lg font-normal text-gray-500 ml-2">({books.length})</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {books.map((book) => (
                                <Link key={book.google_books_id} to={`/book/${book.google_books_id}`}>
                                    <Card className="hover:shadow-lg transition-shadow h-full">
                                        <CardContent className="p-3">
                                            <img
                                                src={book.thumbnail_url || DEFAULT_IMAGE}
                                                alt={book.title}
                                                className="w-full h-36 object-contain rounded mb-2"
                                            />
                                            <p className="font-medium text-sm text-gray-900 line-clamp-2">{book.title}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{book.authors?.join(", ")}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Empty state */}
            {(!profile.top_books || profile.top_books.length === 0) &&
             Object.values(bookLists).every(list => !list || list.length === 0) && (
                <div className="text-center py-16">
                    <p className="text-gray-600">This user hasn't added any books yet.</p>
                </div>
            )}
        </div>
    );
}
