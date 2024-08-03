import { Book } from "./books";

export type RequestMethod = "get" | "post" | "put" | "delete";

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
