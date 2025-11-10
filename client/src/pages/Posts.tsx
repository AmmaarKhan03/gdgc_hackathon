import {usePostStore, Post} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {useState, useEffect, useMemo} from "react";
import {Button} from "@/components/ui/button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

type FilterKey = "title" | "description" | "subject" | "category";

export default function Posts() {

    const posts = usePostStore(state => state.posts);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);

    const filterOptions = [
        {label: "Title", value: "title"},
        {label: "Description", value: "description"},
        {label: "Subject", value: "subject"},
        {label: "Category", value: "category"},
    ];

    // if selected filters is greater than 0 show only the selected filters else show all filters
    const activeFilters = selectedFilters.length > 0 ? selectedFilters : (["title", "description", "subject", "category"] as const);

    const {filteredTitle, filteredDescription, filteredSubject, filteredCategory} = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) { // if the current search query doesn't have any text
            // then every child filter just contains all posts
            // we do this so we don't accidentally filter out posts before user types
            return {
                filteredTitle: posts,
                filteredDescription: posts,
                filteredSubject: posts,
                filteredCategory: posts,
            };
        }
        // else if text is entered
        // assign filteredTitle, filteredDescription, filteredSubject, filteredCategory to their respective values from the Post Object
        return {
            filteredTitle: posts.filter((post) => post.title.toLowerCase().includes(query)),
            filteredDescription: posts.filter((post) => post.description.toLowerCase().includes(query)),
            filteredSubject: posts.filter((post) => post.subject.toLowerCase().includes(query)),
            filteredCategory: posts.filter((post) => post.category.toLowerCase().includes(query)),
        };
    }, [posts, searchQuery]); // tell useMemo to only re-run if posts is updated or searchQuery is updated

    // buckets will be a record of out FilterKey strings and Post Object array
    const buckets: Record<FilterKey, Post[]> = {
        // assign each key title to the return of the filter names from useMemo
        title: filteredTitle,
        description: filteredDescription,
        subject: filteredSubject,
        category: filteredCategory,
    };

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts; // if no text is inputted to the search query show all Posts

        // create byId and assign it to newMap where it will be keyed by post.id to merge filtered lists without duplicates
        // If a post appears in multiple filters, it will only appear once in final results.
        const byId = new Map<string, Post>();

        // loop through the all or selected filters
        for (const key of activeFilters) {
            // loop through all the buckets at array index key (so either selected filters or all filters)
            for (const post of buckets[key]) byId.set(post.id, post); // store post in the map keyed by its id
                                                                      // If same post is found in another filter bucket, overwrite existing entry
        }

        return Array.from(byId.values()); // return an array of posts from byId Map
    }, [buckets, activeFilters, searchQuery, posts]); // only run useMemo when buckets, activeFilters, searchQuery, or posts changes

    const toggleFilter = (key: FilterKey) => {
        setSelectedFilters((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }


    return (
        <div className="px-5 space-y-6">

            <div className="">
                <input
                    className="rounded-l border"
                    type="text"
                    placeholder="Search for relavent posts"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div>
                    {filterOptions.map((option) =>
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    checked={selectedFilters.includes(option.value as FilterKey)}
                                    onChange={() => toggleFilter(option.value as FilterKey)}
                                />
                            }
                            label={option.label}
                        />
                    )}
                </div>
            </div>
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