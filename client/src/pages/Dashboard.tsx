import { useState } from 'react';
import { api } from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"

export default function Dashboard() {
    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Hello this is the card title for Dashboard
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    Hello this is the card content for Dashboard
                    <Button>Press me Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
}

