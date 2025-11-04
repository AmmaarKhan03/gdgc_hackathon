import {useParams, useNavigate} from 'react-router-dom'
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {usePostStore} from "@/store/postStore";

export default function PostComments() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

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
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}