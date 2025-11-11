import {create} from 'zustand'
import {mockUsers} from "@/types/mockData";

type GymStatus = "ACTIVE" | "INACTIVE"
export type Status = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING"

interface address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface userFields {
    email: string;
    password: string;
    confirmPassword: string;
    address: address;
}

interface name {
    firstName: string;
    lastName: string;
}

export interface User {
    id: string;
    name: name;
    userFields: userFields;
    gymStatus: GymStatus;
    status: Status;
    profileImageUrl?: string;
}

interface userStore {
    users: User[];
    addUser: (newUser: User) => void;
    deleteUser: (id: string) => void;
    editUser: (id: string, updatedUser: User) => void;
}

export const useUserStore = create<userStore>((set) => ({
    users: mockUsers,

    addUser: (user) => set((state) => ({
        users: [...state.users, user]
    })),

    deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
    })),

    editUser: (id, updatedUser) => set((state) => ({
        users: state.users.map((user) =>
            user.id === id ? {...user, ...updatedUser} : user
        ),
    }))
}))
