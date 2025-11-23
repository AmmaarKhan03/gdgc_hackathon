import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, MessageSquare, Clock } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-amber-50/30">
            {/* Header */}
            <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo + Name */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-md">
                            {/* “Slug” logo-ish mark */}
                            <Sparkles className="w-5 h-5 text-blue-900" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">Slug Study</p>
                            <p className="text-xs text-slate-500">UCSC Peer Learning</p>
                        </div>
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/auth/login"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/auth/register"
                            className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
                    <div>
                        <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-4">
                            <Sparkles className="w-4 h-4" />
                            Built for UCSC students
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                            Peer learning made simple for <span className="text-blue-600">Slugs</span>.
                        </h1>
                        <p className="text-slate-600 mb-6 text-sm md:text-base max-w-xl">
                            Slug Study helps UCSC students find study groups, tutoring help, and feedback
                            from their peers — all in one place. No more digging through random group chats.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/auth/register"
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            >
                                Get started – it’s free
                            </Link>
                            <Link
                                to="/auth/login"
                                className="text-sm font-medium text-blue-700 hover:text-blue-900"
                            >
                                I already have an account
                            </Link>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                            No payment, no spam. Just Slugs helping Slugs.
                        </p>
                    </div>

                    {/* Simple “preview” style card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">
                                Live activity
                            </p>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Demo
              </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <div className="p-3 rounded-xl bg-slate-50">
                                <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                                <p className="font-semibold text-slate-900">150+</p>
                                <p className="text-slate-500 text-[11px]">Students</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50">
                                <MessageSquare className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                                <p className="font-semibold text-slate-900">70+</p>
                                <p className="text-slate-500 text-[11px]">Posts today</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50">
                                <Clock className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                                <p className="font-semibold text-slate-900">8</p>
                                <p className="text-slate-500 text-[11px]">Active sessions</p>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                            <p className="font-semibold text-slate-900">
                                What you can do with Slug Study:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-1">
                                <li>Find or host study sessions for your UCSC classes</li>
                                <li>Ask for help on homework, projects, and exam prep</li>
                                <li>Give and receive feedback on essays and assignments</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                            Study sessions
                        </p>
                        <h2 className="text-sm font-bold text-slate-900 mb-2">
                            Join focused group sessions
                        </h2>
                        <p className="text-xs text-slate-600">
                            Browse or create sessions for specific courses and topics so you’re
                            always studying with people on the same page.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">
                            Peer support
                        </p>
                        <h2 className="text-sm font-bold text-slate-900 mb-2">
                            Get help from fellow Slugs
                        </h2>
                        <p className="text-xs text-slate-600">
                            Post questions, share resources, and collaborate instead of stressing alone.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs font-semibold text-amber-600 mb-1">
                            Built for UCSC
                        </p>
                        <h2 className="text-sm font-bold text-slate-900 mb-2">
                            Tailored to your classes
                        </h2>
                        <p className="text-xs text-slate-600">
                            Organized around UCSC courses so everything feels familiar right away.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
