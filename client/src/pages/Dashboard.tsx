import { useState } from 'react';
import { api } from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import BarChartDemo from "@/components/BarChart";

export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Gym Usage Overview</h1>
            <BarChartDemo />
        </div>
    );
}

