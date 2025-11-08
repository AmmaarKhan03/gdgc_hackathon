import {usePostStore} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function Posts()  {

    const posts = usePostStore(state => state.posts);


    return (
        <div className="px-5 space-y-6">

            <input
                className="rounded-l border"
                type="text"
                placeholder="Search for relavent posts"

            />

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
        </div>
    )
}