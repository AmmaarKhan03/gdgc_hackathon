import {useSessionStore} from "@/store/sessionStore";
import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";

const sessions = useSessionStore((state) => state.sessions);

export default function Sessions() {
    return (
        <div>
            {sessions.map((session) => (
                <Card>
                    <CardHeader>
                        <CardTitle>{session.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {session.description}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}