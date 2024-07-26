import { SearchResults } from '@/types/books';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';

class ServerApi {
    private static instance: ServerApi;

    private constructor() { }

    public static getInstance(): ServerApi {
        if (!ServerApi.instance) {
            ServerApi.instance = new ServerApi();
        }
        return ServerApi.instance;
    }
    //Generic search books by user query
    public async searchBooks(query: string, startIndex: number = 0): Promise<SearchResults> {
        try {
            const response = await axios.get<SearchResults>(`${BASE_URL}/api/books/search`, {
                params: {
                    query,
                    startIndex
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching books:", error);
            throw error;
        }
    }
    //Search books by Genre
    public async searchBooksByGenre(genre: string, startIndex: number = 0): Promise<SearchResults> {
        try {
            const response = await axios.get<SearchResults>(`${BASE_URL}/api/books/search_genre/${genre}`, {
                params: {
                    startIndex
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching books by genre:", error);
            throw error;
        }
    }
}

export default ServerApi.getInstance();
