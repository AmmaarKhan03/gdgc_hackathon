import {useState} from 'react';
import {api} from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";
import CapacityPieChart from "@/components/CapacityPieChart";
import {usePostStore} from "@/store/postStore";
import {MessageSquare, ThumbsUp, Tag as TagIcon, Clock, User as UserIcon, FolderOpen} from "lucide-react";

const chartData = [
    {gym: "capacity", value: 300, color: "gray"},
    {gym: "current", value: 173, color: "red"},
];

const chartConfig = {
    capacity: {
        label: "Capacity",

    },
    current: {
        label: "Current Occupancy",
    }
}

const subjectToUpper = (subject: string) => {
    if (!subject) return;
    return subject.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const formatDate = (iso: string | undefined) => {
    if (!iso) return;

    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const statusClasses: Record<string, string> = {
    OPEN: "!bg-green-100 !text-green-800 !border !border-green-300",
    CLOSED: "!bg-red-100 !text-red-800 !border !border-red-300",
    RESOLVED: "!bg-blue-100 !text-blue-800 border !border-blue-300",
};

const categoryClasses: Record<string, string> = {
    tutoring: "bg-amber-100 text-amber-800 border border-amber-300",
    discussion: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    resource: "bg-sky-100 text-sky-800 border border-sky-300",
};

export default function Dashboard() {

    const users = useUserStore(state => state.users);
    const testUser = users[3];
    const currentUsers = users.length;
    const totalUsers = 153
    const percentOfCurrentUsers = Math.floor((currentUsers / totalUsers) * 100);
    const posts = usePostStore(state => state.posts);

    const stats = [
        {label: "Total Students", value: totalUsers, color: "bg-blue-100 border-blue-400 text-blue-800"},
        {label: "Active Sessions", value: currentUsers, color: "bg-yellow-100 border-yellow-400 text-yellow-800"},
        {label: "New Posts Created", value: 73, color: "bg-green-100 border-green-400 text-green-800"},
        {label: "New Reviews/Feedback", value: "Temp Value", color: "bg-purple-100 border-purple-400 text-purple-800"},
    ];


    return (

        <div className="px-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                        {stats.map((item, index) => (
                            <Card
                                key={index}
                                className={`h-full shadow-sm border rounded-lg ${item.color} flex flex-col min-h-[100px]`}
                            >
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-lg text-center">{item.label}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex items-center justify-center">
                                    <p className="text-4xl font-semibold text-center">{item.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="space-y-2">
                        <CardHeader>
                            <CardTitle>
                                Recent Posts
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {posts.map((post, index) => (
                                <Card key={post.id} className="shadow-sm border rounded-lg">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="relative flex items-center justify-between">
                                             <span className="text-sm font-medium text-gray-700 relative flex items-center justify-between space-x-2">
                                                 <UserIcon className="h-5 w-5"/>
                                                 <span>{post.userName}</span>
                                             </span>
                                            <div
                                                className="absolute left-1/2 transform -translate-x-1/2 text-lg text-center w-full">
                                                {post.title}{" "}
                                                <span className="text-gray-500">
                                                    — {subjectToUpper(post.subject)}
                                                </span>
                                            </div>

                                            <span className="justify-self-end" />
                                        </CardTitle>

                                        <div
                                            className="mt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start text-sm">

                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${categoryClasses}`}>
                                                <FolderOpen className="h-3.5 w-3.5"/>
                                                {post.category}
                                            </span>

                                            {post.createdAt && (
                                                <span className="inline-flex items-center gap-1 text-gray-600">
                                                    <Clock className="h-4 w-4"/>
                                                    <span
                                                        title={formatDate(post.createdAt)}>{formatDate(post.createdAt)}</span>
                                                </span>
                                            )}

                                            {post.postStatus && (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusClasses}`}>
                                                    {post.postStatus}
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-1 text-gray-700">
                                                <MessageSquare className="h-4 w-4"/>
                                                {post.replies ?? 0}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-gray-700">
                                                <ThumbsUp className="h-4 w-4"/>
                                                {post.likes ?? 0}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex-1 flex justify-center">
                                            {post.description}
                                        </div>

                                        {post.likes}
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-4 h-fit">
                    <CapacityPieChart current={currentUsers} capacity={totalUsers}/>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Recommended Posts For You
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Current Sessions
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </aside>
            </div>
        </div>
    )
}

