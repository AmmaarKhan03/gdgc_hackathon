import { Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import AppShell from "@/layouts/AppShell";
import Landing from "@/pages/Landing";

import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";

import Posts from "@/pages/Posts";
import PostComments from "@/pages/PostComments";

import Sessions from "@/pages/Sessions";
import SessionComments from "@/pages/SessionComments";

import Reviews from "@/pages/Reviews";
import Profile from "@/pages/Profile";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Router Setup with proper nesting
const router = createBrowserRouter([
    // Landing page (logged out homepage)
    {
        path: "/",
        element: <Landing />,
    },

    // Auth routes (outside main app shell)
    {
        path: "/auth",
        children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ],
    },

    // Main app routes (protected, inside AppShell)
    {
        path: "/app",
        element: <AppShell />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "users", element: <Users /> },
            { path: "posts", element: <Posts /> },
            { path: "sessions", element: <Sessions /> },
            { path: "reviews", element: <Reviews /> },
            { path: "profile", element: <Profile /> },
        ],
    },

    // Comment routes (also inside AppShell but with dynamic params)
    {
        path: "/post/:id/comments",
        element: <AppShell />,
        children: [
            { index: true, element: <PostComments /> },
        ],
    },
    {
        path: "/session/:id/comments",
        element: <AppShell />,
        children: [
            { index: true, element: <SessionComments /> },
        ],
    },

    // Fallback: anything unknown goes to landing
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRoutes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}