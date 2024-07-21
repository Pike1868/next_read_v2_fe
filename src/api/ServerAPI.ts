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

    public async searchBooks(query: string): Promise<SearchResults> {
        try {
            const response = await axios.get<SearchResults>(`${BASE_URL}/api/books/search`, {
                params: {
                    query,
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching books:", error);
            throw error;
        }
    }
}

export default ServerApi.getInstance();
