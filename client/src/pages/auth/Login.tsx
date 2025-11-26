import { useState, useEffect } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
    const navigate = useNavigate();

    const login = useAuthStore((s) => s.login);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const globalLoading = useAuthStore((s) => s.loading);
    const globalError = useAuthStore((s) => s.error);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);


    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/app/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        const trimmedEmail = email.trim();

        const ok = await login(trimmedEmail, password);

        if (ok) {
            // logged in successfully -> go to dashboard area
            await navigate("/app/dashboard", { replace: true });
        } else {
            // show backend error if present, else fallback
            setLocalError(globalError || "Invalid email or password.");
        }
    };

    const loading = globalLoading; // alias for button

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#FFD700] via-[#FFC300] to-[#003C6C]">
            <div className="w-1/3 flex items-center justify-center bg-transparent">
                <Card className="backdrop-blur bg-white/70">
                    <CardHeader>
                        <CardTitle>Welcome to Peer Review</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>

            <div className="w-2/3 flex items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <Card className="backdrop-blur bg-white/70">
                        <CardHeader className="items-center">
                            <CardTitle>Login</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3">
                            {/* Error message */}
                            {(localError || globalError) && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {localError || globalError}
                                </div>
                            )}

                            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
                                    {loading ? "Checking…" : "Login"}
                                </Button>
                            </form>
                        </CardContent>

                        <div className="flex justify-center">
                            <NavLink
                                to="/auth/forgot-password"
                                className="block px-4 py-2 text-sm text-white/90 hover:text-white"
                            >
                                Forgot Password?
                            </NavLink>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
