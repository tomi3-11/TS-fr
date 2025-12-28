"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import emailjs from '@emailjs/browser';
import { 
  Terminal, 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Heart, 
  Send, 
  Loader2, 
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Feedback Categories
const CATEGORIES = [
  { id: "feature", label: "Feature Request", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "bug", label: "Report a Bug", icon: Bug, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  { id: "general", label: "General Feedback", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { id: "appreciation", label: "Appreciation", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
];

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState("feature");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setStatus("submitting");

    const templateParams = {
        title: selectedCategory.toUpperCase().replace("-", " "), 
        from_name: formData.name || "Anonymous", 
        reply_to: formData.email, 
        message: formData.message,
        time: new Date().toLocaleString()
    };

    try {
        // Debug check to verify env vars are loaded
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
             throw new Error("Missing Environment Variables. Did you restart the server?");
        }

        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        );
        
        setStatus("success");
    } catch (error) {
        console.error("EmailJS Error:", error);
        alert("Failed to send feedback. Check console for details.");
        setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* 1. NAVBAR (Responsive) */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600/20 border border-blue-500/50 rounded-lg flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-600/30 transition-all">
                    <Terminal className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-lg md:text-xl font-black tracking-tight text-white">
                    Tech <span className="text-blue-500">MSpace</span>
                </span>
            </Link>

            <Link href="/auth/login" className="text-xs md:text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Back to Login
            </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="pt-24 pb-16 md:pt-32 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
            
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
                
                {/* LEFT: Context */}
                <div className="space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] md:text-xs font-bold text-emerald-400">
                        <MessageSquare className="w-3 h-3" /> User Feedback Loop
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        Help us compile <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            a better version.
                        </span>
                    </h1>
                    
                    <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                        Tech MSpace is built by the community, for the community. Found a bug in the matrix? Have an idea for a killer feature? 
                        This is your direct line to the core maintainers.
                    </p>

                    <div className="pt-6 md:pt-8 border-t border-slate-900 space-y-4">
                        <h3 className="font-bold text-white text-xs md:text-sm uppercase tracking-widest">Other Channels</h3>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a href="mailto:noreply@techmspace.dev" className="flex items-center justify-center gap-2 text-slate-400 hover:text-blue-400 transition-colors bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 w-full text-sm md:text-base">
                                <span>Email Support</span>
                            </a>
                            <a href="#" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 w-full text-sm md:text-base">
                                <span>Join Discord (soon)</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Form */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    {status === "success" ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Message Received</h3>
                            <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xs mx-auto">
                                Thanks for contributing to the ecosystem. We'll review your feedback shortly.
                            </p>
                            <Button onClick={() => { setStatus("idle"); setFormData({name:"", email:"", message:""}); }} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                Send Another
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-5 md:space-y-6">
                            
                            {/* Category Selector */}
                            <div className="space-y-3">
                                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">Select Category</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                    {CATEGORIES.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = selectedCategory === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl border text-xs md:text-sm font-bold transition-all text-left",
                                                    isSelected 
                                                        ? `${cat.bg} ${cat.border} ${cat.color} ring-1 ring-inset ring-current` 
                                                        : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs md:text-sm font-bold text-slate-400">Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs md:text-sm font-bold text-slate-400">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-bold text-slate-400">Message</label>
                                <textarea 
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 min-h-[120px] md:min-h-[150px] resize-none"
                                    placeholder="Describe your idea or the bug you found..."
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={status === "submitting"}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                {status === "submitting" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Transmitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" /> Submit Feedback
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] md:text-xs text-center text-slate-600">
                                By submitting, you agree to our privacy policy. We value your input.
                            </p>
                        </form>
                    )}
                </div>
            </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-slate-600 text-xs md:text-sm text-center">
         <div className="container mx-auto px-6">
             <p>© {new Date().getFullYear()} Tech MSpace. Operating System of Youth.</p>
         </div>
      </footer>
    </div>
  );
}