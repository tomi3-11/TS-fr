import { ProjectStatus } from "@/types/project";
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  FileQuestion,
  LucideIcon 
} from "lucide-react";

export const getStatusConfig = (status: ProjectStatus) => {
  switch (status) {
    case "PROPOSED":
      return { 
        color: "text-blue-600 bg-blue-50 border-blue-200", 
        icon: FileQuestion,
        label: "Proposed" 
      };
    case "APPROVED":
      return { 
        color: "text-purple-600 bg-purple-50 border-purple-200", 
        icon: CheckCircle2,
        label: "Approved" 
      };
    case "ACTIVE":
      return { 
        color: "text-emerald-600 bg-emerald-50 border-emerald-200", 
        icon: PlayCircle,
        label: "In Progress" 
      };
    case "COMPLETED":
      return { 
        color: "text-slate-600 bg-slate-100 border-slate-200", 
        icon: Clock,
        label: "Completed" 
      };
    default:
      return { 
        color: "text-slate-600 bg-slate-50 border-slate-200", 
        icon: FileQuestion,
        label: status 
      };
  }
};

export const getSectorColor = (sector: string) => {
  const colors: Record<string, string> = {
    health: "bg-red-100 text-red-700",
    education: "bg-orange-100 text-orange-700",
    transport: "bg-blue-100 text-blue-700",
    agriculture: "bg-green-100 text-green-700",
    technology: "bg-indigo-100 text-indigo-700",
  };
  return colors[sector.toLowerCase()] || "bg-slate-100 text-slate-700";
};