import {usePostStore, Post} from "@/store/postStore";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {useState, useEffect, useMemo} from "react";
import {Button} from "@/components/ui/button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from "@mui/material/FormGroup";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {MessageSquare, ThumbsUp, User as UserIcon, ArrowRightToLine, ArrowLeftToLine, MoveRight, MoveLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useCommentStore} from "@/store/commentStore";

type FilterKey = "title" | "description" | "subject" | "category";

export default function Posts() {

    const posts = usePostStore(state => state.posts);
    const likedPostIds = usePostStore((state) => state.likedPostIds);
    const toggleLike = usePostStore((state) => state.toggleLike);
    const commentsByPost = useCommentStore((state) => state.commentsByPostId);
    const navigate = useNavigate();
    const goToComments = (id: string) => {
        navigate(`/posts/${id}/comments`);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedFilters, posts]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const startPage = (page - 1) * pageSize;
    const endPage = startPage + pageSize;
    const pagedPosts = useMemo(() =>
        filteredPosts.slice(startPage, endPage),
        [filteredPosts, startPage, endPage],
    )

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

    const statusClasses: Record<string, string> = {
        OPEN: "!bg-green-100 !text-green-800 !border !border-green-300",
        CLOSED: "!bg-red-100 !text-red-800 !border !border-red-300",
        RESOLVED: "!bg-blue-100 !text-blue-800 border !border-blue-300",
    };

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


    return (
        <div className="px-5 space-y-6">

            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                        {searchQuery.trim() ? "Search Results" : "All Posts"}

                        <div className="flex items-center gap-2">
                            <input
                                className="h-9 px-3 border rounded-md"
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
                                {selectedFilters.length > 0 && (<span> {selectedFilters.length}</span>)}
                            </Button>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                transformOrigin={{vertical: "top", horizontal: "right"}}
                                sx={{mt: 1}}
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
                                    <FormGroup sx={{px: 1, py: 1}}>
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
                    </CardTitle>
                </CardHeader>


                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    {filteredPosts.length === 0 ? (
                        <p className="text-sm text-gray-500">No posts match your filters.</p>
                    ) : (
                        pagedPosts.map((post) => (
                            <Card className="h-full flex flex-col shadow-sm border rounded-lg"
                                  key={post.id ?? post.title}>
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

                                        {post.postStatus && (
                                            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${statusClasses[post.postStatus]}`}>
                                                {post.postStatus}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>


                                <CardContent className="flex-1 flex justify-center">
                                    {post.description}
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
                        ))
                    )}
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-0">
                    {/* Left: range info */}
                    <span className="text-sm text-gray-600">
    {filteredPosts.length === 0
        ? "0 results"
        : `${startPage + 1}–${Math.min(endPage, filteredPosts.length)} of ${filteredPosts.length}`}
  </span>

                    {/* Right: arrows + page number */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                            aria-label="First page"
                            className="h-9 px-3"
                        >
                            <ArrowLeftToLine/>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            aria-label="Previous page"
                            className="h-9 px-3"
                        >
                            <MoveLeft/>
                        </Button>
                        <span className="text-sm tabular-nums">
                            Page {page} of {totalPages}
                        </span>

                        <Button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            aria-label="Next page"
                            className="h-9 px-3"
                        >
                            <MoveRight/>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages}
                            aria-label="Last page"
                            className="h-9 px-3"
                        >
                            <ArrowRightToLine/>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}