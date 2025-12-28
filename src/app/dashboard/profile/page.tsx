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
    <div className="max-w-3xl mx-auto px-4 md:px-0 pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Profile Card */}
      {/* overflow-visible is crucial so the avatar can float "up" out of the content area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible relative mt-20 md:mt-24"> 
        
        {/* Banner - Positioned absolutely to sit "behind" the top part of the card */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-slate-900 rounded-t-2xl overflow-hidden -z-10 -translate-y-full md:-translate-y-1/2">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 blur-3xl rounded-full w-40 h-40"></div>
        </div>
        
        {/* "Fake" Banner Space inside the card to push content down if we weren't using the negative margin trick. 
            However, with the layout below, we use negative margins to pull the avatar UP. */}
        <div className="h-24 md:h-32 bg-slate-900 rounded-t-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 blur-3xl rounded-full w-40 h-40"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-8 gap-6 relative">
              
              {/* Avatar FIX: Added 'relative z-20' to ensure it floats ABOVE the banner */}
              <div className="relative z-20 h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
                <div className="h-full w-full rounded-xl bg-indigo-600 flex items-center justify-center text-3xl md:text-5xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Text Info */}
              <div className="flex-1 mb-2 pt-2 md:pt-0 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 truncate">
                    {user?.username}
                  </h1>
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
                <div className="flex items-center p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium text-sm md:text-base break-all">
                    <Mail className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    {user?.email}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Community Status</label>
                <div className="flex items-center p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium capitalize text-sm md:text-base">
                    <Shield className="h-5 w-5 text-indigo-500 mr-3 shrink-0" />
                    {user?.role || "Verified User"}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Tech MSpace</label>
                <div className="flex items-center p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium text-sm md:text-base">
                    <Calendar className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    {joinDate}
                </div>
            </div>

             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Impact Score</label>
                <div className="flex items-center p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-medium text-sm md:text-base">
                    <Award className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                    <div>
                        <span>0 Points</span>
                        <span className="block text-[10px] md:text-xs text-slate-400 font-normal italic mt-0.5">
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