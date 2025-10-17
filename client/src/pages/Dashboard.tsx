import {useState} from 'react';
import {api} from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";

export default function Dashboard() {

    const users = useUserStore(state => state.users);
    const testUser = users[3];


    return (

        <div className="space-y-5">

            <div className="flex justify-center">
                <Card className="w-1/2 shadow-md">
                    <CardHeader className="items-center">
                        <CardTitle className="text-lg text-center">Welcome back {testUser.name.firstName}!</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div>
                <h1 className="text-md mb-4">Gym Usage Overview</h1>
                <BarChartDemo/>
            </div>
        </div>
    );
}

