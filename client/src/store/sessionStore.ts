import {create} from 'zustand'
import {useUserStore} from "@/store/userStore";
import {mockSessions} from "@/types/mockData";

type SessionStatus = 'ACTIVE' | 'CLOSED'

type SessionLocation = 'ONLINE' | 'IN-PERSON' | 'HYBRID'

interface Address {
    street: string
    city: string
    zipCode: string
    state: string
}

export interface Session {
    id: string
    hostIds: string[]
    hostNames: string[]

    title: string
    description: string
    subject: string

    location: SessionLocation
    address?: Address
    meetingLink?: string;

    status: SessionStatus
    capacity?: number;

    startTime: string
    endTime: string

    createdAt: string;
    updatedAt?: string;

    replies?: number
    likes?: number;
}

export type NewSessionInput = {
    title: string;
    description: string;
    hostIds: string[];
    hostNames: string[];

    subject?: string;

    startTime: string;
    endTime: string;
    location: SessionLocation;
    address?: Address;
    meetingLink?: string;
    capacity?: number;
};

interface sessionStore {
    sessions: Session[]

    createSession: (newSession: Session) => void
    updateSession: (id: string, updatedSession: Session) => void
    deleteSession: (id: string) => void

    likedSessionIds: Set<string>;
    toggleLike: (postId: string) => void;

    recommendedSession: Session[];
    isRefreshingRecs: boolean;
}

export const useSessionStore = create<sessionStore>((set) => ({
    sessions: mockSessions,

    likedSessionIds: new Set<string>()
}))