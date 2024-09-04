import {
    ApiResponse,
    EditUserRequest,
    EditUserResponse,
    RequestMethod,
    SearchByGenreRequest,
    SearchRequest,
    SearchResults,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
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
        console.log("API Call:", endpoint, data, method, this.token);

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
                console.error("API Error:", err.response || err);
                const message = err.response?.data?.msg || 'An error occurred';
                throw new Error(message);
            } else {
                console.error("Unexpected error:", err);
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
            data: { query, startIndex },
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
}

export default ServerApi.getInstance();
