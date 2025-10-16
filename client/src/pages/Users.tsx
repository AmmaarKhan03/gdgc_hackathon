import {useUserStore} from "@/store/userStore";
import {Status} from "@/store/userStore";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const lowerStatus = (status: string) => {
    if (!status) return "";
    return status[0] + status.slice(1).toLowerCase();
}

const statusBar = (status: string) => {
    if (!status) return "";

    if (status === "ACTIVE") return "bg-green-100 text-green-700"
    if (status === "INACTIVE") return "bg-red-100 text-red-700"
    if (status === "SUSPENDED") return "bg-red-200 text-red-700"
    if (status === "PENDING") return "bg-yellow-200 text-yellow-700"
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
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBar(user.gymStatus)}`}>
                                            {lowerStatus(user.gymStatus)}
                                        </span>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-sm">
                                <div className="text-muted-foreground">Phone</div>
                                <div>{user.userFields.email}</div>
                            </div>

                            <div className="text-sm">
                                <div className="text-muted-foreground">Address</div>
                                <div>
                                    {user.userFields.address.street}
                                    <br />
                                    {user.userFields.address.city}, {user.userFields.address.state} {user.userFields.address.zip}
                                </div>
                            </div>


                            <div className="pt-3 flex items-center gap-2">
                                <Button className="!bg-red-600 hover:!bg-red-500" onClick={() => deleteUser(user.id)}>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}