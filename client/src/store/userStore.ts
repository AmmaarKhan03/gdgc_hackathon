import {create} from 'zustand'
import {mockUsers} from "@/types/mockData";

export type Status = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING"

type Year = "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate" | "Transfer"

interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface Name {
    firstName: string;
    lastName: string;
}

interface Profile {
    bio?: string;
    phone?: string;
    major?: string;
    year?: Year;
    pronouns?: string[];
    interests?: string[];
    links?: {
        github?: string;
        linkedin?: string;
        website?: string;
    }
}

export type EditUserInput = {
    name: Name;
    email: string;
    address: Address;
    profile: Profile;
    profileImageUrl?: string;
}

export interface User {
    id: string;
    name: Name;
    email: string;

    address: Address;
    profile: Profile;

    status: Status;
    profileImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface userStore {
    users: User[];
    currentUser: User | null;
    addUser: (newUser: User) => void;
    setCurrentUser: (user: User | null) => void;
    deleteUser: (id: string) => void;
    editUser: (id: string, updatedUser: EditUserInput) => void;
}

export const useUserStore = create<userStore>((set) => ({
    users: mockUsers,

    addUser: (user) => set((state) => ({
        users: [...state.users, user]
    })),

    currentUser: null,
    setCurrentUser: (user) => set(() => ({ currentUser: user })),

    deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
    })),

    editUser: (id, updated) =>
        set((state) => ({
            users: state.users.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        name: updated.name,
                        email: updated.email,
                        address: updated.address,
                        profile: updated.profile,
                        profileImageUrl: updated.profileImageUrl ?? user.profileImageUrl,
                        updatedAt: new Date().toISOString(),
                    }
                    : user
            ),
            currentUser:
                state.currentUser?.id === id
                    ? {
                        ...state.currentUser,
                        name: updated.name,
                        email: updated.email,
                        address: updated.address,
                        profile: updated.profile,
                        profileImageUrl: updated.profileImageUrl ?? state.currentUser.profileImageUrl,
                        updatedAt: new Date().toISOString(),
                    }
                    : state.currentUser,
        }))
}))
