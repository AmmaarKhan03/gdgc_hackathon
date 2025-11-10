import {usePostStore, Post} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {useState, useEffect, useMemo} from "react";
import {Button} from "@/components/ui/button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from "@mui/material/FormGroup";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

type FilterKey = "title" | "description" | "subject" | "category";

export default function Posts() {

    const posts = usePostStore(state => state.posts);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const filterOptions = [
        {label: "Title", value: "title"},
        {label: "Description", value: "description"},
        {label: "Subject", value: "subject"},
        {label: "Category", value: "category"},
    ];

    // if selected filters is greater than 0 show only the selected filters else show all filters
    const allKeys = ["title", "description", "subject", "category"] as FilterKey[];
    const activeFilters = selectedFilters.length > 0 ? selectedFilters : (allKeys);

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

    // when a check box is clicked adds that filter or removes it
    const toggleFilter = (key: FilterKey) => {
        // check the current selected filters
        // use prev as last checked state
        setSelectedFilters((prev) =>
            // if prev already has the filtered key remove it and create new array of filters
            // else make add it and make new array with new filter key
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

    const selectAll = () => setSelectedFilters(allKeys);
    const clearAll = () => setSelectedFilters([]);

    return (
        <div className="px-5 space-y-6">

            <div className="flex items-center gap-3">
                <input
                    className="rounded-l border"
                    type="text"
                    placeholder="Search for relavent posts"
                    value={searchQuery}
                    onChange={handleSearch}
                />

                <Button
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    className="flex items-center gap-2"
                    aria-describedby={id}
                >
                    <FilterAltIcon fontSize="small"/>
                    Filters
                    {selectedFilters.length > 0 && (
                        <span>
                            {selectedFilters.length}
                        </span>
                    )}
                </Button>

                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                    transformOrigin={{vertical: "top", horizontal: "left"}}
                    sx={{mt:1}}
                >
                    <div className="px-2 py-1">
                        <div className="flex items-center justify-between px-1 py-1 space-x-2">
                            <span className="text-sm font-medium">Filter Fields</span>
                            <div className="flex gap-2">
                                <Button
                                    className="text-sm underline"
                                    onClick={selectAll}
                                    type="button"
                                >
                                    Select all
                                </Button>

                                <Button
                                    className="text-sm underline"
                                    onClick={clearAll}
                                    type="button"
                                >
                                    Clear all
                                </Button>
                            </div>
                        </div>
                        <Divider/>
                        <FormGroup sx={{ px: 1, py: 1 }}>
                            {filterOptions.map((opt) => (
                                <FormControlLabel
                                    key={opt.value}
                                    control={
                                        <Checkbox
                                            checked={selectedFilters.includes(opt.value as FilterKey)}
                                            onChange={() => toggleFilter(opt.value as FilterKey)}
                                            size="small"
                                        />
                                    }
                                    label={opt.label}
                                />
                            ))}
                        </FormGroup>
                        <Divider/>
                        <div className="flex justify-end px-1 py-1">
                            <Button onClick={() => setAnchorEl(null)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </Popover>
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