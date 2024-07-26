// src/types/books.ts
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
}

  
  export interface SearchResults {
    books: Book[];
    query: string;
    startIndex: number;
  }
  
  export type BookFilterOptions = "none" | "a-z" | "z-a" | "author" | "year" | "page length" | "categories";