import { useState, useEffect } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
    const navigate = useNavigate();

    const register = useAuthStore((s) => s.register);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const globalLoading = useAuthStore((s) => s.loading);
    const globalError = useAuthStore((s) => s.error);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    // If already logged in, don’t show register page
    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated") === "true";
        if (isAuthenticated || storedAuth) {
            navigate("/app/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        const trimmedEmail = email.trim();
        const trimmedName = name.trim();

        if (!trimmedName) {
            setLocalError("Please enter your name.");
            return;
        }

        const ok = await register(trimmedName, trimmedEmail, password);

        if (ok) {
            await navigate("/app/dashboard", { replace: true });
        } else {
            setLocalError(globalError || "Registration failed. Please try again.");
        }
    };

    const loading = globalLoading;

    // types/auth.ts
    type RegisterForm = {
        email: string;
        password: string;
        confirmPassword: string;
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#FFD700] via-[#FFC300] to-[#003C6C]">
            <div className="w-1/3 flex items-center justify-center bg-transparent">
                <Card className="backdrop-blur bg-white/70">
                    <CardHeader>
                        <CardTitle>Join Peer Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-700">
                            Create an account to find study sessions, post questions, and
                            collaborate with other students.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="w-2/3 flex items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <Card className="backdrop-blur bg-white/70">
                        <CardHeader className="items-center">
                            <CardTitle>Sign Up</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3">
                            {(localError || globalError) && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {localError || globalError}
                                </div>
                            )}

                            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                {/* Name */}
                                <div className="flex items-center border rounded p-2 gap-2 bg-white">
                                    <User className="text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="flex-1 outline-none bg-transparent"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex items-center border rounded p-2 gap-2 bg-white">
                                    <User className="text-gray-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="flex-1 outline-none bg-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="flex items-center border rounded p-2 gap-2 bg-white">
                                    <Lock className="text-gray-500 w-5 h-5" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="flex-1 outline-none bg-transparent"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    className="mt-4 w-full !bg-[#FFD700] hover:!bg-[#003C6C] text-black hover:!text-white"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Creating account…" : "Sign Up"}
                                </Button>
                            </form>
                        </CardContent>

                        <div className="flex justify-center pb-4">
                            <NavLink
                                to="/auth/login"
                                className="block px-4 py-2 text-sm text-[#003C6C] hover:text-black"
                            >
                                Already have an account? Log in
                            </NavLink>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
