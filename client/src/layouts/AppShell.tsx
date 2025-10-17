// src/layouts/AppShell.tsx
import {useState} from "react";
import {NavLink, Outlet, useLocation} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Drawer, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Menu, MailIcon, X, Snail, BarChart3, Dumbbell, LayoutDashboard, User} from "lucide-react";


export default function AppShell() {
    const [open, setOpen] = useState<boolean>(false);
    const location = useLocation();

    const items = [
        {label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard />},
        {label: "Users", to: "/users", icon: <User />},
        {label: "Profile", to: "/profile", icon: <Snail />},
        {label: "Workout Hub", to: "/workouthub", icon: <Dumbbell />},
        {label: "Gym Analytics", to: "/gymAnalytics", icon: <BarChart3 />},
    ];

    const pageTitles: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/users": "Users",
        "/profile": "Profile",
        "/workouthub": "Workout Hub",
        "/gymAnalytics": "Gym Analytics",
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
                    <div className="absolute left-1/2 -translate-x-1/2 text-md font-semibold text-gray-700">
                        <div className="flex items-center">
                            Slug Hub <Snail className="!text-yellow-400"/>
                        </div>
                        {/* Other possible Name
                                Slug Fit
                                Slug Strong
                                Campus Core
                                Fit UCSC
                             */}
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