export interface Book {
  google_books_id: string;
  title: string;
  authors: string[]; // Always a flat array of strings
  thumbnail_url: string; // Direct URL to the image
  published_date: string;
  page_count: number;
  categories: string[];
  retail_price: number;
  currency_code: string;
  description: string;
  publisher: string;
}

export interface FeaturedBook {
  google_books_id: string;
  title: string;
  author: string;
  description?: string | undefined;
  book_image?: string;
  rank?: number;
  google_thumbnail_url?: string;
}

export interface BookDetailsResponse {
  title?: string;
  // It might come as a string or an array.
  authors?: string[] | string;
  // Google Books returns imageLinks; but your NYT data might already be normalized.
  imageLinks?: { thumbnail?: string };
  // If your backend already normalized it, you may have a direct property:
  thumbnail_url?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  description?: string;
  publisher?: string;
}
// src/types/books.ts or src/types/api.ts
export type BookStatus = "previously_read" | "currently_reading" | "want_to_read";

export const BookStatuses = {
  PREVIOUSLY_READ: "PREVIOUSLY_READ" as BookStatus,
  CURRENTLY_READING: "CURRENTLY_READING" as BookStatus,
  WANT_TO_READ: "WANT_TO_READ" as BookStatus,
};

export interface SearchResults {
  books: Book[];
  query: string;
  startIndex: number;
}

export type BookFilterOptions = "none" | "a-z" | "z-a" | "author" | "year" | "page length" | "categories";