import {create} from 'zustand'

type GymStatus = "ACTIVE" | "INACTIVE"
type Status = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING"

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

interface User {
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

export const mockUsers: User[] = [
    {
        id: '1',
        name: { firstName: "Ivan", lastName: "Argueta" },
        userFields: {
            email: "iargueta@ucsc.edu",
            password: "password123",
            confirmPassword: "password123",
            address: { street: "1156 High St", city: "Santa Cruz", state: "CA", zip: "95064" },
        },
        gymStatus: "ACTIVE",
        status: "ACTIVE",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
    },
    {
        id: '2',
        name: { firstName: "Maya", lastName: "Chen" },
        userFields: {
            email: "mchen7@ucsc.edu",
            password: "hunter2!!",
            confirmPassword: "hunter2!!",
            address: { street: "100 Bay St", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "INACTIVE",
        status: "PENDING",
        profileImageUrl: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: '3',
        name: { firstName: "Diego", lastName: "Ramirez" },
        userFields: {
            email: "dramirez@ucsc.edu",
            password: "scslug2025",
            confirmPassword: "scslug2025",
            address: { street: "44 Seabright Ave", city: "Santa Cruz", state: "CA", zip: "95062" },
        },
        gymStatus: "ACTIVE",
        status: "ACTIVE",
        profileImageUrl: "https://i.pravatar.cc/150?img=13",
    },
    {
        id: '4',
        name: { firstName: "Aisha", lastName: "Khan" },
        userFields: {
            email: "aikhan@ucsc.edu",
            password: "liftStrong!",
            confirmPassword: "liftStrong!",
            address: { street: "200 Laurel St", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "ACTIVE",
        status: "SUSPENDED",
        profileImageUrl: "https://i.pravatar.cc/150?img=14",
    },
    {
        id: '5',
        name: { firstName: "Noah", lastName: "Patel" },
        userFields: {
            email: "npatel@ucsc.edu",
            password: "gym-time",
            confirmPassword: "gym-time",
            address: { street: "5 Mission St", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "INACTIVE",
        status: "INACTIVE",
        profileImageUrl: "https://i.pravatar.cc/150?img=15",
    },
    {
        id: '6',
        name: { firstName: "Sofia", lastName: "Lopez" },
        userFields: {
            email: "slopez9@ucsc.edu",
            password: "bananaSlug!",
            confirmPassword: "bananaSlug!",
            address: { street: "500 River St", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "ACTIVE",
        status: "ACTIVE",
        profileImageUrl: "https://i.pravatar.cc/150?img=16",
    },
    {
        id: '7',
        name: { firstName: "Ethan", lastName: "Nguyen" },
        userFields: {
            email: "enguyen3@ucsc.edu",
            password: "pushpulllegs",
            confirmPassword: "pushpulllegs",
            address: { street: "888 Pacific Ave", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "INACTIVE",
        status: "PENDING",
        profileImageUrl: "https://i.pravatar.cc/150?img=17",
    },
    {
        id: '8',
        name: { firstName: "Lena", lastName: "Hernandez" },
        userFields: {
            email: "lhernandez@ucsc.edu",
            password: "cardioDays",
            confirmPassword: "cardioDays",
            address: { street: "120 Ocean St", city: "Santa Cruz", state: "CA", zip: "95060" },
        },
        gymStatus: "ACTIVE",
        status: "ACTIVE",
        profileImageUrl: "https://i.pravatar.cc/150?img=18",
    },
];

export const useUserStore = create<userStore> ((set) => ({

    user: mockUsers,

    addUser: (user) => set((state) => ({
        users: [...state.users, user]
    })),

    deleteUser: (id) => set((state) => ({
        users: state.users.filter((user) => user.id != id)
    })),

    editUser: (id: string, updatedUser: User) => set((state) => ({}))
}))
