export interface Book {
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail_url: string;
  published_date: string;
  page_count: number;
  categories: string[];
  retail_price: number;
  currency_code: string;
  description: string;
  publisher: string;
}
// src/types/api.ts
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
  authors?: string[];
  imageLinks?: { thumbnail?: string };
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  description?: string;
  publisher?: string;
}





export interface BookDetailsResponse {
  title?: string;
  authors?: string[];
  imageLinks?: { thumbnail?: string };
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  description?: string;
  publisher?: string;
}




export interface SearchResults {
  books: Book[];
  query: string;
  startIndex: number;
}

export type BookFilterOptions = "none" | "a-z" | "z-a" | "author" | "year" | "page length" | "categories";