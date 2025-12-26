"use client";

import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/Button"; 
import { Mail, Shield, Calendar, Award } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Early Adopter";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible"> 
        {/* Changed overflow-hidden to visible to prevent clipping shadows if needed, 
            but for the z-index fix, the key is below */}
        
        {/* Banner */}
        <div className="h-40 bg-slate-900 relative overflow-hidden rounded-t-2xl">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 blur-3xl rounded-full w-40 h-40"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-8 gap-6 relative">
             
             {/* Avatar FIX: Added 'relative z-20' to ensure it floats ABOVE the banner */}
             <div className="relative z-20 h-28 w-28 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="h-full w-full rounded-xl bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
             </div>
             
             {/* Text Info */}
             <div className="flex-1 mb-2 pt-2 md:pt-0">
                 <h1 className="text-3xl font-bold text-slate-900 mb-1">{user?.username}</h1>
                 <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 capitalize">
                      {user?.role || "Member"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Active Contributor
                    </span>
                 </div>
             </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</label>
                <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium">
                    <Mail className="h-5 w-5 text-slate-400 mr-3" />
                    {user?.email}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Community Status</label>
                <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium capitalize">
                    <Shield className="h-5 w-5 text-indigo-500 mr-3" />
                    {user?.role || "Verified User"}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Tech MSpace</label>
                <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium">
                    <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                    {joinDate}
                </div>
            </div>

             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Impact Score</label>
                <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium">
                    <Award className="h-5 w-5 text-amber-500 mr-3" />
                    <div>
                        <span>0 Points</span>
                        <span className="block text-xs text-slate-400 font-normal italic mt-0.5">
                            (To be implemented soon...)
                        </span>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}