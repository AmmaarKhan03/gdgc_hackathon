import {useSessionStore} from "@/store/sessionStore";
import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {useState, useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from "@mui/material/FormGroup";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
    MessageSquare,
    ThumbsUp,
    User as UserIcon,
    ArrowRightToLine,
    ArrowLeftToLine,
    MoveRight,
    MoveLeft,
    Clock
} from "lucide-react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import {motion} from "framer-motion";

type FilterKey = "title" | "description" | "subject" | "category";

export default function Sessions() {

    const sessions = useSessionStore((state) => state.sessions)

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filterOptions = [
        {label: "Title", value: "title"},
        {label: "Description", value: "description"},
        {label: "Subject", value: "subject"},
        {label: "Category", value: "category"},
    ];

    const allKeys = ["title", "description", "subject", "category"] as FilterKey[];

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

    const selectAll = () => setSelectedFilters(allKeys);
    const clearAll = () => setSelectedFilters([]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const formatTime = (iso: string | undefined) => {
        if (!iso) return;

        return new Date(iso).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    function formatTimeRange(startIso: string, endIso: string) {
        return `${formatTime(startIso)} – ${formatTime(endIso)}`;
    }

    function formatDate(iso: string | undefined) {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString([], {
            weekday: "long",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <div className="px-5 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center justify-between w-full">

                        <div className="flex-1 text-left">
                            {searchQuery.trim() ? "Search Results" : "All Sessions"}
                        </div>


                        <div className="flex-1 flex justify-center space-x-3">
                            <input
                                className="h-9 w-3/4 max-w-md px-3 border rounded-l rounded-r"
                                type="search"
                                placeholder="Search for relevant sessions"
                                value={searchQuery}
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

                        <div className="flex-1 flex justify-end items-center gap-2">
                            <Button
                                // onClick={handleModalOpen}
                            > {/*Button to open modal, when pressed changes the isModalOpen to true*/}
                                Create Session
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid grid-cols-5 gap-6 pt-6">
                        {/* LEFT: All Sessions (takes 2 columns) */}
                        <section className="col-span-3 space-y-4">

                            {/* put your sessions.map() here */}
                            {sessions.map((session) => (
                                <motion.div
                                    key={session.id}
                                    whileHover={{y: -6, scale: 1.01}}
                                    whileTap={{y: -2}}
                                    transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                    className="relative z-0"
                                >
                                    <Card key={session.id}>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="pb-2">
                                                {session.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 grid grid-cols-5 gap-6 pt-6">
                                            <div className="col-span-3 space-y-2">
                                                <div className="gap-2 flex items-center">
                                                    <AccessTimeIcon/>
                                                    <span>
                                                {formatTimeRange(session.startTime, session.endTime)}
                                                </span>
                                                </div>

                                                <div className="gap-2 flex items-center mt-1">
                                                    <CalendarMonthIcon/>
                                                    <span className="text-gray-600">
                                                    {formatDate(session.startTime)}
                                                </span>
                                                </div>

                                                <div className="gap-2 flex">
                                                    <LocationPinIcon/>
                                                    <span>
                                                    {session.location}
                                                </span>
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <div>
                                                    {session.description}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="flex items-center justify-between w-full mt-3">
                                            <Button
                                                className="!bg-transparent !border-transparent text-blue-600 mb-3"
                                            >View session details</Button>

                                            <div className="flex items-center gap-2">
                                            <Button>
                                                <ThumbsUp className={`h-5 w-5`}/>
                                            </Button>

                                                <Button>
                                                    <MessageSquare className={`h-5 w-5`}/>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </section>

                        {/* RIGHT: Today + Popular stacked */}
                        <aside className="col-span-2 flex flex-col gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Today</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* sessions happening today go here */}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Popular</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* most-liked / most-joined sessions go here */}
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}