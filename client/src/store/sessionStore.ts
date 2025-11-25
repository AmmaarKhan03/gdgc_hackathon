import {create} from 'zustand'
import {useUserStore} from "@/store/userStore";
import {mockSessions} from "@/types/mockData";

type SessionStatus = 'ACTIVE' | 'CLOSED'

export type SessionLocation = 'ONLINE' | 'IN_PERSON' | 'HYBRID'

interface Address {
    street: string
    city: string
    zipCode: string
    state: string
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
    capacity?: string;
};

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
    capacity?: string;

    startTime: string
    endTime: string

    createdAt: string;
    updatedAt?: string;

    replies?: number
    likes?: number;
}

interface sessionStore {
    sessions: Session[]

    createSession: (newSession: NewSessionInput) => void
    updateSession: (id: string, updatedSession: Session) => void
    deleteSession: (id: string) => void

    likedSessionIds: Set<string>;
    toggleLike: (postId: string) => void;

    recommendedSessions: Session[];
    isRefreshingRecs: boolean;
}

export const useSessionStore = create<sessionStore>((set) => ({
    sessions: mockSessions,

    likedSessionIds: new Set<string>(),

    recommendedSessions: [],
    isRefreshingRecs: false,

    createSession: (input) =>
        set((state) => {
            const now = new Date().toISOString();

            const newSession: Session = {
                id: crypto.randomUUID(),
                title: input.title,
                description: input.description,
                hostIds: input.hostIds,
                hostNames: input.hostNames,
                subject: input.subject ?? "",

                startTime: input.startTime,
                endTime: input.endTime,
                location: input.location,
                address: input.address,
                meetingLink: input.meetingLink,

                status: "ACTIVE",
                capacity: input.capacity,

                createdAt: now,
                updatedAt: now,
                replies: 0,
                likes: 0,
            };

            return {
                sessions: [...state.sessions, newSession],
            };
        }),

    updateSession: (id, updatedSession) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === id ? { ...session, ...updatedSession } : session
            ),
        })),

    deleteSession: (id) =>
        set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== id),
        })),

    toggleLike: (sessionId) =>
        set((state) => {
            const liked = new Set(state.likedSessionIds);
            const alreadyLiked = liked.has(sessionId);

            if (alreadyLiked) {
                liked.delete(sessionId);
            } else {
                liked.add(sessionId);
            }

            const nextSessions = state.sessions.map((session) => {
                if (session.id !== sessionId) return session;

                const currentLikes = session.likes ?? 0;
                const delta = alreadyLiked ? -1 : +1;

                return { ...session, likes: Math.max(0, currentLikes + delta) };
            });

            return {
                sessions: nextSessions,
                likedSessionIds: liked,
            };
        }),
}));