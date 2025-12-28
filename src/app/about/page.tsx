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
  Users,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

// --- 1. TEAM DATA ---
const TEAM = [
  {
    name: "Thomas Jose",
    role: "Lead Maintainer",
    bio: "Full-stack architect. Obsessed with clean code and civic tech.",
    socials: { 
        github: "https://github.com/tomi3-11", 
        linkedin: "https://www.linkedin.com/in/thomas-wotoro-a8504233a/",
        twitter: "#" 
    },
    gradient: "from-blue-500 to-indigo-500"
  },
  // Add more members here...
];

// --- 2. CONTRIBUTORS DATA ---
const CONTRIBUTORS = [
  "torvalds", "gaearon", "yyx990803", "sindresorhus", "tj", 
  "shadcn", "leerob", "timneutkens"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* 1. NAVBAR (Responsive Adjustments) */}
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

            <div className="flex items-center gap-3 md:gap-4">
                <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Log In
                </Link>
                <Link href="/auth/register">
                    {/* Smaller button on mobile */}
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 rounded-full px-4 py-2 text-xs md:text-sm md:px-6 font-bold h-9 md:h-10">
                        Join Movement
                    </Button>
                </Link>
            </div>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-4 md:px-6 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
         
         <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] md:text-xs font-bold text-indigo-400 mb-6">
                <Globe className="w-3 h-3" /> The Origin Story
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-tight mb-6 md:mb-8 leading-tight">
                Building the Digital Infrastructure for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    The Next Generation.
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                We noticed a gap. Millions of young brilliant minds are learning to code, yet local communities still face unsolved challenges. 
                <span className="text-white font-bold"> Tech MSpace</span> exists to bridge that gap.
            </p>
         </div>
      </section>

      {/* 3. MANIFESTO */}
      <section className="py-16 md:py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
                <h2 className="text-2xl md:text-4xl font-black text-white">
                    The Operating System <br />
                    <span className="text-slate-500">of the Youth.</span>
                </h2>
                <div className="space-y-4 md:space-y-6 text-slate-400 text-base md:text-lg leading-relaxed">
                    <p>
                        We believe that the youth are not just the "future"—they are the current engine of innovation. But an engine needs an operating system to run effectively.
                    </p>
                    <p>
                        Tech MSpace provides that OS. It is a layer of collaboration, governance, and deployment that sits on top of raw talent.
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs md:text-sm relative z-10">
                    <div className="bg-slate-900 border-b border-slate-800 p-3 flex gap-2">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
                        <div className="ml-4 text-[10px] md:text-xs text-slate-500">manifesto.ts</div>
                    </div>
                    <div className="p-4 md:p-6 space-y-2 text-slate-300">
                        <div className="flex"><span className="text-purple-400 mr-2">const</span> <span className="text-blue-400">OurValues</span> = {"{"}</div>
                        <div className="pl-4"><span className="text-indigo-400">collaboration</span>: <span className="text-emerald-400">true</span>,</div>
                        <div className="pl-4"><span className="text-indigo-400">ego</span>: <span className="text-red-400">null</span>,</div>
                        <div className="pl-4"><span className="text-indigo-400">impact</span>: <span className="text-yellow-400">"Local"</span>,</div>
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-500/10 blur-[60px] -z-10 rounded-full" />
            </div>
        </div>
      </section>

      {/* 4. PILLARS */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6">Our DNA</h2>
                <p className="text-slate-500 text-sm md:text-lg">The core principles that drive every line of code we write.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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

      {/* 5. TEAM SECTION */}
      <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-5xl font-black text-white mb-6">Core Maintainers</h2>
                <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto">
                    The humans behind the commits. We are a small, distributed team of builders passionate about open governance.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto justify-center">
                {TEAM.map((member, idx) => {
                    const githubUsername = member.socials.github.split("/").pop();
                    return (
                        <div key={idx} className="group relative p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-blue-500 hover:to-purple-600 transition-all duration-500">
                            {/* Reduced padding on mobile (p-6 vs p-8) */}
                            <div className="bg-slate-950 rounded-[22px] h-full p-6 md:p-8 flex flex-col items-center text-center relative z-10">
                                
                                {/* Dynamic Avatar (Smaller on mobile: w-20 vs w-28) */}
                                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br ${member.gradient} p-1 mb-6 shadow-xl group-hover:scale-105 transition-transform duration-500`}>
                                    <img 
                                        src={`https://github.com/${githubUsername}.png`} 
                                        alt={member.name}
                                        className="w-full h-full rounded-xl object-cover bg-slate-900"
                                    />
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{member.name}</h3>
                                <div className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">{member.role}</div>
                                
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                                    "{member.bio}"
                                </p>

                                {/* Social Links */}
                                <div className="mt-auto flex gap-4">
                                    {member.socials.github && (
                                        <SocialLink href={member.socials.github} icon={<Github className="w-4 h-4" />} />
                                    )}
                                    {member.socials.twitter && member.socials.twitter !== "#" && (
                                        <SocialLink href={member.socials.twitter} icon={<Twitter className="w-4 h-4" />} />
                                    )}
                                    {member.socials.linkedin && member.socials.linkedin !== "#" && (
                                        <SocialLink href={member.socials.linkedin} icon={<Linkedin className="w-4 h-4" />} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* 6. CONTRIBUTORS SECTION */}
      <section className="py-16 md:py-24 bg-slate-900/30 border-t border-slate-900">
         <div className="container mx-auto px-4 md:px-6 text-center">
             <div className="mb-10 md:mb-12">
                 <h2 className="text-xl md:text-2xl font-black text-slate-300 mb-4">Open Source Contributors</h2>
                 <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                     Tech MSpace isn't owned by a corporation. It's built by students, professionals, and hobbyists who want to see change.
                 </p>
             </div>

             {/* <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto opacity-80 md:opacity-70 hover:opacity-100 transition-opacity duration-500">
                 {CONTRIBUTORS.map((username, i) => (
                     <a 
                        key={i} 
                        href={`https://github.com/${username}`} 
                        target="_blank"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 overflow-hidden hover:scale-110 hover:border-blue-500 transition-all cursor-pointer bg-slate-800"
                        title={username}
                     >
                        <img 
                            src={`https://github.com/${username}.png`} 
                            alt={username}
                            className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                        />
                     </a>
                 ))}
                 
                 <Link href="https://github.com/Tech-MSpace" target="_blank" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all cursor-pointer">
                    <div className="text-lg md:text-xl">+</div>
                 </Link>
             </div> */}

             <div className="mt-10 md:mt-12">
                 <Link href="https://github.com/Tech-MSpace" target="_blank">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs md:text-sm h-10 md:h-12">
                        Become a Contributor
                    </Button>
                 </Link>
             </div>
         </div>
      </section>

      {/* 7. CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-3xl p-8 md:p-12 text-center border border-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
            
            <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 relative z-10">
                Ready to Deploy Your Potential?
            </h2>
            <p className="text-slate-300 text-sm md:text-lg mb-8 max-w-2xl mx-auto relative z-10">
                The ecosystem is waiting. Join thousands of developers building the future of our digital society.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link href="/auth/register" className="w-full sm:w-auto">
                    {/* Adjusted button size for mobile (h-12 vs h-14) */}
                    <Button className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 text-sm md:text-base">
                        Get Started Now
                    </Button>
                </Link>
                <Link href="/feedback" className="w-full sm:w-auto">
                    <Button variant="ghost" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-full text-sm md:text-base">
                        Give Feedback
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 md:py-12 bg-slate-950 border-t border-slate-900 text-slate-500 text-xs md:text-sm text-center">
        <div className="container mx-auto px-6">
             <div className="flex items-center justify-center gap-2 mb-4 text-slate-300">
                <Terminal className="w-4 h-4 md:w-5 md:h-5" />
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

// --- SUB COMPONENTS ---

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 rounded-lg flex items-center justify-center mb-4 md:mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

function SocialLink({ href, icon }: { href: string, icon: any }) {
    return (
        <a href={href} target="_blank" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 transition-all">
            {icon}
        </a>
    )
}