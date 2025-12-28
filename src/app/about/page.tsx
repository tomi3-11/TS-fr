"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Terminal, 
  ArrowRight, 
  Cpu, 
  Globe, 
  Heart, 
  GitCommit, 
  Share2,
  Users
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* 1. NAVBAR (Consistent with Landing) */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/50 rounded-lg flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-600/30 transition-all">
                    <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                    Tech <span className="text-blue-500">MSpace</span>
                </span>
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Log In
                </Link>
                <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 rounded-full px-6 font-bold">
                        Join Movement
                    </Button>
                </Link>
            </div>
        </div>
      </header>

      {/* 2. HERO: THE VISION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
         
         <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400 mb-6">
                <Globe className="w-3 h-3" /> The Origin Story
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
                Building the Digital Infrastructure for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    The Next Generation.
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                We noticed a gap. Millions of young brilliant minds are learning to code, yet local communities still face unsolved challenges. 
                <span className="text-white font-bold"> Tech MSpace</span> exists to bridge that gap turning learners into builders, and ideas into civic impact.
            </p>
         </div>
      </section>

      {/* 3. THE MANIFESTO (Code Block Visual) */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-black text-white">
                    The Operating System <br />
                    <span className="text-slate-500">of the Youth.</span>
                </h2>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                    <p>
                        We believe that the youth are not just the "future" they are the current engine of innovation. But an engine needs an operating system to run effectively.
                    </p>
                    <p>
                        Tech MSpace provides that OS. It is a layer of collaboration, governance, and deployment that sits on top of raw talent. We are moving away from competitive hackathons and towards <span className="text-blue-400 font-bold">collaborative nation-building</span>.
                    </p>
                </div>
            </div>

            {/* Right: Code Editor Visual */}
            <div className="relative">
                <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm relative z-10">
                    <div className="bg-slate-900 border-b border-slate-800 p-3 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div className="ml-4 text-xs text-slate-500">manifesto.ts</div>
                    </div>
                    <div className="p-6 space-y-2 text-slate-300">
                        <div className="flex"><span className="text-purple-400 mr-2">const</span> <span className="text-blue-400">OurValues</span> = {"{"}</div>
                        <div className="pl-4"><span className="text-indigo-400">collaboration</span>: <span className="text-emerald-400">true</span>,</div>
                        <div className="pl-4"><span className="text-indigo-400">ego</span>: <span className="text-red-400">null</span>,</div>
                        <div className="pl-4"><span className="text-indigo-400">impact</span>: <span className="text-yellow-400">"Local & Global"</span>,</div>
                        <div className="pl-4"><span className="text-indigo-400">source</span>: <span className="text-yellow-400">"Open"</span></div>
                        <div>{"};"}</div>
                        <br />
                        <div className="flex"><span className="text-purple-400 mr-2">async function</span> <span className="text-yellow-400">buildFuture</span>() {"{"}</div>
                        <div className="pl-4"><span className="text-purple-400">while</span>(true) {"{"}</div>
                        <div className="pl-8"><span className="text-blue-400">we</span>.<span className="text-yellow-400">ship</span>();</div>
                        <div className="pl-4">{"}"}</div>
                        <div>{"}"}</div>
                    </div>
                </div>
                {/* Glow behind code */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-500/10 blur-[60px] -z-10 rounded-full" />
            </div>
        </div>
      </section>

      {/* 4. OUR PILLARS */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Our DNA</h2>
                <p className="text-slate-500 text-lg">The core principles that drive every line of code we write.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <ValueCard 
                    icon={<GitCommit className="w-6 h-6 text-emerald-400" />}
                    title="Open Source by Default"
                    desc="We believe knowledge should be free. Every tool, library, and platform we build is open for anyone to inspect, fork, and improve."
                />
                <ValueCard 
                    icon={<Users className="w-6 h-6 text-blue-400" />}
                    title="Radical Inclusivity"
                    desc="Your background, degree, or location doesn't matter here. If you can write code or design solutions, you have a seat at the table."
                />
                <ValueCard 
                    icon={<Cpu className="w-6 h-6 text-purple-400" />}
                    title="Civic Utility"
                    desc="We don't build tech for tech's sake. We build systems that solve traffic, health, education, and governance problems."
                />
            </div>
        </div>
      </section>

      {/* 5. TEAM / CONTRIBUTORS */}
      <section className="py-24 bg-slate-900/30 border-t border-slate-900">
         <div className="container mx-auto px-6 text-center">
             <div className="mb-12">
                 <h2 className="text-3xl font-black text-white mb-4">Built by the Community</h2>
                 <p className="text-slate-400 max-w-2xl mx-auto">
                     Tech MSpace isn't owned by a corporation. It's built by students, professionals, and hobbyists who want to see change.
                 </p>
             </div>

             {/* Simulated Contributor Grid */}
             {/* <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-500">
                 {Array.from({ length: 18 }).map((_, i) => (
                     <div key={i} className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:scale-110 transition-all cursor-pointer" title={`Contributor ${i+1}`}>
                        {['JD', 'AK', 'MS', 'DL', 'TR'][i % 5]}
                     </div>
                 ))}
                 <div className="w-12 h-12 rounded-full bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all cursor-pointer">
                    <div className="text-xl">+</div>
                 </div>
             </div>

             <div className="mt-12">
                 <Link href="https://github.com/techmspace" target="_blank">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        Become a Contributor
                    </Button>
                 </Link>
             </div> */}
         </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-3xl p-12 text-center border border-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
                Ready to Deploy Your Potential?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                The ecosystem is waiting. Join thousands of developers building the future of our digital society.
            </p>
            <div className="flex justify-center gap-4 relative z-10">
                <Link href="/auth/register">
                    <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-500/20">
                        Started Now
                    </Button>
                </Link>
                <Link href="/feedback">
                    <Button variant="ghost" className="h-14 px-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
                        Give Feedback
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-500 text-sm text-center">
        <div className="container mx-auto px-6">
             <div className="flex items-center justify-center gap-2 mb-4 text-slate-300">
                <Terminal className="w-5 h-5" />
                <span className="font-bold">Tech MSpace</span>
             </div>
             <p>
                © {new Date().getFullYear()} Tech MSpace. Made with <Heart className="w-3 h-3 inline text-red-500" /> for the builders.
             </p>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENT ---
function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}