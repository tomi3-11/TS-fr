"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Mail, Shield, Calendar, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex items-end -mt-12 mb-6">
             {/* Avatar */}
             <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-600">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
             </div>
             <div className="ml-4 mb-1">
                 <h2 className="text-2xl font-bold text-slate-900">{user?.username}</h2>
                 <p className="text-slate-500 text-sm">Software Engineer</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4">
                <ProfileItem icon={<Mail className="h-5 w-5 text-slate-400"/>} label="Email" value={user?.email || ""} />
                <ProfileItem icon={<Shield className="h-5 w-5 text-indigo-500"/>} label="Role" value={user?.role?.toUpperCase() || "USER"} />
                <ProfileItem icon={<User className="h-5 w-5 text-slate-400"/>} label="User ID" value={user?.id || "N/A"} />
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
                <Button>Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="mr-3">{icon}</div>
            <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-slate-900 font-medium">{value}</p>
            </div>
        </div>
    )
}