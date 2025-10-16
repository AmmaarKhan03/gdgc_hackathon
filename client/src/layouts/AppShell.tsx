// src/layouts/AppShell.tsx
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import {Menu, MailIcon, X} from "lucide-react";


export default function AppShell() {
    const [open, setOpen] = useState<boolean>(false);
    const location = useLocation();

    const items = [
        {label: "Dashboard", to: "/dashboard" }
    ];

    const pageTitles: Record<string, string> = {
        "/dashboard": "Dashboard",
    };

    const title = pageTitles[location.pathname] || "Gym Checker";

    return (
        <div className="min-h-screen flex">

            {/* aside in charge of side menu button when pressed drawer appears */}
            <aside className="fixed left-1 top-1 h-screen w-13 border-r backdrop-blur-sm flex flex-col items-center">
                {/* top-left menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5 text-white" />
                </Button>
                {/* you can add more rail icons stacked vertically here */}
            </aside>

            {/* Header top bar, currently only shows pages title */}
            <div className="ml-12 flex-1 flex flex-col">
                <header className="h-14 border-b flex items-center px-4">
                    <div className="font-medium">{title}</div>
                </header>

                <main className="flex-2 p-5">
                    <Outlet />
                </main>
            </div>

            {/* DRAWER CONTENT handles the mapping of pages I have when the drawer is opened*/}
            <Drawer open={open} onClose={() => setOpen(false)}>
                <div style={{ width: 260 }}> {/* How far out the drawer goes in pixels*/}
                    <div className="flex items-center justify-between px-3 py-3 border-b"> {/* in charge of the boarder line and handles the title and X button*/}
                        <span className="font-semibold">Navigation</span>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                            <X className="h-5 w-5 text-white" />
                        </Button>
                    </div>

                    {/* handles the list of pages we have will map them out in order and when pressed will link us to the respective page*/}
                    {/* TODO: figure out a way to change the icon depending on what the link is ex: if its ask/request maybe have a question mark icon*/}
                    {/* currently all items have the mail icon*/}
                    <List>
                        {items.map((it) => (
                            <ListItemButton
                                key={it.to}
                                component={NavLink}
                                to={it.to}
                                onClick={() => setOpen(false)}
                                selected={location.pathname === it.to}
                            >
                                <ListItemIcon><MailIcon size={18} /></ListItemIcon>
                                <ListItemText primary={it.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    )
}