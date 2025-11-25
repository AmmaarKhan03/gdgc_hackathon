import { Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import AppShell from "@/layouts/AppShell";

import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Profile from "@/pages/Profile";

import Posts from "@/pages/Posts";
import PostComments from "@/pages/PostComments";

import Sessions from "@/pages/Sessions";
import SessionComments from "@/pages/SessionComments";
import SessionDetails from "@/pages/SessionDetails";
import Reviews from "@/pages/Reviews";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

import Landing from "@/pages/Landing";

const router = createBrowserRouter([
    // Public landing page
    {
        path: "/",
        element: <Landing />,
    },

    // Main app area (later: “logged-in” zone)
    {
        path: "/app",
        element: <AppShell />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "users", element: <Users /> },
            { path: "posts", element: <Posts /> },
            { path: "posts/:postId/comments", element: <PostComments /> },
            { path: "sessions", element: <Sessions /> },
            { path: "sessions/:sessionId", element: <IndividualSession /> },
            { path: "reviews", element: <Reviews /> },
            { path: "profile", element: <Profile /> },
        ],
    },

    // Auth routes
    {
        path: "/auth",
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {path: "dashboard", element: <Dashboard/>},
            {path: "users", element: <Users/>},
            {path: "posts", element: <Posts/>},
            {path: "posts/:id/comments", element: <PostComments/>},
            {path: "sessions", element: <Sessions/>},
            {path: "session/:id/details", element: <SessionDetails/>},
            {path: "session/:id/comments", element: <SessionComments/>},
            {path: "profile", element: <Profile/>},
            {path: "reviews", element: <Reviews/>},
            // EX when user clicks on another users profile
            //{ path: "users/id", element: <UsersProfile/>}
        ],
    },

    // Fallback
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="p-4">Loading…</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
