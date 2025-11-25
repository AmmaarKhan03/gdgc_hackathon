import {useParams, useNavigate} from 'react-router-dom'
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {usePostStore} from "@/store/postStore";
import {MessageSquare, ThumbsUp, Tag as TagIcon, Clock, User as UserIcon, FolderOpen} from "lucide-react";
import {useState, useEffect, useRef} from "react";
import {useCommentStore, buildTree} from "@/store/commentStore";
import {CommentTree} from "@/store/commentStore";
import {useMemo} from "react";

const subjectToUpper = (subject: string) => {
    if (!subject) return;
    return subject.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const formatDate = (iso: string | undefined) => {
    if (!iso) return;

    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const statusClasses: Record<string, string> = {
    OPEN: "!bg-green-100 !text-green-800 !border !border-green-300",
    CLOSED: "!bg-red-100 !text-red-800 !border !border-red-300",
    RESOLVED: "!bg-blue-100 !text-blue-800 border !border-blue-300",
};

const categoryClasses: Record<string, string> = {
    tutoring: "bg-amber-100 text-amber-800 border border-amber-300",
    discussion: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    resource: "bg-sky-100 text-sky-800 border border-sky-300",
};

const EMPTY_COMMENTS: Comment[] = [];

function CommentNode({
                         node,
                         onReply,
                         onLike,
                         depth = 0,
                     }: {
    node: CommentTree;
    onReply: (parentId: string, text: string) => void;
    onLike: (id: string) => void;
    depth?: number;
}) {
    const [showForm, setShowForm] = useState(false);
    const [text, setText] = useState("");
    const likedCommentIds = useCommentStore((state) => state.likedCommentIds);
    const toggleLike = useCommentStore((state) => state.toggleLike);

    return (
        <div className="mt-3">
            <div
                className="rounded-md border p-3"
                style={{marginLeft: depth * 16}}
            >
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserIcon className="h-4 w-4"/>
                    <span className="font-medium">{node.userName}</span>
                    <span className="text-gray-400">• {new Date(node.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-3">{node.text}</p>

                <div className="mt-5 flex items-center gap-3 text-gray-700">
                    <Button
                        size="sm"
                        className="h-7 px-2 inline-flex items-center gap-1"
                        onClick={() => toggleLike(node.postId, node.id)}
                    >
                        <ThumbsUp className={`h-5 w-5 ${likedCommentIds.has(node.id) ? "fill-current" : ""}`}/>
                        {node.likes}
                    </Button>
                    <Button
                        size="sm"
                        className="h-7 px-2 inline-flex items-center gap-1"
                        onClick={() => setShowForm((s) => !s)}
                    >
                        <MessageSquare className="h-4 w-4"/>
                        Reply
                    </Button>
                </div>

                {showForm && (
                    <div className="mt-5 flex flex-col gap-2 space-y-5">
                        <textarea
                            className="border rounded px-2 py-1 w-full max-w-xl"
                            placeholder="Write a reply…"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={500}
                            rows={3}
                        />

                        <span>
                            <Button
                                size="sm"
                                className="self-start"
                                onClick={() => {
                                    if (!text.trim()) return;
                                    onReply(node.id, text.trim());
                                    setText("");
                                    setShowForm(false);
                                }}
                            >
                                Post
                            </Button>
                        </span>
                    </div>
                )}
            </div>

            {node.children.map((child) => (
                <CommentNode
                    key={child.id}
                    node={child}
                    onReply={onReply}
                    onLike={onLike}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
}

export default function PostComments() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [liked, setLiked] = useState<Set<string>>(new Set());
    {/* will make a set of multiple posts that have been liked*/
    }
    const toggleLiked = (id: string) => {
        setLiked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id); //once we get the posts id we will check the set to see if id is in it. Depending on state we will take away like or add one
            return next;
        })
    }

    const post = usePostStore((state) => state.posts.find((post) => post.id === id));
    const addComment = useCommentStore((state) => state.addComment);
    const toggleLike = useCommentStore((state) => state.toggleLike);
    const getThread = useCommentStore((state) => state.getThread);

    const rawList = useCommentStore(
        (s) => s.commentsByPostId[id!] ?? EMPTY_COMMENTS
    );

    const thread = useMemo(() => buildTree(rawList), [rawList]);

    if (!id) {
        return (
            <div className="p-4">
                <p className="text-red-700">No post id in URL.</p>
                <Button className="mt-3" onClick={() => navigate(-1)}>Go back</Button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-4">
                <p className="text-red-700">Post not found for id: {id}</p>
                <Button className="mt-3" onClick={() => navigate("/posts")}>All Posts</Button>
            </div>
        );
    }

    const onReplyRoot = (text: string) => {
        addComment({
            postId: id,
            parentId: null,
            userId: "U001",
            userName: "Iva Hackathon",
            text,
        });
    }

    const onReplyChild = (parentId: string, text: string) => {
        addComment({
            postId: id,
            parentId,
            userId: "U001",
            userName: "Iva Hackathon",
            text,
        });
    }

    const [rootText, setRootText] = useState("");

    return (
        <div className="px-5 space-y-4">

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        {post.title} <span className="text-gray-500">— {subjectToUpper(post.subject)}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full lg:w-1/2 space-y-3">
                        <p className="text-gray-800">{post.description}</p>

                        {/* root reply box */}
                        <div className="mt-4 flex gap-2">
                        <textarea
                            className="border rounded px-2 py-1 w-full max-w-xl"
                            placeholder="Write a comment…"
                            value={rootText}
                            onChange={(e) => setRootText(e.target.value)}
                            maxLength={500}
                            rows={3}
                        />
                        </div>

                        <span>
                        <Button
                            onClick={() => {
                                if (!rootText.trim()) return;
                                onReplyRoot(rootText.trim());
                                setRootText("");
                            }}
                        >
                            Comment
                        </Button>
                    </span>
                    </div>

                    {/* thread */}
                    <div className="mt-4">
                        {thread.length === 0 ? (
                            <p className="text-gray-500">No comments yet.</p>
                        ) : (
                            thread.map((node) => (
                                <CommentNode
                                    key={node.id}
                                    node={node}
                                    onReply={(parentId, text) => onReplyChild(parentId, text)}
                                    onLike={(commentId) => id && toggleLike(id, commentId)}
                                />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}