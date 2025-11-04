// src/layouts/AppShell.tsx
import {useRef, useState, useEffect} from "react";
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Drawer, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Menu, MailIcon, X, Snail, BarChart3, Dumbbell, LayoutDashboard, User} from "lucide-react";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {useAuthStore} from "@/store/authStore";


export default function AppShell() {
    const [open, setOpen] = useState<boolean>(false);
    const location = useLocation();
    const [openProfileOption, setOpenProfileOptions] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        setOpenProfileOptions(false);
        navigate("/auth/login", { replace: true });
    }

    // use useEffect so on every click it knows to change openProfileOptions
    useEffect(() => {
        // function used to listen is user clicks anywhere on the page to close the menu
        function onClick(e: MouseEvent) { // pass in a mouseEvent to listen for
            if (!menuRef.current) return; // if menuRef.current is null or undefined meaning its not ready to open yet do nothing
            if (!menuRef.current.contains(e.target as Node)) setOpenProfileOptions(false); // if the  click was outside the profile menu close the menu
        }

        // function that will listen to a keyboard event
        function onEsc(e: KeyboardEvent) { // fucntion called onEsc that listens for KeyBoardEvent
            if (e.key === "Escape") setOpenProfileOptions(false); // if event.key === "Escape" we close the menu
        }

        if (openProfileOption) { // will check of the dropdown is currently open
            document.addEventListener("mousedown", onClick); // will listen for any mouse clicks and call the onClick function
            document.addEventListener("keydown", onEsc); // will listen for any keyboard clicks and call the onEsc function
        }

        // will stop listening to any events if the dropdown is up and not in use
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onEsc);
        }
    }, [openProfileOption]); // only run the useEffect when opProfile Changes

    const items = [
        {label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard />},
        {label: "Users", to: "/users", icon: <User />},
        {label: "Profile", to: "/profile", icon: <Snail />},
        {label: "Posts", to: "/posts", icon: <Dumbbell />},
        {label: "Reviews", to: "/reviews", icon: <BarChart3 />},
    ];

    const pageTitles: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/users": "Users",
        "/profile": "Profile",
        "/posts": "Posts",
        "/reviews": "Reviews",
    };

    const title = pageTitles[location.pathname] || "Slug Hub";

    return (
        <div className="min-h-screen flex">

            {/* aside in charge of side menu button when pressed drawer appears */}
            <aside
                className="fixed left-0 top-0 backdrop-blur-sm bottom-0 z-40 w-12 border-r flex items-start justify-center">
                {/* top-left menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5 text-white"/>
                </Button>
                {/* you can add more rail icons stacked vertically here */}
            </aside>

            {/* Header top bar, currently only shows pages title */}
            <div className="flex-1 flex flex-col w-full">
                <header
                    className="h-14 border-b flex items-center px-4 bg-white w-full fixed top-0 left-0 right-0 z-30 relative">
                    {/* left title (offset for the rail) */}
                    <div className="font-medium pl-12">{title}</div>

                    {/* centered greeting (independent of flex) */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-md font-semibold text-gray-700 flex items-center justify-beteen gap-1">
                        <div className="flex items-center">
                            Slug Study  <Snail className="!text-yellow-400"/>
                        </div>
                        {/* Other possible Name
                                Slug Fit
                                Slug Strong
                                Campus Core
                                Fit UCSC
                             */}
                    </div>

                    <div className="ml-auto" ref={menuRef}>
                        <AccountCircleRoundedIcon
                            className="!h-8 !w-8 text-gray-700 cursor-pointer hover:text-yellow-500 transition"
                            onClick={() => setOpenProfileOptions((v) => !v)}
                        />

                        {openProfileOption && (
                            <div className="absolute right-0 top-12 w-44 bg-white border rounded shadow-md z-50">
                                <NavLink
                                    to="/dashboard"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => setOpenProfileOptions(false)}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => setOpenProfileOptions(false)}
                                >
                                    Profile
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => setOpenProfileOptions(false)}
                                >
                                    Settings
                                </NavLink>

                                <NavLink
                                    to="/auth/login"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 !text-red-500 hover:!text-red-600"
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </NavLink>

                            </div>
                        )}
                    </div>

                </header>

                <main className="p-5 pt-14 pb-5 pl-12">  {/* padding-top keeps content below header */}
                    <Outlet/>
                </main>
            </div>

            {/* DRAWER CONTENT handles the mapping of pages I have when the drawer is opened*/}
            <Drawer open={open} onClose={() => setOpen(false)}>
                <div style={{width: 260}}> {/* How far out the drawer goes in pixels*/}
                    <div
                        className="flex items-center justify-between px-3 py-3 border-b"> {/* in charge of the boarder line and handles the title and X button*/}
                        <span className="font-semibold">Navigation</span>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                            <X className="h-5 w-5 text-white"/>
                        </Button>
                    </div>

                    {/* handles the list of pages we have will map them out in order and when pressed will link us to the respective page*/}
                    <List>
                        {items.map((it) => (
                            <ListItemButton
                                key={it.to}
                                component={NavLink}
                                to={it.to}
                                onClick={() => setOpen(false)}
                                selected={location.pathname === it.to}
                            >
                                <ListItemIcon>{it.icon}</ListItemIcon>
                                <ListItemText primary={it.label}/>
                            </ListItemButton>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    )
}