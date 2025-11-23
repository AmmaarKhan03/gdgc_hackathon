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

import PostComments from "@/pages/PostComments";
import Posts from "@/pages/Posts";

import Sessions from "@/pages/Sessions";
import IndividualSession from "@/pages/IndividualSession";
import Reviews from "@/pages/Reviews";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Simple logged-out homepage
function Home() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Welcome!</h1>
            <p className="text-gray-600">
                This is the logged-out homepage. Use the navigation or the Login link
                to sign in and access your dashboard.
            </p>
        </div>
    );
}

const router = createBrowserRouter([
    // Main app layout – always accessible (no auth guard for now)
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <Home /> }, // default route = homepage
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

    // Auth pages – still reachable, but not forced
    {
        path: "/auth",
        children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ],
    },

    // Fallback: anything unknown goes to homepage
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="p-4">Loading…</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
