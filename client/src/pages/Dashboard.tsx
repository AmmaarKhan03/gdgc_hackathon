import { useState } from 'react';
import { api } from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";
import {useUserStore} from "@/store/userStore";

export default function Dashboard() {
    return (
        <div className="p-4">
            <Card>

            </Card>
            <h1 className="text-2xl font-semibold mb-4">Gym Usage Overview</h1>
            <BarChartDemo />
        </div>
    );
}

