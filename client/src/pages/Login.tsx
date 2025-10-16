import { useState } from 'react';
import { api } from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"

export default function Login() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Hello this is the card title for Login
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    Hello this is the card content for login
                    <Button>Press me</Button>
                </CardContent>
            </Card>
        </>
    );
}

