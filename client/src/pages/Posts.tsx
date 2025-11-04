import {usePostStore} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function Posts()  {

    const posts = usePostStore(state => state.posts);

    return (
        <>
            this is the post page

            {posts.map((post) => (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {post.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {post.description}
                    </CardContent>
                </Card>
            ))}
        </>
    )
}