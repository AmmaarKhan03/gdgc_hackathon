<<<<<<< Updated upstream
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
=======
import { useState } from 'react';
import { api } from '../lib/api';
import {Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
>>>>>>> Stashed changes

export default function Login() {
    return (
<<<<<<< Updated upstream
        <div className="min-h-[70vh] grid place-items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <Button className="w-full">Login</Button>
                </CardContent>
            </Card>
        </div>
    )
=======
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
>>>>>>> Stashed changes
}

