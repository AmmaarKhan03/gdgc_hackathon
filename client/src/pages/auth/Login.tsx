import {useState} from 'react';
import {api} from '../../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import {NavLink, Outlet, useLocation} from "react-router-dom";
import { User, Lock } from "lucide-react"; // ✅ import icons

export default function Login() {
    return (
        <div className="flex h-screen">
            <div className="w-1/3 flex items-center justify-center bg-yellow-300">
                <h1 className="text-4xl font-bold">Text</h1>
            </div>

            <div className="w-2/3 flex items-center justify-center bg-blue-400">
                <div className="w-full max-w-md p-6">
                    <Card>
                        <CardHeader className="items-center">
                            <CardTitle>Login</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center border rounded p-2 gap-2 bg-white">
                                <User className="text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="flex-1 outline-none bg-transparent"
                                />
                            </div>
                            <div className="flex items-center border rounded p-2 gap-2 bg-white">
                                <Lock className="text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="flex-1 outline-none bg-transparent"
                                />
                            </div>
                            <Button className="mt-4 w-full !bg-yellow-300 hover:!bg-blue-400">Login</Button>
                        </CardContent>
                        
                        <div className="flex justify-center">
                        <NavLink
                            to="/auth/forgot-password"
                            className="block px-4 py-2 text-sm !text-blue-500 hover:!text-blue-700"
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

