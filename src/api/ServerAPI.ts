import {
    ApiResponse,
    BookDetailsApiResponse,
    EditUserRequest,
    EditUserResponse,
    FeaturedListsResponse,
    QuizQuestionsResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizUserResultResponse,
    RecommendationsResponse,
    SimilarBooksResponse,
    RequestMethod,
    SearchByGenreRequest,
    SearchRequest,
    SearchResults,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
    UserBooksResponse,
    UserProfileRequest,
    UserProfileResponse
} from '@/types/api';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';

class ServerApi {
    private static instance: ServerApi;
    private token: string | null;

    private constructor() {
        // Retrieve the entire state from local storage
        const storedState = localStorage.getItem('state');
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            const user = parsedState?.user?.user || null; // Access the user from the state
            this.token = user?.token || null;
        } else {
            this.token = null;
        }
    }

    public static getInstance(): ServerApi {
        if (!ServerApi.instance) {
            ServerApi.instance = new ServerApi();
        }
        return ServerApi.instance;
    }

    public setToken(token: string | null) {
        this.token = token;
    }

    private async request<T extends Record<string, unknown>, R = unknown>({
        endpoint,
        data,
        method = "get",
    }: {
        endpoint: string;
        data?: T;
        method?: RequestMethod;
    }): Promise<ApiResponse<R>> { // Return type is a Promise that resolves to ApiResponse<R>
        const url = `${BASE_URL}/${endpoint}`;
        const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
        const params = method === "get" ? data : {};

        try {
            const response: AxiosResponse<R> = await axios({ url, method, data, params, headers });
            // Wrap the response to conform to custom ApiResponse type

            return {
                data: response.data,
                status: response.status,
            } as ApiResponse<R>;

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (import.meta.env.DEV) console.error("API Error:", err.response?.status, err.response?.data?.msg);
                const message = err.response?.data?.msg || 'An error occurred';
                throw new Error(message);
            } else {
                if (import.meta.env.DEV) console.error("Unexpected error:", err);
                throw new Error('An unexpected error occurred');
            }
        }
    }

    public async signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>> {
        return this.request<SignupRequest, SignupResponse>({
            endpoint: 'api/users/sign-up',
            data,
            method: "post"
        });
    }

    public async signin(data: SigninRequest): Promise<ApiResponse<SigninResponse>> {
        return this.request<SigninRequest, SigninResponse>({
            endpoint: 'api/users/sign-in',
            data,
            method: "post"
        });
    }

    public async getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileRequest, UserProfileResponse>({
            endpoint: "api/users/profile",
            method: "get"
        });
    }

    public async editUser(data: EditUserRequest): Promise<ApiResponse<EditUserResponse>> {
        return this.request<EditUserRequest, EditUserResponse>({
            endpoint: "api/users/profile/edit",
            data,
            method: "post"
        });
    }

    public async deleteUser(): Promise<ApiResponse<{ msg: string }>> {
        return this.request<Record<string, never>, { msg: string }>({
            endpoint: "api/users/delete",
            method: "post",
        });
    }

    public async searchBooks(query: string, startIndex: number = 0): Promise<ApiResponse<SearchResults>> {
        return this.request<SearchRequest, SearchResults>({
            endpoint: 'api/books/search',
            data: { query, startIndex },  // Use `params` instead of `data`
            method: "get"
        });
    }
    

    public async searchBooksByGenre(genre: string, startIndex: number = 0): Promise<ApiResponse<SearchResults>> {
        return this.request<SearchByGenreRequest, SearchResults>({
            endpoint: `api/books/search-genre/${genre}`,
            data: { genre, startIndex },
            method: "get"
        });
    }


    public async getBookDetails(volumeId: string): Promise<ApiResponse<BookDetailsApiResponse>> {
        return this.request<Record<string, never>, BookDetailsApiResponse>({
            endpoint: `api/books/detail/${volumeId}`,
            method: "get",
        });
    }

    public async saveBookStatus(googleBooksId: string, status: string): Promise<ApiResponse<{ msg: string }>> {
        return this.request<{ google_books_id: string; status: string }, { msg: string }>({
            endpoint: 'api/books/save-book',
            data: { google_books_id: googleBooksId, status },
            method: "post"
        });
    }

    public async removeBook(volumeId: string): Promise<ApiResponse<{ msg: string }>> {
        return this.request<Record<string, never>, { msg: string }>({
            endpoint: `api/books/${volumeId}/remove`,
            method: "post",
        });
    }

    // New method to fetch user books categorized by their status
    public async getUserBooks(): Promise<ApiResponse<UserBooksResponse>> {
        const response = await this.request<Record<string, never>, UserBooksResponse>({
            endpoint: 'api/books/user-books',
            method: "get",
        });

        return response;
    }

   //method to fetch featured books lists
    public async getFeaturedLists(): Promise<ApiResponse<FeaturedListsResponse>> {
        return this.request<Record<string, never>, FeaturedListsResponse>({
            endpoint: 'api/books/featured',
            method: 'get',
        });
    }

    // Quiz API Methods
    public async getQuizQuestions(): Promise<ApiResponse<QuizQuestionsResponse>> {
        return this.request<Record<string, never>, QuizQuestionsResponse>({
            endpoint: 'api/quiz/questions',
            method: 'get',
        });
    }

    public async submitQuizAnswers(data: QuizSubmitRequest): Promise<ApiResponse<QuizResultResponse>> {
        return this.request<QuizSubmitRequest, QuizResultResponse>({
            endpoint: 'api/quiz/submit',
            data,
            method: 'post',
        });
    }

    public async getUserQuizResult(): Promise<ApiResponse<QuizUserResultResponse>> {
        return this.request<Record<string, never>, QuizUserResultResponse>({
            endpoint: 'api/quiz/user',
            method: 'get',
        });
    }

    public async retakeQuiz(): Promise<ApiResponse<{ message: string }>> {
        return this.request<Record<string, never>, { message: string }>({
            endpoint: 'api/quiz/retake',
            method: 'post',
        });
    }

    // Recommendation API Methods
    public async getRecommendations(limit: number = 10): Promise<ApiResponse<RecommendationsResponse>> {
        return this.request<{ limit: number }, RecommendationsResponse>({
            endpoint: 'api/recommendations/user',
            data: { limit },
            method: 'get',
        });
    }

    public async getSimilarBooks(bookId: string, limit: number = 6): Promise<ApiResponse<SimilarBooksResponse>> {
        return this.request<{ limit: number }, SimilarBooksResponse>({
            endpoint: `api/recommendations/book/${bookId}`,
            data: { limit },
            method: 'get',
        });
    }

    public async regenerateRecommendations(): Promise<ApiResponse<{ message: string; total: number }>> {
        return this.request<Record<string, never>, { message: string; total: number }>({
            endpoint: 'api/recommendations/regenerate',
            method: 'post',
        });
    }

    // Google OAuth sign-in
    public async googleSignIn(data: { token: string }): Promise<ApiResponse<SigninResponse>> {
        return this.request<{ token: string }, SigninResponse>({
            endpoint: 'api/users/google-signin',
            data,
            method: 'post',
        });
    }

    // Reading progress
    public async updateReadingProgress(volumeId: string, currentPage: number): Promise<ApiResponse<{ msg: string; current_page: number; status: string; start_date: string | null; end_date: string | null; page_count: number | null }>> {
        return this.request<{ current_page: number }, { msg: string; current_page: number; status: string; start_date: string | null; end_date: string | null; page_count: number | null }>({
            endpoint: `api/books/${volumeId}/progress`,
            data: { current_page: currentPage },
            method: 'patch',
        });
    }

    public async getReadingProgress(volumeId: string): Promise<ApiResponse<{ current_page: number; page_count: number | null; status: string; start_date: string | null; end_date: string | null }>> {
        return this.request<Record<string, never>, { current_page: number; page_count: number | null; status: string; start_date: string | null; end_date: string | null }>({
            endpoint: `api/books/${volumeId}/progress`,
            method: 'get',
        });
    }

    // Public profiles
    public async getPublicProfile(username: string): Promise<ApiResponse<{ is_public: boolean; username?: string; bio?: string; image_url?: string; top_books?: Record<string, unknown>[]; book_lists?: Record<string, Record<string, unknown>[]>; msg?: string }>> {
        return this.request<Record<string, never>, { is_public: boolean; username?: string; bio?: string; image_url?: string; top_books?: Record<string, unknown>[]; book_lists?: Record<string, Record<string, unknown>[]>; msg?: string }>({
            endpoint: `api/users/public/${username}`,
            method: 'get',
        });
    }

    public async updateProfileVisibility(settings: { is_public?: boolean; show_currently_reading?: boolean; show_want_to_read?: boolean; show_previously_read?: boolean }): Promise<ApiResponse<{ msg: string }>> {
        return this.request<typeof settings, { msg: string }>({
            endpoint: 'api/users/profile/visibility',
            data: settings,
            method: 'post',
        });
    }

    public async setTopBooks(bookIds: string[]): Promise<ApiResponse<{ msg: string }>> {
        return this.request<{ book_ids: string[] }, { msg: string }>({
            endpoint: 'api/users/profile/top-books',
            data: { book_ids: bookIds },
            method: 'post',
        });
    }

    // Free Reader API Methods
    public async checkFreeBook(googleBooksId: string): Promise<ApiResponse<{ available: boolean; reader_url: string | null; source: string | null; ia_id: string | null }>> {
        return this.request<Record<string, never>, { available: boolean; reader_url: string | null; source: string | null; ia_id: string | null }>({
            endpoint: `api/reader/check/${googleBooksId}`,
            method: 'get',
        });
    }

    public async searchFreeBooks(query: string): Promise<ApiResponse<{ books: Record<string, unknown>[]; query: string; total: number }>> {
        return this.request<{ query: string }, { books: Record<string, unknown>[]; query: string; total: number }>({
            endpoint: 'api/reader/search',
            data: { query },
            method: 'get',
        });
    }

    public async saveReaderPosition(googleBooksId: string, currentPage: number, totalPages: number): Promise<ApiResponse<{ msg: string; current_page: number; google_books_id: string }>> {
        return this.request<{ google_books_id: string; current_page: number; total_pages: number }, { msg: string; current_page: number; google_books_id: string }>({
            endpoint: 'api/reader/position',
            data: { google_books_id: googleBooksId, current_page: currentPage, total_pages: totalPages },
            method: 'post',
        });
    }

    public async getReaderPosition(googleBooksId: string): Promise<ApiResponse<{ current_page: number; total_pages: number | null; google_books_id: string; status?: string }>> {
        return this.request<Record<string, never>, { current_page: number; total_pages: number | null; google_books_id: string; status?: string }>({
            endpoint: `api/reader/position/${googleBooksId}`,
            method: 'get',
        });
    }

}

export default ServerApi.getInstance();
