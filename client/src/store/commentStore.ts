import {create} from 'zustand'

export interface Comment {
    id: string
    postId: string
    parentId: string | null
    userId: string
    userName: string
    text: string
    createdAt: string
    likes: number
}

type CommentTree = Comment & {children: CommentTree[]}

interface CommentStore {
    commentsByPostId: Record<string, Comment[]>
    addComment: (newComment: Omit<Comment, "id" | "createdAt" | "likes">) => Comment;
    toggleLike: (postId: string, commentId: string) => void;
    getThread: (postId: string) => CommentTree[];
}

const mockComments: Record<string, Comment[]> = {
    "POST-001": [
        {
            id: "C-1",
            postId: "POST-001",
            parentId: null,
            userId: "U010",
            userName: "Alex",
            text: "Can you share a minimal repro?",
            createdAt: new Date("2025-11-01T11:10:00Z").toISOString(),
            likes: 1,
        },
        {
            id: "C-2",
            postId: "POST-001",
            parentId: "C-1",
            userId: "U001",
            userName: "Ivan Argueta",
            text: "Yep, pushing now—thanks!",
            createdAt: new Date("2025-11-01T11:15:00Z").toISOString(),
            likes: 0,
        },
    ],
};

export const useCommentStore = create<CommentStore> ((set, get) => ({
    commentsByPostId: mockComments,

    addComment: ({postId, parentId, userId, userName, text}) => {
        const newComment = {
            id: crypto.randomUUID(),
            postId,
            parentId: parentId ?? null,
            userId,
            userName,
            text,
            createdAt: new Date().toISOString(),
            likes: 0,
        }

        set((state) => {
            const arr = state.commentsByPostId[postId] ?? [];
            return {
                commentsByPostId: {
                    ...state.commentsByPostId,
                    [postId]: [...arr, newComment],
                },
            };
        });
        return newComment;
    },

    toggleLike: (postId, commentId) =>
        set((state) => {
            const arr = state.commentsByPostId[postId] ?? [];
            const next = arr.map((comment) =>
            comment.id === commentId ? {...comment, likes: comment.likes + 1} : comment
            );
            return {commentsByPostId: {...state.commentsByPostId, [postId]: next}};
        }),

    getThread: (postId) => {
        const flat = get().commentsByPostId[postId] ?? [];
        const byParent = new Map<string | null, Comment[]>();
        flat.forEach((comment) => {
            const key = comment.parentId;
            if (!byParent.has(key)) byParent.set(key, []);
            byParent.get(key)!.push(comment);
        });

        const build = (parentId: string | null): CommentTree[] =>
            (byParent.get(parentId) ?? []).map((c) => ({
                ...c,
                children: build(c.id),
            }));

        return build(null);
    },
}));