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

export type CommentTree = Comment & { children: CommentTree[] } // creates type CommentTree, it will be a comment that can have an array of comments

interface CommentStore {
    commentsByPostId: Record<string, Comment[]> // grabs postId and gives it an array of comments per post
    addComment: (newComment: Omit<Comment, "id" | "createdAt" | "likes">) => Comment; //newComment of object Comment but omit(remove) keys "id" | "createdAt" | "likes", return a full Comment object
    toggleLike: (postId: string, commentId: string) => void; // pass in postId string, and comments id string
    getThread: (postId: string) => CommentTree[]; // grabs the postId and return the array of comments or a tree of comments for that post id
}

// variable to hold and exact array instance of comments for a post
const treeCache = new WeakMap<Comment[], CommentTree[]>(); // make a new WeakMap with Comment[] object as its first parameter
                                                           // and already built CommentTree[] as its second parameter
// we use WeakMap so if the array of objects is not being referenced its memory is garbage


// function to actually build the tree of comments
// define a list variable of type Comments object array
// its return type will be a CommentTree
function buildTree(list: Comment[]): CommentTree[] {
    // return the cached tree if we already have built it
    const cached = treeCache.get(list);
    if (cached) return cached;

    const byParent = new Map<string | null, Comment[]>(); // create a map, will pass in the parentID(string) or null(root comment) and a Comment array
    for (const comment of list) { // for each comment within the array of Comments(list)
        const key = comment.parentId ?? null;
        // The key is the parentId of the comment.
        // If parentId is undefined, convert it to null (meaning "no parent").
        if (!byParent.has(key)) byParent.set(key, []);
        // if we havent seen the parentId, create empty array in the map for it
        byParent.get(key)!.push(comment);
    }

    // pass in the parentId(string) or null(root comment), will return a CommentTree array type
    const make = (parentId: string | null): CommentTree[] =>
        // get all comments that reply to the current parentId
        //
        (byParent.get(parentId) ?? []).map((comment) => ({
            ...comment,
            children: make(comment.id),
        }))

    const tree = make(null);
    treeCache.set(list, tree);
    return tree;
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

export const useCommentStore = create<CommentStore>((set, get) => ({
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
        const list = get().commentsByPostId[postId] ?? [];
        return buildTree(list);
    },
}));