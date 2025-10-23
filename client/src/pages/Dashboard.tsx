import {useState} from 'react';
import {api} from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";
import CapacityPieChart from "@/components/CapacityPieChart";

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

export default function Dashboard() {

    const users = useUserStore(state => state.users);
    const testUser = users[3];
    const currentUsers = users.length;
    const totalUsers = 153
    const percentOfCurrentUsers = Math.floor((currentUsers / totalUsers) * 100);

    const stats = [
        {label: "Total Users", value: totalUsers, color: "bg-blue-100 border-blue-400 text-blue-800"},
        {label: "Currently Working Out", value: currentUsers, color: "bg-yellow-100 border-yellow-400 text-yellow-800"},
        {label: "Total Check-ins Today", value: 73, color: "bg-green-100 border-green-400 text-green-800"},
        {label: "Temp Card", value: "Temp Value", color: "bg-purple-100 border-purple-400 text-purple-800"},
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

                    <BarChartDemo chartTitle="Weekly Usage"/>
                </section>

                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-4 h-fit">
                    <CapacityPieChart current={currentUsers} capacity={totalUsers} />
                </aside>
            </div>
        </div>
    )
}

