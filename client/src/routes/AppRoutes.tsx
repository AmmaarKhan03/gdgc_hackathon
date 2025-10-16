import {Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import AppShell from "@/layouts/AppShell";

// app routes page, we will input new app pages here and link them below within router
// syntax path: "/path" or "/path1/path2", followed by element: <Page/>, element will hold the actual page we created

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell/>,
        children: [
            {path: "dashboard", element: <Dashboard/>},
            // EX when user clicks on another users profile
            //{ path: "users/id", element: <UsersProfile/>}
        ],
    },
]);

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="p-4">Loading…</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
};