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
        {label: "Total Users", value: totalUsers},
        {label: "Current Users", value: currentUsers},
        {label: "Capacity", value: `${percentOfCurrentUsers}%`},
        {label: "Check-ins Today", value: 73},
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


                    {stats.map((item, index) => (
                        <Card key={index} className="shadow-sm border rounded-lg">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>
                                Current Capacity {percentOfCurrentUsers}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <PieChart
                                data={[
                                    {value: currentUsers, color: "#E38627"},
                                    {value: totalUsers - currentUsers, color: "#e5e7eb" }
                                ]}
                                totalValue={totalUsers}
                                lineWidth={20}
                                rounded
                                labelStyle={{
                                    fontSize: "8px",
                                    fontWeight: "bold",
                                    fill: "#111",
                                }}
                                
                                style={{ height: "180px" }}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}

