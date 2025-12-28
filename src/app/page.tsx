"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Terminal, 
  ArrowRight, 
  Users, 
  Code2, 
  Rocket, 
  CheckCircle2, 
  MessageSquare,
  Github,
  Heart
} from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden font-sans">
      
      {/* 1. NAVBAR */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md transition-all">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/50 rounded-lg flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-600/30 transition-all">
                    <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                    Tech <span className="text-blue-500">MSpace</span>
                </span>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/about" className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    About Us
                </Link>
                <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Log In
                </Link>
                <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 rounded-full px-6 font-bold">
                        Join Now
                    </Button>
                </Link>
            </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Updated Slogan) */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
         
         <div className="container mx-auto max-w-5xl text-center relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:border-blue-500/50 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v1.0 Public Beta
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                Build software that <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    actually matters.
                </span>
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
                Stop building isolated todo lists. Start collaborating on real solutions for local challenges. 
                Join <span className="text-white font-bold">Tech MSpace</span> to connect, vote, and ship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <Link href="/auth/register" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-white text-slate-950 hover:bg-blue-50 font-bold text-base rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Start Building <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </Link>
                <Link href="#developers" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 rounded-full font-bold">
                        Meet the Team
                    </Button>
                </Link>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80 animate-in fade-in duration-1000 delay-300">
                 <StatItem value="500+" label="Builders" />
                 <StatItem value="120+" label="Projects" />
                 <StatItem value="50+" label="Hubs" />
                 <StatItem value="100%" label="Open Source" />
            </div>
         </div>
      </section>

      {/* 3. FEATURES (Clean Mode) */}
      <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-800">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Everything you need to ship
               </h2>
               <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  We provide the infrastructure for collaboration so you can focus on the code.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={<Users className="w-6 h-6 text-white" />}
                  color="bg-blue-600"
                  title="Community Driven"
                  description="Join specialized groups like 'Nairobi Devs' or 'AI Research'. Find your team, find your mentor, find your mission."
               />
               <FeatureCard 
                  icon={<Code2 className="w-6 h-6 text-white" />}
                  color="bg-indigo-600"
                  title="Project Incubation"
                  description="Don't just code in a vacuum. Propose solutions, get community votes, and graduate your idea into an active project."
               />
               <FeatureCard 
                  icon={<Rocket className="w-6 h-6 text-white" />}
                  color="bg-purple-600"
                  title="Real Impact"
                  description="Move beyond tutorials. Partner with local organizations to solve problems in Health, Transport, and Education."
               />
            </div>
         </div>
      </section>

      {/* 4. VALUE PROP */}
      <section className="py-24 bg-white text-slate-900">
         <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               
               <div className="order-2 lg:order-1">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                     From <span className="text-blue-600">Idea</span> to <span className="text-purple-600">Deployment</span>
                  </h2>
                  <div className="space-y-8">
                     <CheckItem title="Structured Proposals" desc="Submit ideas with problem statements and proposed solutions." />
                     <CheckItem title="Democratic Voting" desc="The community votes on the most impactful projects." />
                     <CheckItem title="Team Formation" desc="Apply to join projects based on your specific tech stack." />
                  </div>
               </div>

               <div className="order-1 lg:order-2 perspective-1000">
                  <div className="relative bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 transform group">
                     <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                     </div>
                     <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-4 flex items-center gap-4 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">A</div>
                        <div>
                           <div className="text-slate-200 font-bold text-sm">Alice proposed a project</div>
                           <div className="text-slate-500 text-xs">"Traffic Optimization AI" • 2 hours ago</div>
                        </div>
                     </div>
                     <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-4 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">B</div>
                        <div>
                           <div className="text-slate-200 font-bold text-sm">Bob joined "Health Records"</div>
                           <div className="text-slate-500 text-xs">Role: Backend Dev • 5 mins ago</div>
                        </div>
                     </div>
                     <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. NEW: DEVELOPER & TEAM CTA (Terminal Style) */}
      <section id="developers" className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden relative group">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                            <Terminal className="w-4 h-4" /> Developers Only
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">
                            Built by Youth. <br />
                            <span className="text-slate-500">Maintained by You.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Tech MSpace is open-source. We are looking for core contributors to help us build the operating system for the next generation. 
                            Front-end, Back-end, or Design — there is a commit waiting for you.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                             <a href="https://github.com/techmspace" target="_blank">
                                <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 h-12 px-6 rounded-xl font-bold flex items-center gap-2">
                                    <Github className="w-4 h-4" /> View Source Code
                                </Button>
                             </a>
                             <Link href="/about">
                                <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 h-12 px-6 rounded-xl font-bold">
                                    Meet the Core Team <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                             </Link>
                        </div>
                    </div>

                    {/* Code Snippet Visual */}
                    <div className="w-full md:w-auto min-w-[300px] bg-black/50 rounded-xl border border-slate-800 p-6 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                        <div className="flex gap-1.5 mb-4 opacity-50">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex">
                                <span className="text-purple-400 mr-2">const</span>
                                <span className="text-blue-400">mission</span>
                                <span className="text-white mx-2">=</span>
                                <span className="text-emerald-400">"Empower Youth"</span>;
                            </div>
                            <div className="flex">
                                <span className="text-purple-400 mr-2">async function</span>
                                <span className="text-yellow-400">joinTeam</span>() {"{"}
                            </div>
                            <div className="pl-4">
                                <span className="text-purple-400">await</span>
                                <span className="text-blue-400"> TechMSpace</span>.
                                <span className="text-yellow-400">contribute</span>();
                            </div>
                            <div className="pl-4">
                                <span className="text-slate-500">// You are the missing piece</span>
                            </div>
                            <div>{"}"}</div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-16 bg-slate-950 border-t border-slate-900 text-slate-400">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-blue-500" />
                    <span className="text-xl font-bold text-slate-200">Tech MSpace</span>
                </div>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                    The Operating System of the Youth. Empowering the next generation of builders through civic tech and open collaboration.
                </p>
            </div>

            {/* Links */}
            <div>
                <h4 className="text-white font-bold mb-6">Platform</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li><Link href="/auth/register" className="hover:text-blue-400 transition-colors">Join Community</Link></li>
                    <li><Link href="/auth/login" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
                    <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                </ul>
            </div>

            {/* Feedback & Social */}
            <div>
                <h4 className="text-white font-bold mb-6">Connect</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li>
                        <Link href="/feedback" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                            <MessageSquare className="w-4 h-4" /> Share Feedback
                        </Link>
                    </li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter / X</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">GitHub</a></li>
                </ul>
            </div>
        </div>
        
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
            <div>
                © {currentYear} Tech MSpace. Built with <Heart className="w-3 h-3 inline text-red-500 mx-1" /> by the community.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-slate-400">Privacy</a>
                <a href="#" className="hover:text-slate-400">Terms</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black text-white mb-1">{value}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function FeatureCard({ icon, color, title, description }: { icon: any, color: string, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default">
            <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}

function CheckItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 bg-blue-50 p-1.5 rounded-full h-fit">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}