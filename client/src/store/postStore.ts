import {create} from 'zustand'
import {mockPosts} from "@/types/mockData";

export type Category = "review" | "feedback" | "tutoring" | "career" | "meetup" ;
export type Subject = "science" | "math" | "physics" | "writing" | "computer science" | "engineering" | "art" | "astronomy" | "business" | "history" | "social studies" | "music" | "career development" | "other";
type PostStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export const CATEGORIES: Category[] = [
    "review",
    "feedback",
    "tutoring",
    "career",
    "meetup",
];

export const SUBJECTS: Subject[] = [
    "science",
    "math",
    "physics",
    "writing",
    "computer science",
    "engineering",
    "art",
    "astronomy",
    "business",
    "history",
    "social studies",
    "music",
    "career development",
    "other",
];

export type NewPostInput = {
    title: string;
    description: string;
    category: Category;
    subject: Subject;
    userId: string;
    userName: string;
}

export interface Post {
    id: string
    title: string
    description: string
    category: Category
    subject: Subject
    tags?: string[]

    userId: string
    userName: string

    createdAt: string
    updatedAt?: string
    postStatus: PostStatus

    replies?: number
    likes?: number
}

interface postStore {
    posts: Post[]

    newPost: (newPost: NewPostInput) => void
    updatePost: (id: string, updatedPost: Post) => void
    deletePost: (id: string) => void

    likedPostIds: Set<string>;
    toggleLike: (postId: string) => void;

    recommendedPosts: Post[];
    isRefreshingRecs: boolean;
}

export const usePostStore = create<postStore>((set) => ({
    posts: mockPosts,

    likedPostIds: new Set<string>(),

    recommendedPosts: [],
    isRefreshingRecs: false,


    // pass in the partial created post with on NewPostInput fields
    // let zustand handle the rest
    newPost: (input) =>
        set((state) => {
            const now = new Date().toISOString();
            const newPost: Post = {
                id: crypto.randomUUID(),
                title: input.title,
                description: input.description,
                category: input.category,
                subject: input.subject,
                tags: [],

                userId: input.userId,
                userName: input.userName,

                createdAt: now,
                updatedAt: now,
                postStatus: "OPEN",

                replies: 0,
                likes: 0,
            };

            return {
                posts: [...state.posts, newPost],
            };
        }),

    updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
        post.id === id ? {...post, ...updatedPost } : post
        ),
    })),

    deletePost: (id) => set((state) => ({
        posts: state.posts.filter((p) => p.id !== id)
    })),

    toggleLike: (postId) =>
        set((state) => {
            const liked = new Set(state.likedPostIds);
            const alreadyLiked = liked.has(postId);

            if (alreadyLiked) {
                liked.delete(postId);
            } else {
                liked.add(postId);
            }

            const nextPosts = state.posts.map((post) => {
                if (post.id !== postId) return post;

                const currentPost = post.likes ?? 0;
                const delta = alreadyLiked ? -1 : +1;
                return { ...post, likes: Math.max(0, currentPost + delta) };
            })

            return {
                posts: nextPosts,
                likedPostIds: liked,
            }
        })
}))