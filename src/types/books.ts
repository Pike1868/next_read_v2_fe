export interface Book {
    google_books_id: string;
    title: string;
    authors: string[];
    thumbnail_url: string;
  }
  
  export interface SearchResults {
    books: Book[];
    query: string;
    startIndex: number;
  }
  