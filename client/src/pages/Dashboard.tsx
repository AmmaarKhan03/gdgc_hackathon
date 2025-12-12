import {useState, useEffect, useMemo} from 'react';
import {api} from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";
import CapacityPieChart from "@/components/CapacityPieChart";
import {usePostStore, Post, Category, SUBJECTS, CATEGORIES} from "@/store/postStore";
import {
    MessageSquare,
    ThumbsUp,
    Tag as TagIcon,
    Clock,
    User as UserIcon,
    FolderOpen,
    ArrowRightToLine,
    ArrowLeftToLine,
    MoveRight,
    MoveLeft
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useCommentStore} from "@/store/commentStore";
import {motion} from "framer-motion";
import {useSessionStore} from "@/store/sessionStore";
import Divider from "@mui/material/Divider";

const subjectToUpper = (subject: string) => {
    if (!subject) return;
    return subject.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const categoryToUpper = (subject: string) => {
    if (!subject) return;

    return subject.charAt(0).toUpperCase() + subject.slice(1)
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

function categoryTypeBar(postCategory?: string) {
    return {
        review: 'border-l-4 border-l-blue-600 border-b-blue-600',
        feedback: 'border-l-4 border-l-amber-500 border-b-amber-500',
        tutoring: 'border-l-4 border-l-green-600 border-b-green-600',
        career: 'border-l-4 border-l-red-400 border-b-red-400',
        meetup: 'border-l-4 border-l-purple-500 border-b-purple-500',
    }[postCategory ?? 'review'] ?? '';
}

export default function Dashboard() {
    const navigate = useNavigate();
    const goToComments = (id: string) => {
        navigate(`/posts/${id}/comments`);
    };

    const users = useUserStore(state => state.users);
    const sessions = useSessionStore((state) => state.sessions);
    const currentUsers = users.length;
    const totalUsers = 153;
    const posts = usePostStore(state => state.posts);
    const likedPostIds = usePostStore((state) => state.likedPostIds);
    const toggleLike = usePostStore((state) => state.toggleLike);
    const commentsByPost = useCommentStore((state) => state.commentsByPostId);
    const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
    const [isRefreshingRecs, setIsRefreshingRecs] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 4;
    const totalPages = Math.max(Math.ceil(posts.length / pageSize));
    useEffect(() => {
        setPage(1);
    }, [posts]);
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [posts, totalPages]);
    const startPage = (page - 1) * pageSize;
    const endPage = startPage + pageSize;
    const pagedPosts = useMemo(() =>
            posts.slice(startPage, endPage),
        [posts, startPage, endPage],
    )


    const stats = [
        {label: "Total Students", value: totalUsers, color: "bg-blue-100 border-blue-400 text-blue-800"},
        {label: "Active Sessions", value: currentUsers, color: "bg-yellow-100 border-yellow-400 text-yellow-800"},
        {label: "New Posts Created", value: 73, color: "bg-green-100 border-green-400 text-green-800"},
        {label: "New Reviews/Feedback", value: "Temp Value", color: "bg-purple-100 border-purple-400 text-purple-800"},
    ];
    // grab the set of likedPostIds that user has liked
    const likedPosts = useMemo(() => {
        const samePosts: Post[] = [];
        for (const post of posts) {
            if (likedPostIds.has(post.id)) { // if an id from the posts in store matches from all posts
                samePosts.push(post); // push that entire post to the likedPosts array
            }
        }
        return samePosts;
    }, [posts, likedPostIds])// created Post array set to empty to store the like Post objects entirely

    // finds the post with the most liked within posts
    const maxLikes = useMemo(() => {
        let maxLikes = 0;

        for (const post of posts) {
            const postLikes = post.likes ?? 0;
            if (postLikes > maxLikes) maxLikes = postLikes;
        }
        return maxLikes;
    }, [posts]);

    const userVector = useMemo(() => {
        if (likedPosts.length === 0) {
            const dim = CATEGORIES.length + SUBJECTS.length + 2;
            return new Array(dim).fill(0);
        }

        const dim = CATEGORIES.length + SUBJECTS.length + 2;
        const sum = new Array(dim).fill(0);

        for (const post of likedPosts) {
            const vector = getPostVector(post, maxLikes);
            for (let i = 0; i < dim; i++) {
                sum[i] += vector[i];
            }
        }

        for (let i = 0; i < dim; i++) {
            sum[i] /= likedPosts.length;
        }

        return sum;
    }, [likedPosts, maxLikes]);


    function getCategoryVector(post: Post): number[] {
        const vector = new Array(CATEGORIES.length).fill(0); // create vector that is size of CATEGORIES and set all values to 0

        const index = CATEGORIES.indexOf(post.category); // grab the index of the category within categories

        if (index !== -1) { // check if its a valid index
            vector[index] = 1; // set only that index in the vector to 1
        }
        return vector; // return the vector looks something like this [0,0,1,0,0]
    }

    function getSubjectVector(post: Post): number[] {
        const vector = new Array(SUBJECTS.length).fill(0); // create vector that is size of SUBJECTS and set all values to 0

        const index = SUBJECTS.indexOf(post.subject); // grab the index of the category within subjects

        if (index !== -1) { // check if its a valid index
            vector[index] = 1; // set only that index in the vector to 1
        }
        return vector; // return the vector looks something like this [0,0,1,0,0]
    }

    // returns the popularity of a post either 0,1
    function getPostPopularity(post: Post, maxLikes: number): number {
        const likes = post.likes ?? 0;
        if (maxLikes <= 0) return 0;
        return likes / maxLikes;
    }

    function getRecentScore(post: Post): number {
        if (!post.createdAt) return 0;

        const created = new Date(post.createdAt).getTime();
        const now = Date.now();
        const msPerDay = 1000 * 60 * 60 * 24;
        const postAge = (now - created) / msPerDay;

        if (postAge <= 0) return 1;
        if (postAge > 30) return 0;

        return 1 - postAge / 30;
    }

    // function that will return the full vector of a liked posts
    function getPostVector(post: Post, maxLikes: number): number[] {
        const categoryVector = getCategoryVector(post);
        const subjectVector = getSubjectVector(post);
        const popularity = getPostPopularity(post, maxLikes);
        const recent = getRecentScore(post);

        return [
            ...categoryVector,
            ...subjectVector,
            popularity,
            recent,
        ];
    }

    // function that will check how similar the liked posts are to posts
    function cosineSimilarity(user: number[], post: number[]): number {
        if (user.length != post.length) return 0;

        let dot = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;

        for (let i = 0; i < user.length; i++) {
            dot += user[i] * post[i];
            magnitudeA += user[i] * user[i];
            magnitudeB += post[i] * post[i];
        }

        if (magnitudeA === 0 || magnitudeB === 0) return 0;

        return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
    }

    useEffect(() => {
        // If user has no interest vector, clear recs
        if (userVector.every((v) => v === 0)) {
            setRecommendedPosts([]);
            return;
        }

        setIsRefreshingRecs(true);

        const timeoutId = setTimeout(() => {
            const scored: { post: Post; score: number }[] = [];

            for (const post of posts) {
                // Skip posts the user already liked
                if (likedPostIds.has(post.id)) continue;

                const vector = getPostVector(post, maxLikes);
                const score = cosineSimilarity(userVector, vector);

                scored.push({post, score});
            }

            scored.sort((a, b) => b.score - a.score);

            const top = scored.slice(0, 5).map((item) => item.post);

            setRecommendedPosts(top);
            setIsRefreshingRecs(false);
        }, 800); // 800ms "API wait" – tweak this value to taste

        // Cleanup if dependencies change before timeout finishes
        return () => clearTimeout(timeoutId);
    }, [posts, likedPostIds, userVector, maxLikes]);

    const sessionsMadeToday = useMemo(() => {
        if (!sessions || sessions.length === 0) return [];

        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        return sessions.filter((session) => {
            const timestamp = session.createdAt;
            if (!timestamp) return false;

            const createdTime = new Date(timestamp).getTime();
            return now - createdTime <= ONE_DAY;
        })
    }, [sessions]);


    return (
        <div className="px-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                        {stats.map((item, index) => (
                            <Card
                                key={index}
                                className={`h-full shadow-sm border rounded-lg ${item.color} flex flex-col min-h-[100px]`}
                            >
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-lg text-center">{item.label}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex items-center justify-center">
                                    <p className="text-4xl font-semibold text-center">{item.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="space-y-2">
                        <CardHeader>
                            <CardTitle>
                                Recent Posts
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {pagedPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    whileHover={{y: -6, scale: 1.01}}
                                    whileTap={{y: -2}}
                                    transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                    className="relative z-0"
                                >
                                    <Card
                                        className={`bg-white rounded-sm border shadow-sm hover:shadow transition-all ${categoryTypeBar(post.category)}`}
                                        key={post.id ?? post.title}
                                    >
                                        <CardHeader className="pb-2">
                                            <CardHeader className="pb-2">
                                                <div className="relative flex items-center w-full">


                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="h-5 w-5"/>
                                                        <span className="text-sm font-medium text-gray-700 truncate">
                                                {post.userName}
                                            </span>
                                                    </div>

                                                    <h3 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-center break-words">
                                                        {post.title}{" "}
                                                        <span className="text-gray-500">— {subjectToUpper(post.subject)}</span>
                                                    </h3>

                                                    {post.category && (
                                                        <span
                                                            className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${categoryClasses[post.category]}`}>
                                                            {categoryToUpper(post.category)}
                                                        </span>
                                                    )}
                                                </div>

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
                                                    onClick={() => toggleLike(post.id)}
                                                >
                                                    <ThumbsUp
                                                        className={`h-5 w-5 ${likedPostIds.has(post.id) ? "fill-current" : ""}`}/>
                                                    {post.likes ?? 0}
                                                </Button>
                                            </span>
                                                <span className="inline-flex items-center gap-1">
                                                <Button
                                                    onClick={() => goToComments(post.id)}
                                                >
                                                    <MessageSquare className="h-5 w-5"/>
                                                    {commentsByPost[post.id]?.length ?? 0}
                                                </Button>
                                            </span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-4 h-fit">
                    <CapacityPieChart current={currentUsers} capacity={totalUsers}/>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Recommended Posts For You
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">

                            {isRefreshingRecs && (
                                <p className="text-xs text-gray-400 mb-2">
                                    Updating your recommendations...
                                </p>
                            )}

                            {recommendedPosts.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Like a few posts to get personalized recommendations.
                                </p>
                            )}

                            {recommendedPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    whileHover={{y: -6, scale: 1.01}}
                                    whileTap={{y: -2}}
                                    transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                    className="relative z-0"
                                >
                                    <div
                                        key={post.id}
                                        className={`bg-white rounded-sm border shadow-sm hover:shadow transition-all border rounded-md p-2 cursor-pointer ${categoryTypeBar(post.category)}`}
                                        onClick={() => navigate(`/posts/${post.id}/comments`)}
                                    >
                                        <div>
                                            <span className="text-md font-semibold">{post.title}</span> - <span className="text-md text-gray-500 font-">{post.userName}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {subjectToUpper(post.subject)} • {post.category}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Current Sessions
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            {sessionsMadeToday.map((session) => (
                                <motion.div
                                    key={session.id}
                                    whileHover={{y: -6, scale: 1.01}}
                                    whileTap={{y: -2}}
                                    transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                    className="relative z-0"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{session.title}</CardTitle>
                                            <Divider/>
                                        </CardHeader>

                                        <CardContent>
                                            {session.description}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    )
}

