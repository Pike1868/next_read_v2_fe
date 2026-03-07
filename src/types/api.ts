import { Book, BookDetailsResponse } from "./books";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

export type ApiResponse<T> = {
    data: T;
    status: number;
};

export type ApiErrorResponse = {
    msg: string;
    status: number
};
/**
 * Extending `Record<string, unknown>` ensures that the generic type T is always an object with string keys.
 * This is useful for utility functions that need to handle flexible object types in TypeScript.
 */

export interface SignupRequest extends Record<string, unknown> {
    username: string;
    email: string;
    password: string;
}

export interface SignupResponse {
    token: string;
}

export interface SigninRequest extends Record<string, unknown> {
    email: string,
    password: string,
}

export interface SigninResponse extends Record<string, unknown> {
    username: string,
    token: string,
}

export interface UserProfileRequest extends Record<string, unknown> {

}

export interface UserProfileResponse {
    username: string;
    email: string;
    bio: string | null;
    location: string | null;
    creation_date: string;
    image_url: string;
}

export interface EditUserRequest extends Record<string, unknown> {
    username: string;
    email: string;
    bio: string,
    location: string,
    image_url: string,
    password: string;
}

export interface EditUserResponse extends Record<string, unknown> {
    msg: string,
}


export interface SearchRequest extends Record<string, unknown> {
    query: string;
    startIndex: number;
}

export interface SearchResults {
    books: Book[];
    query: string;
    startIndex: number;
}


export interface SearchByGenreRequest extends Record<string, unknown> {
    genre: string;
    startIndex: number;
}
export interface BookDetailsApiResponse {
    google_books_id: string;
    book: BookDetailsResponse;
}
export interface UserBooksResponse {
    currently_reading: ApiBook[];
    want_to_read: ApiBook[];
    previously_read: ApiBook[];
}


export interface ApiBook {
    google_books_id: string;
    title: string;
    authors: string[];
    thumbnail_url: string;
    published_date: string;
    page_count: number;
    description: string;
    publisher: string;
    average_rating?: number | null;
    ratings_count?: number;
}
export interface FeaturedBook {
    google_books_id: string;
    title: string;
    author: string;
    description?: string | undefined;
    book_image?: string;
    thumbnail_url?: string; // Add this field
    rank?: number;
    google_thumbnail_url?: string;
}



export interface FeaturedListData {
    list_name: string;
    display_name: string;
    books: FeaturedBook[];
}

export interface FeaturedListsResponse {
    bestsellers_date?: string;     // depending on the API shape
    published_date?: string;       // might be optional
    featured_lists: FeaturedListData[];
}

// Quiz Types
export interface QuizQuestion {
    id: number;
    question: string;
    answers: {
        id: string;
        text: string;
    }[];
}

export interface QuizQuestionsResponse {
    questions: QuizQuestion[];
    total: number;
}

export interface QuizAnswer {
    question: number;
    answer: string;
}

export interface QuizSubmitRequest extends Record<string, unknown> {
    answers: QuizAnswer[];
}

export interface QuizResultResponse {
    persona: string;
    description: string;
    genres: string[];
    scores: Record<string, number>;
    created_at?: string;
}

export interface QuizUserResultResponse {
    id: number;
    user_id: number;
    persona: string;
    description: string;
    genres: string[];
    scores: Record<string, number>;
    created_at: string;
    updated_at: string;
}

// Recommendation Types
export interface RecommendationBook extends ApiBook {
    score: number;
    reasons: string[];
}

export interface RecommendationsResponse {
    recommendations: RecommendationBook[];
    total: number;
}

export interface SimilarBooksResponse {
    similar_books: RecommendationBook[];
    total: number;
}
