import {Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AppShell from "@/layouts/AppShell";
import {Navigate} from "react-router-dom"

import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Profile from "@/pages/Profile";

import Posts from "@/pages/Posts";
import PostComments from "@/pages/postComments";
import Reviews from "@/pages/Reviews";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import {useAuthStore} from "@/store/authStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated =
        useAuthStore.getState().isAuthenticated ||
        localStorage.getItem("isAuthenticated") === "true";

    return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
}

// app routes page, we will input new app pages here and link them below within router
// syntax path: "/path" or "/path1/path2", followed by element: <Page/>, element will hold the actual page we created

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: "/auth",
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ],
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AppShell/>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {path: "dashboard", element: <Dashboard/>},
            {path: "users", element: <Users/>},
            {path: "posts", element: <Posts/>},
            {path: "posts/:id/comments", element: <PostComments/>},
            {path: "profile", element: <Profile/>},
            {path: "reviews", element: <Reviews/>},
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