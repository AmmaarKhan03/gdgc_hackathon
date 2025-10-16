import {useUserStore} from "@/store/userStore";
import {Status} from "@/store/userStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

const lowerStatus = (string) => {
    if (!string) return "";
    return string[0] + string.slice(1).toLowerCase();
}

const statusBar = (string) => {
    if (!string) return "";

    if (string === "ACTIVE") return "bg-green-100 text-green-700"
    if (string === "INACTIVE") return "bg-red-100 text-red-700"
    if (string === "SUSPENDED") return "bg-red-200 text-red-700"
    if (string === "PENDING") return "bg-yellow-200 text-yellow-700"
}

export default function Users() {
    const users = useUserStore(state => state.users);
    const deleteUser = useUserStore(state => state.deleteUser);
    const editUser = useUserStore(state => state.editUser);

    return (
        <div className="space-y-4">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user, index) => (
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <CardTitle>
                                <div className="flex flex-row items-center gap-3 justify-between">
                                    <img
                                        src={user.profileImageUrl}
                                        alt="profileImage"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div className="space-x-4">
                                        <span className="text-lg font-semibold text-gray-700"> {user.name.firstName} {user.name.lastName}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBar(user.status)}`}>
                                            {lowerStatus(user.status)}
                                        </span>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent></CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}