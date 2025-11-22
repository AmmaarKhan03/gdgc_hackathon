import {Session, useSessionStore, SessionLocation} from "@/store/sessionStore";
import {Card, CardTitle, CardHeader, CardContent, CardFooter, CardDescription} from "@/components/ui/card";
import {useState, useEffect, useMemo} from "react";
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
    ArrowRightToLine,
    ArrowLeftToLine,
    MoveRight,
    MoveLeft,
    Clock
} from "lucide-react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import {motion} from "framer-motion";
import {useCommentStore} from "@/store/commentStore";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "@/store/userStore";
import Modal from '@mui/material/Modal';
import GroupsIcon from '@mui/icons-material/Groups';
import {Sparkles} from "lucide-react";

type FilterKey = "title" | "description" | "location";

export default function Sessions() {

    const sessions = useSessionStore((state) => state.sessions);
    const likedSessionIds = useSessionStore((state) => state.likedSessionIds);
    const toggleLike = useSessionStore((state) => state.toggleLike);
    const commentsBySession = useCommentStore((state) => state.commentsByPostId);
    const navigate = useNavigate();
    const goToComments = (id: string) => {
        navigate(`/session/${id}/comments`);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const createSession = useSessionStore((state) => state.createSession);
    const currentUser = useUserStore((state) => state.currentUser);

    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formSubject, setFormSubject] = useState("");
    const [formLocation, setFormLocation] = useState<SessionLocation | "">("");
    const [formStreet, setFormStreet] = useState("");
    const [formCity, setFormCity] = useState("");
    const [formZip, setFormZip] = useState("");
    const [formState, setFormState] = useState("");
    const [formMeetingLink, setFormMeetingLink] = useState("");
    const [formCapacity, setFormCapacity] = useState("");
    const [formStartTime, setFormStartTime] = useState("");
    const [formEndTime, setFormEndTime] = useState("");

    const handleCreateSession = (event: React.FormEvent) => {
        event.preventDefault();

        console.log("Submitting session", {
            formTitle,
            formDescription,
            formSubject,
            formLocation,
            formStreet,
            formCity,
            formZip,
            formState,
            formMeetingLink,
            formCapacity,
            formStartTime,
            formEndTime
        })

        if (!formTitle.trim() || !formDescription.trim()) return;

        if (!currentUser) {
            console.warn("No currentUser, cannot create post");
            return;
        }

        const address =
            formLocation === "IN_PERSON" || formLocation === "HYBRID"
                ? {
                    street: formStreet,
                    city: formCity,
                    state: formState,
                    zipCode: formZip,
                }
                : undefined;

        createSession({
            title: formTitle,
            description: formDescription,
            subject: formSubject,
            startTime: formStartTime,
            endTime: formEndTime,
            location: formLocation as SessionLocation,
            address,
            meetingLink: formMeetingLink || undefined,
            capacity: formCapacity || undefined,

            hostIds: [currentUser.id],
            hostNames: [`${currentUser.name.firstName} ${currentUser.name.lastName}`],
        })

        console.log("Created post successfully");

        setFormTitle("");
        setFormDescription("");
        setFormSubject("");
        setFormLocation("");
        setFormStreet("");
        setFormCity("");
        setFormZip("");
        setFormState("");
        setFormMeetingLink("");
        setFormCapacity("");
        setFormStartTime("");
        setFormEndTime("");
        setIsModalOpen(false);
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filterOptions = [
        {label: "Title", value: "title"},
        {label: "Description", value: "description"},
        {label: "Location", value: "location"},
    ];

    const allKeys = ["title", "description", "location"] as FilterKey[];
    const activeFilters = selectedFilters.length > 0 ? selectedFilters : (allKeys);

    const {filteredTitle, filteredDescription, filteredLocation} = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return {
                filteredTitle: sessions,
                filteredDescription: sessions,
                filteredLocation: sessions,
            };
        }

        return {
            filteredTitle: sessions.filter((session) => session.title.toLowerCase().includes(query)),
            filteredDescription: sessions.filter((session) => session.description.toLowerCase().includes(query)),
            filteredLocation: sessions.filter((session) => session.location.toLowerCase().includes(query)),
        }
    }, [sessions, searchQuery]);

    const buckets: Record<FilterKey, Session[]> = {
        // assign each key title to the return of the filter names from useMemo
        title: filteredTitle,
        description: filteredDescription,
        location: filteredLocation,
    };

    const filteredSessions = useMemo(() => {
        if (!searchQuery.trim()) return sessions;

        const byId = new Map<string, Session>();

        for (const key of activeFilters) {
            for (const session of buckets[key]) byId.set(session.id, session);
        }

        return Array.from(byId.values());
    }, [buckets, activeFilters, searchQuery, sessions])

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedFilters]);

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const startPage = (page - 1) * pageSize;
    const endPage = startPage + pageSize;
    const pagedSessions = useMemo(() =>
            filteredSessions.slice(startPage, endPage),
        [filteredSessions, startPage, endPage],
    )

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

    const selectAll = () => setSelectedFilters(allKeys);
    const clearAll = () => setSelectedFilters([]);

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

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

    const popularSessions = useMemo(() => {
        if (!sessions || sessions.length === 0) return [];

        const scored = sessions.map((session) => {
            const likes = session.likes ?? 0;
            const repliesFromStore = commentsBySession[session.id]?.length ?? 0;
            const replies = session.replies ?? repliesFromStore;

            const score = likes + replies;

            return {session, score}
        });

        scored.sort((a, b) => b.score - a.score);

        return scored
            .filter((item) => item.score > 0)
            .slice(0, 7)
            .map((item) => item.session);
    }, [sessions, commentsBySession]);

    const [sidebarTab, setSidebarTab] = useState<"today" | "popular">("today");
    const sidebarSessions = sidebarTab === "today" ? sessionsMadeToday : popularSessions; // holds both popular and sessions made today


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

    function sessionLocationBar(sessionLocation?: string) {
        const map: Record<string, string> = {
            ONLINE: 'border-l-4 border-l-blue-600 border-b-blue-600',
            IN_PERSON: 'border-l-4 border-l-green-500 border-b-green-500',
            HYBRID: 'border-l-4 border-l-purple-600 border-b-purple-600',
        };

        return map[sessionLocation ?? "ONLINE"] ?? "";
    }

    const locationFrontend = (subject: string) => {
        if (!subject) return;

        return subject.toLowerCase().split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    return (
        <div className="px-5 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center justify-between w-full">

                        <div className="flex-1 text-left">
                        </div>


                        <div className="flex-1 flex justify-center space-x-3">
                            <input
                                className="h-9 w-3/4 max-w-md px-3 border rounded-l rounded-r"
                                type="search"
                                placeholder="Search for relevant sessions"
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

                        <div className="flex-1 flex justify-end items-center gap-2">
                            <Button
                                onClick={handleModalOpen} /*Button to open modal, when pressed changes the isModalOpen to true*/
                            >
                                Create Session
                            </Button>
                            <Modal open={isModalOpen} onClose={handleModalClose}>
                                <Card className="p-5 bg-white w-[1000px] mx-auto mt-[7vh] rounded-lg shadow-lg">
                                    <form onSubmit={handleCreateSession}>
                                        {/* HEADER */}
                                        <CardHeader className="pb-4 border-b">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-xl font-semibold">
                                                        New Session Post
                                                    </CardTitle>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Share what you’re hosting, when it is, and how people can join.
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                                                    Session
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-6 space-y-6">

                                            <section className="space-y-3">
                                                <h3 className="text-sm font-semibold text-slate-700">
                                                    Session details
                                                </h3>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        Post Title
                                                    </label>
                                                    <input
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        value={formTitle}
                                                        onChange={(e) => setFormTitle(e.target.value)}
                                                        placeholder="e.g. CSE 101 – Algorithms Study Marathon"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-medium text-slate-700">
                                                            Post Description
                                                        </label>
                                                        <span className="text-[11px] text-slate-400">
                                                            {formDescription.length}/500
                                                        </span>
                                                    </div>

                                                    <textarea
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[96px]"
                                                        value={formDescription}
                                                        onChange={(e) => setFormDescription(e.target.value)}
                                                        placeholder="What will you cover? Who is this session for?"
                                                        maxLength={500}
                                                        required
                                                    />
                                                </div>
                                            </section>


                                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        Subject
                                                    </label>
                                                    <input
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        value={formSubject}
                                                        onChange={(e) => setFormSubject(e.target.value)}
                                                        placeholder="e.g Math"
                                                    >
                                                    </input>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        Capacity (optional)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        value={formCapacity}
                                                        onChange={(e) => setFormCapacity(e.target.value)}
                                                        placeholder="e.g. 15"
                                                    />
                                                </div>

                                                {/* Start time */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        Start time
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
           appearance-none [color-scheme:light]"
                                                        value={formStartTime}
                                                        onChange={(e) => setFormStartTime(e.target.value)}
                                                    />
                                                </div>

                                                {/* End time */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        End time
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
           appearance-none [color-scheme:light]"
                                                        value={formEndTime}
                                                        onChange={(e) => setFormEndTime(e.target.value)}
                                                    />
                                                </div>
                                            </section>

                                            <section className="space-y-3">
                                                <h3 className="text-sm font-semibold text-slate-700">
                                                    Location & access
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-slate-700">
                                                            Location type
                                                        </label>
                                                        <select
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                            value={formLocation}
                                                            onChange={(e) =>
                                                                setFormLocation(e.target.value as SessionLocation | "")
                                                            }
                                                        >
                                                            <option value="">Select location</option>
                                                            <option value="ONLINE">Online</option>
                                                            <option value="IN_PERSON">In person</option>
                                                            <option value="HYBRID">Hybrid</option>
                                                        </select>
                                                    </div>

                                                    {(formLocation === "ONLINE" || formLocation === "HYBRID") && (
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-medium text-slate-700">
                                                                Meeting link
                                                            </label>
                                                            <input
                                                                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                                value={formMeetingLink}
                                                                onChange={(e) => setFormMeetingLink(e.target.value)}
                                                                placeholder="Zoom / Discord / Google Meet link"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {(formLocation === "IN_PERSON" || formLocation === "HYBRID") && (
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                        <div className="md:col-span-2 space-y-1">
                                                            <label className="text-xs font-medium text-slate-700">
                                                                Street address
                                                            </label>
                                                            <input
                                                                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                                value={formStreet}
                                                                onChange={(e) => setFormStreet(e.target.value)}
                                                                placeholder="e.g. 1156 High St"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-medium text-slate-700">
                                                                City
                                                            </label>
                                                            <input
                                                                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                                value={formCity}
                                                                onChange={(e) => setFormCity(e.target.value)}
                                                                placeholder="Santa Cruz"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="flex-1 space-y-1">
                                                                <label className="text-xs font-medium text-slate-700">
                                                                    State
                                                                </label>
                                                                <input
                                                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                                    value={formState}
                                                                    onChange={(e) => setFormState(e.target.value)}
                                                                    placeholder="CA"
                                                                />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <label className="text-xs font-medium text-slate-700">
                                                                    ZIP
                                                                </label>
                                                                <input
                                                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                                    value={formZip}
                                                                    onChange={(e) => setFormZip(e.target.value)}
                                                                    placeholder="95064"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </section>
                                        </CardContent>

                                        <CardFooter className="flex items-center justify-end border-t pt-4">

                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={handleModalClose}
                                                    className="px-4"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="px-5">
                                                    Create Session
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </Modal>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-6">
                        {/* LEFT: All Sessions (takes 2 columns) */}
                        <section className="lg:col-span-3">
                            <Card className="border-2 border-slate-300 shadow-md rounded-xl">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        <span className="flex items-center gap-3">
                                            {searchQuery.trim() ? "Search Results" : "All Sessions"}
                                            <GroupsIcon/>
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        Showing {pagedSessions.length} of {filteredSessions.length} sessions
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3 pt-0">
                                    {pagedSessions.map((session) => (
                                        <motion.div
                                            key={session.id}
                                            whileHover={{y: -4, scale: 1.005}}
                                            whileTap={{y: -1}}
                                            transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                            className="relative z-0"
                                        >
                                            <Card
                                                className={`bg-white rounded-md border shadow-sm hover:shadow ${sessionLocationBar(
                                                    session.location,
                                                )}`}
                                            >
                                                <CardHeader className="pb-1 px-4 pt-3">
                                                    <CardTitle className="text-base font-semibold">
                                                        {session.title}
                                                    </CardTitle>
                                                    <Divider/>
                                                </CardHeader>

                                                <CardContent
                                                    className="px-4 pb-3 pt-2 grid grid-cols-1 md:grid-cols-5 gap-4">
                                                    <div className="md:col-span-3 space-y-1 text-sm">
                                                        <div className="gap-2 flex items-center">
                                                            <AccessTimeIcon className="h-4 w-4"/>
                                                            <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                                                        </div>

                                                        <div className="md: gap-2 flex items-center">
                                                            <CalendarMonthIcon className="h-4 w-4"/>
                                                            <span className="text-gray-600">
                                        {formatDate(session.startTime)}
                                    </span>
                                                        </div>

                                                        <div className="gap-2 flex items-center">
                                                            <LocationPinIcon className="h-4 w-4"/>
                                                            <span className="font-semibold text-gray-700">
                                                                {locationFrontend(session.location)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div
                                                            className="h-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 flex flex-col gap-1">
                                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                                                Meeting description
                                                            </p>
                                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                                {session.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                <>
                                                    <CardFooter>
                                                        <div
                                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 mt-1">
                                                            <Button
                                                                variant="link"
                                                                className="!bg-transparent !border-transparent text-blue-600 px-0 text-sm"
                                                            >
                                                                View session details
                                                            </Button>

                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => toggleLike(session.id)}
                                                                    className="h-8 px-3 flex items-center gap-1"
                                                                >
                                                                    <ThumbsUp
                                                                        className={`h-4 w-4 ${
                                                                            likedSessionIds.has(session.id) ? "fill-current" : ""
                                                                        }`}
                                                                    />
                                                                    {session.likes ?? 0}
                                                                </Button>

                                                                <Button
                                                                    type="button"
                                                                    onClick={() => goToComments(session.id)}
                                                                    className="h-8 px-3 flex items-center gap-1"
                                                                >
                                                                    <MessageSquare className="h-4 w-4"/>
                                                                    {commentsBySession[session.id]?.length ?? 0}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardFooter>

                                                </>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </CardContent>

                                <CardFooter
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                        {filteredSessions.length === 0 ? "0 results" : `${startPage + 1}–${Math.min(endPage, filteredSessions.length)} of ${filteredSessions.length}`}
                    </span>

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
                        </section>

                        {/* RIGHT: Today + Popular stacked */}
                        <aside className="lg:col-span-2 flex flex-col gap-4 mt-6 lg:mt-0 space-y-5">
                            <Card className="border-2 border-slate-300 shadow-md rounded-xl h-full flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <span>Discover Sessions</span>
                                            <Sparkles className="h-5 w-5 text-yellow-500"/>
                                        </CardTitle>

                                        <div className="inline-flex items-center rounded-full p-1 gap-2">
                                            <Button
                                                type="button"
                                                onClick={() => setSidebarTab("today")}
                                                className={`px-3 py-1 rounded-full transition ${
                                                    sidebarTab === "today" ? "" : ""
                                                }`}
                                            >
                                                Today
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={() => setSidebarTab("popular")}
                                                className={`px-3 py-1 rounded-full transition ${
                                                    sidebarTab === "popular"
                                                        ? ""
                                                        : ""
                                                }`}
                                            >
                                                Popular
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500 mt-2">
                                        {sidebarTab === "today"
                                            ? "Sessions created in the last 24 hours."
                                            : "Sessions with the most likes and replies."}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex-1 overflow-y-auto space-y-3">

                                    {sidebarSessions.length === 0 && (
                                        <p className="text-xs text-slate-500 italic mt-2">
                                            Nothing here yet. Create a session to get things started!
                                        </p>
                                    )}
                                    {sidebarSessions.map((session) => (
                                        <motion.div
                                            key={session.id}
                                            whileHover={{y: -4, scale: 1.005}}
                                            whileTap={{y: -1}}
                                            transition={{type: "tween", ease: "easeOut", duration: 0.18}}
                                            className="relative z-0"
                                        >
                                            <Card
                                                className="border-2 border-slate-300 shadow-md"
                                                onClick={() => goToComments(session.id)}
                                            >
                                                <CardHeader className="py-2 px-3">
                                                    <div className="space-y-1 text-sm font-normal text-slate-800">
                                                        <div
                                                            className="flex items-center gap-1.5 text-xs text-slate-700 font-medium leading-tight">
                                                            <span className="truncate">
                                                                {session.title}
                                                            </span>

                                                            <span className="text-slate-400">•</span>

                                                            <div className="sapce-x-1 flex items-center">
                                                                <LocationPinIcon className="h-4 w-4"/>
                                                                <span className="font-semibold text-gray-700">
                                                                {locationFrontend(session.location)}
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 leading-none">
                                                            <Clock className="h-3 w-3 relative top-[0.5px]" />
                                                            <span className="leading-none">
                                                                {formatTime(session.startTime)} – {formatTime(session.endTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent>
                                                    <p className="text-xs text-slate-600 line-clamp-2">
                                                        {session.description}
                                                    </p>

                                                    <div className="flex items-center justify-between gap-2 mt-1">

                                                        <div
                                                            className="flex items-center gap-3 text-[11px] text-slate-500">
                                                        <span className="inline-flex items-center gap-1">
                                                            <ThumbsUp className="h-3 w-3"/>
                                                            {session.likes ?? 0}
                                                        </span>
                                                            <span className="inline-flex items-center gap-1">
                                                            <MessageSquare className="h-3 w-3"/>
                                                                {commentsBySession[session.id]?.length ?? 0}
                                                        </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}