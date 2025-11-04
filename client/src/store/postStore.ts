import {create} from 'zustand'

type Category = "review" | "feedback" | "tutoring";
type Subject = "science" | "math" | "writing" | "computer science" | "engineering" | "art" | "business" | "history" | "social studies" | "music" | "other";
type PostStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

interface Post {
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
    newPost: (newPost: Post) => void
    updatePost: (id: string, updatedPost: Post) => void
    deletePost: (id: string) => void
}

export const mockPosts: Post[] = [
    {
        id: "POST-001",
        title: "Help debugging pointers in CSE 13S",
        description:
            "I'm stuck on a segmentation fault in my linked list assignment. Looking for someone to review my code and help me understand memory allocation.",
        category: "tutoring",
        subject: "computer science",
        tags: ["C", "pointers", "linked list"],
        userId: "U001",
        userName: "Ivan Argueta",
        createdAt: new Date("2025-11-01T10:30:00Z").toISOString(),
        updatedAt: new Date("2025-11-01T11:00:00Z").toISOString(),
        postStatus: "OPEN",
        replies: 2,
        likes: 5,
    },
    {
        id: "POST-002",
        title: "Essay feedback needed for WRIT 2",
        description:
            "Could someone review my essay draft on digital media and attention spans? Mainly need help with structure and transitions.",
        category: "review",
        subject: "writing",
        tags: ["essay", "feedback", "writing"],
        userId: "U002",
        userName: "Samantha Lee",
        createdAt: new Date("2025-11-02T14:15:00Z").toISOString(),
        postStatus: "OPEN",
        replies: 3,
        likes: 7,
    },
    {
        id: "POST-003",
        title: "Math 19A — Need help with derivatives",
        description:
            "Trying to understand chain rule and implicit differentiation before the midterm. Anyone free to tutor this weekend?",
        category: "tutoring",
        subject: "math",
        tags: ["calculus", "derivatives", "chain rule"],
        userId: "U003",
        userName: "Carlos Ramirez",
        createdAt: new Date("2025-11-02T18:45:00Z").toISOString(),
        postStatus: "IN_PROGRESS",
        replies: 1,
        likes: 4,
    },
    {
        id: "POST-004",
        title: "Looking for feedback on art portfolio",
        description:
            "I’m preparing my digital art submission for the UCSC showcase. Would love a peer review on composition and lighting.",
        category: "feedback",
        subject: "art",
        tags: ["digital art", "portfolio", "critique"],
        userId: "U004",
        userName: "Maya Chen",
        createdAt: new Date("2025-11-03T09:10:00Z").toISOString(),
        postStatus: "OPEN",
        replies: 0,
        likes: 2,
    },
];

export const usePostStore = create<postStore>((set) => ({
    posts: mockPosts,

    newPost: (post) => set((state) => ({
        posts: [...state.posts, post]
    })),

    updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
        post.id === id ? {...post, ...updatedPost } : post
        ),
    })),

    deletePost: (id) => set((state) => ({
        posts: state.posts.filter((p) => p.id !== id)
    }))
}))