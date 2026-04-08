import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Zap, TrendingUp, Users, Timer } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NetworkSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const regions = [
    { label: 'Northeast', coverage: '12 States', active: '85 Loads' },
    { label: 'Southeast', coverage: '11 States', active: '120 Loads' },
    { label: 'Midwest', coverage: '12 States', active: '94 Loads' },
    { label: 'Southwest', coverage: '7 States', active: '68 Loads' },
    { label: 'West Coast', coverage: '5 States', active: '110 Loads' },
    { label: 'Mountain', coverage: '8 States', active: '45 Loads' },
  ];

  const features = [
    { icon: Calendar, title: 'PREBOOK LOADS', desc: "We plan ahead so you're not waiting after delivery - next load ready." },
    { icon: Zap, title: 'HOTSHOT / URGENT LOAD PRIORITY', desc: 'Access to time sensitive loads with better rates.' },
    { icon: TrendingUp, title: 'RATE NEGOTIATION EXPERTS', desc: 'We fight for best rates not cheap freight.' },
    { icon: Users, title: 'DRIVER FOCUSED DISPATCH', desc: "We don't overload you we build schedules that work." },
    { icon: Timer, title: 'FAST TURNAROUND LOADS', desc: 'Pick up and drop quickly more loads per week.' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.region-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }
      );
      gsap.fromTo(
        '.network-feature',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-bl from-lime/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left: Headline + features */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-8">National Reach</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-8 md:mb-10">
              KEEP YOUR <br />TRUCK <span className="text-lime">MOVING</span><br />ALWAYS.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-12 max-w-md font-bold">
              We keep your truck loaded with preplanned power only freight, strong RPM, and real dispatch support day and night.
            </p>

            <div className="space-y-4">
              {features.map((f, idx) => (
                <div key={idx} className="network-feature flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-foreground/10 hover:border-lime/30 transition-all duration-300 group bg-secondary">
                  <div className="p-3 bg-lime/10 group-hover:bg-lime/20 transition-colors rounded-sm shrink-0">
                    <f.icon className="w-5 h-5 text-lime" />
                  </div>
                  <div className="flex-1">
                    <div className="font-space font-bold text-sm uppercase tracking-wide text-foreground mb-1 group-hover:text-lime transition-colors">
                      {f.title}
                    </div>
                    <div className="text-text-secondary text-xs font-bold">
                      {f.desc}
                    </div>
                  </div>
                  <div className="hidden md:block ml-auto w-2 h-2 rounded-full bg-lime animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Region cards */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {regions.map((region, idx) => (
                <div
                  key={idx}
                  className="region-card group relative p-6 border border-foreground/10 hover:border-lime/30 bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-all duration-400 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-lime/0 group-hover:bg-lime/50 transition-all duration-500" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <MapPin className="w-5 h-5 text-lime" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-1 animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <div className="font-space font-black text-xl md:text-2xl text-foreground uppercase tracking-tight mb-1 group-hover:text-lime transition-colors">
                    {region.label}
                  </div>
                  <div className="text-text-secondary text-[10px] md:text-xs font-mono uppercase tracking-widest mb-2 md:mb-3 font-bold">{region.coverage}</div>
                  <div className="text-lime text-xs md:text-sm font-space font-bold">{region.active} Active</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
