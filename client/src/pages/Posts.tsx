import {usePostStore, Post} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {useState, useEffect, useMemo} from "react";

export default function Posts() {

    const posts = usePostStore(state => state.posts);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);


    const [filteredItems, setFilteredItems] = useState([""]);
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }


    return (
        <div className="px-5 space-y-6">


            <input
                className="rounded-l border"
                type="text"
                placeholder="Search for relavent posts"
                value={searchQuery}
                onChange={handleSearch}
            />
            {filteredPosts.length === 0 ? (
                <p className="text-sm text-gray-500">No posts match your filters.</p>
            ) : (
                filteredPosts.map((post) => (
                    <Card key={post.id ?? post.title}>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {post.description}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}