import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    register: async (name, email, password) => {
        set({ loading: true, error: null });

        try {
            const res = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
            });

            const { user, token } = res.data;

            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            });

            // persist to localStorage if you want
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isAuthenticated", "true");

            return true;
        } catch (err: any) {
            set({
                loading: false,
                error: err.response?.data?.message || "Registration failed",
            });
            return false;
        }
    },

    login: async (email, password) => {
        set({ loading: true, error: null });

        try {
            const res = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });

            const { user, token } = res.data;

            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            });

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isAuthenticated", "true");

            return true;
        } catch (err: any) {
            set({
                loading: false,
                error: err.response?.data?.message || "Login failed",
            });
            return false;
        }
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
    },
}));
