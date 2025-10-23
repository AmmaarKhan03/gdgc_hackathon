import {create} from 'zustand'

interface AuthState {
    isAuthenticated: boolean
    login: (email: string, password: string) => boolean
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,

    login: (email, password) => {
        if (email === "user@gmail.com" && password === "password") {
            set({isAuthenticated: true})
            localStorage.setItem("isAuthenticated", "true");
            return true;
        }
        return false;
    },

    logout: () => {
        set({isAuthenticated: false});
        localStorage.removeItem("isAuthenticated");
    }
}))