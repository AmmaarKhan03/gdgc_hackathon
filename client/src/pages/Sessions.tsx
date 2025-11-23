import { useSessionStore } from "@/store/sessionStore";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

export default function Sessions() {
    const sessions = useSessionStore((state) => state.sessions); // ✅ hook inside component

    return (
        <div>
            {sessions.map((session) => (
                <Card key={session.id}>   {/* add key if you have an id */}
                    <CardHeader>
                        <CardTitle>{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent>{session.description}</CardContent>
                </Card>
            ))}
        </div>
    );
}
