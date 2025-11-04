import {useParams, useNavigate} from 'react-router-dom'
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {usePostStore} from "@/store/postStore";
import {MessageSquare, ThumbsUp, Tag as TagIcon, Clock, User as UserIcon, FolderOpen} from "lucide-react";
import {useState, useEffect, useRef} from "react";

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

    return (
        <div className="px-5 space-y-6">
            <Card key={post.id} className="shadow-sm border rounded-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="relative flex items-center justify-between">
                        {/*Users name*/}
                        <span
                            className="text-sm font-medium text-gray-700 relative flex items-center justify-between space-x-2">
                            <UserIcon className="h-5 w-5"/>
                            <span>{post.userName}</span>
                        </span>

                        {/*Post Subject*/}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 text-lg text-center w-full justify-between">
                            {post.title}{" "}
                            <span className="text-gray-500">
                                — {subjectToUpper(post.subject)}
                            </span>
                        </div>

                        {/*Posts status */}
                        {post.postStatus && (
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusClasses[post.postStatus] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                                {post.postStatus}
                            </span>
                        )}
                    </CardTitle>

                    <div
                        className="mt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start text-sm">
                        {post.createdAt && (
                            <span className="inline-flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4"/>
                                <span
                                    title={formatDate(post.createdAt)}>{formatDate(post.createdAt)}</span>
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex-1 flex justify-center">
                        {post.description}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-1 items-center space-y-2">
                    <div className="mt-2 flex items-center gap-4 text-gray-700">
                        <span className="inline-flex items-center gap-1">
                            <Button
                                onClick={() => toggleLiked(post.id)}
                            >
                                <ThumbsUp
                                    className={`h-5 w-5 ${liked.has(post.id) ? "fill-current" : ""}`}/>
                                {(post.likes ?? 0) + (liked.has(post.id) ? 1 : 0)}
                            </Button>
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}