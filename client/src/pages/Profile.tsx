import {useParams} from "react-router-dom";
import {useUserStore} from "@/store/userStore";
import {Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription} from "@/components/ui/card";

export default function Profile() {
    const {id} = useParams<{ id: string }>();
    const user = useUserStore((state) => state.users.find((user) => user.id === id));

    return (
        <div className="px-5 space-y-6">

            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="text-lg font-semibold">
                        Profile
                    </CardTitle>
                    <CardDescription>Update your profile and account settings</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="h-20 w-20 rounded-full bg-slate-200 shrink-0"/>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-700">Profile Image</p>
                                    <p className="text-sm text-slate-700">Upload a new photo</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">First name</label>
                                    <input className="w-full rounded-lg border px-3 py-2 text-sm"/>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">Last name</label>
                                    <input className="w-full rounded-lg border px-3 py-2 text-sm"/>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Select Year</label>
                                <input className="w-full rounded-lg border px-3 py-2 text-sm"/>
                            </div>

                            {/*TODO: Same as interests add button to add pronouns and make them bubbled */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Pronouns</label>
                                <input className="w-full rounded-lg border px-3 py-2 text-sm"/>
                            </div>

                            {/*TODO: Make interests an array of string, So they type why their interests add it and a bubble around there item is added */}
                            {/*
                            Will be added like this with bubbles around it:
                            Each one will have an x on it to remove from interests lists
                            CSE 13s
                            Science
                            Art
                            */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Interests</label>
                                <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                                <p className="text-[11px] text-slate-500">Example: CSE 13S, CSE 101, CMPM 130</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Bio</label>
                                <textarea
                                    className="w-full rounded-l rounded-r border px-3 py-2 text-sm min-h-[120px]"/>
                            </div>
                        </section>

                        <aside className="space-y-6 lg:border-l lg:pl-8">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Email</label>
                                <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Password</label>
                                <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Confirm Password</label>
                                <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                            </div>

                            <div className="space-y-1">
                                <label className="text-md font-medium text-gray-600">Address</label>
                                <div className="grid grid-cols-2 gap-3 mt-3 space-y-1">
                                    <div>
                                        <label className="text-xs font-medium text-slate-700">Street</label>
                                        <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-700">City</label>
                                        <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-700">Zip Code</label>
                                        <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-700">State</label>
                                        <input className="w-full rounded-l rounded-r border px-3 py-2 text-sm"/>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}