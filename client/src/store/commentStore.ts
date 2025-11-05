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

type CommentTree = Comment & {children: CommentTree[]} // creates type CommentTree, it will be a comment that can have an array of comments

interface CommentStore {
    commentsByPostId: Record<string, Comment[]> // grabs postId and gives it an array of comments per post
    addComment: (newComment: Omit<Comment, "id" | "createdAt" | "likes">) => Comment; //newComment of object Comment but omit(remove) keys "id" | "createdAt" | "likes", return a full Comment object
    toggleLike: (postId: string, commentId: string) => void; // pass in postId string, and comments id string
    getThread: (postId: string) => CommentTree[]; // grabs the postId and return the array of comments or a tree of comments for that post id
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

    // pass in the postId, parentCommentsId, usersId, users name, and the text for the comment
    addComment: ({postId, parentId, userId, userName, text}) => {
        // create a new comment
        const newComment = {
            id: crypto.randomUUID(), // create a random id, will need to change this to not be random but for now its ok
            postId, //pass the postId string for the comments postId string field
            parentId: parentId ?? null, // pass the parent commentId or null
            userId, // pass in the userId
            userName, // pass im the userName
            text, // pass in the text for comment
            createdAt: new Date().toISOString(), // create a new date for when comment is created
            likes: 0, // set the comments likes to 0
        }

        // grab the current state
        set((state) => {
            const arr = state.commentsByPostId[postId] ?? []; // look up the array of comments for the current postsId and set to arr will look like this arr = [comment1, comment2]
            return {
                commentsByPostId: {
                    ...state.commentsByPostId, // copies and flattens the current array of comments
                    [postId]: [...arr, newComment], // gets the current copied version of comments arr and passes the newly created comment object to it, then pass in the initial posts array of comments
                },
            };
        });
        return newComment;
    },

    // pass the postId and commentId for post we want to like
    toggleLike: (postId, commentId) =>
        // grab the current state
        set((state) => {
            const arr = state.commentsByPostId[postId] ?? []; // arr is Comment[] holds all comments from root Post
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