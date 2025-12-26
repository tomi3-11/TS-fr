import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Code2, Users, Rocket, CheckCircle2, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50/50 backdrop-blur-sm border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            The Platform for Civic Tech
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8">
            Build software that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient bg-300%">
              actually matters.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop building todo lists. Start solving traffic congestion, health records, 
            and education gaps. Join the <span className="font-semibold text-slate-900">Tech MSpace</span> community today.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#communities" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base w-full sm:w-auto border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
                Explore Communities
              </Button>
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-slate-100 pt-10 opacity-80">
            <StatItem value="500+" label="Developers" />
            <StatItem value="12" label="Active Projects" />
            <StatItem value="3" label="Sectors Impacted" />
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="py-24 bg-slate-50/50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Everything you need to ship</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We provide the infrastructure for collaboration, so you can focus on the code.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-white" />}
              iconBg="bg-blue-600"
              title="Community Driven"
              description="Join specialized groups like 'Kenya Devs' or 'Health Tech'. Find your team, find your mentor, find your mission."
            />
            <FeatureCard 
              icon={<Code2 className="h-6 w-6 text-white" />}
              iconBg="bg-indigo-600"
              title="Project Incubation"
              description="Don't just code in a vacuum. Propose solutions, get community votes, and graduate your idea into an active project."
            />
            <FeatureCard 
              icon={<Rocket className="h-6 w-6 text-white" />}
              iconBg="bg-violet-600"
              title="Real Impact"
              description="Move beyond tutorials. We partner with local organizations to solve problems in Health, Transport, and Education."
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: VALUE PROP (Left/Right) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                From <span className="text-indigo-600">Idea</span> to <span className="text-violet-600">Deployment</span>
              </h2>
              <div className="space-y-6">
                <CheckItem title="Structured Proposals" desc="Submit ideas with problem statements and proposed solutions." />
                <CheckItem title="Democratic Voting" desc="The community votes on the most impactful projects." />
                <CheckItem title="Team Formation" desc="Apply to join projects based on your specific tech stack." />
              </div>
            </div>
            {/* Visual Side (Abstract representation) */}
            <div className="order-1 lg:order-2 bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">A</div>
                       <div>
                          <div className="font-semibold text-sm">Alice proposed a project</div>
                          <div className="text-xs text-slate-500">2 hours ago</div>
                       </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 ml-8 opacity-90">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">B</div>
                       <div>
                          <div className="font-semibold text-sm">Bob joined "Health Records"</div>
                          <div className="text-xs text-slate-500">5 mins ago</div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Terminal className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-white text-lg">Tech MSpace</span>
          </div>
          <div className="text-sm">
            &copy; 2025 Tech MSpace. Built for the community.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components for cleaner code
function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-slate-900">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, description }: { icon: React.ReactNode, iconBg: string, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
      <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CheckItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <CheckCircle2 className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
        <p className="text-slate-600">{desc}</p>
      </div>
    </div>
  );
}