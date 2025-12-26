import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Feed</h1>
          <p className="text-slate-500">Latest discussions from your communities.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      {/* Empty State for now */}
      <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No posts yet</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Join a community to start seeing discussions and proposals here.
        </p>
      </div>
    </div>
  );
}