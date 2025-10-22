import {useState} from 'react';
import {api} from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";
import {PieChart} from 'react-minimal-pie-chart'

export default function Dashboard() {

    const users = useUserStore(state => state.users);
    const testUser = users[3];
    const currentUsers = users.length;
    const totalUsers = 153
    const percentOfCurrentUsers = Math.floor((currentUsers / totalUsers) * 100);

    const stats = [
        {label: "Total Users", value: totalUsers, color: "bg-blue-100 border-blue-400 text-blue-800"},
        {label: "Current Users", value: currentUsers, color: "bg-yellow-100 border-yellow-400 text-yellow-800"},
        {label: "Check-ins Today", value: 73, color: "bg-green-100 border-green-400 text-green-800"},
    ];


    return (

        <div className="space-y-5">

            <div className="flex justify-center">
                <Card className="w-1/2 shadow-md">
                    <CardHeader className="items-center">
                        <CardTitle className="text-lg text-center">Welcome back {testUser.name.firstName}!</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="px-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


                    {stats.map((item, index) => (
                        <Card key={index} className={`shadow-sm border rounded-lg ${item.color}`}>
                            <CardHeader>
                                <CardTitle className="text-lg text-center">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <h1 className=" text-center">
                                    {item.value}
                                </h1>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                    {/* LEFT SIDE - 1/3 width */}
                    <div className="col-span-1">
                        <Card>
                            <CardHeader className="items-center">
                                <CardTitle>Current Capacity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center p-4">
                                    <PieChart
                                        data={[
                                            {value: totalUsers - currentUsers, color: "#e5e7eb"},
                                            {value: currentUsers, color: "#E38627"}
                                        ]}
                                        totalValue={totalUsers}
                                        lineWidth={20}
                                        rounded
                                        startAngle={-90}
                                        label={() => `${percentOfCurrentUsers}%`}
                                        labelPosition={0}
                                        labelStyle={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            fill: "black",
                                        }}
                                        style={{height: "200px"}}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE - 2/3 width */}
                    <div className="col-span-2">

                        <BarChartDemo chartTitle={"Weekly usage"}/>

                </div>
            </div>

        </div>
</div>
)
    ;
}

