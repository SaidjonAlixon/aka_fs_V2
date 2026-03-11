import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Route, Radio, Wifi } from 'lucide-react';

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
    { icon: Radio, text: 'Live GPS on every trailer' },
    { icon: Wifi, text: 'Real-time status updates' },
    { icon: Route, text: 'Dynamic route optimization' },
    { icon: MapPin, text: 'Geofenced delivery alerts' },
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
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-navy overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-bl from-lime/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left: Headline + features */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-8">National Reach</span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 md:mb-10">
              A NETWORK<br />THAT <span className="text-lime">NEVER</span><br />SLEEPS.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-md">
              340+ active trucks, 48 states covered, 24/7 dispatch. Our network runs around the clock so your supply chain never stops.
            </p>

            <div className="space-y-4">
              {features.map((f, idx) => (
                <div key={idx} className="network-feature flex items-center gap-5 p-4 border border-white/5 hover:border-lime/30 transition-all duration-300 group">
                  <div className="p-3 bg-lime/10 group-hover:bg-lime/20 transition-colors rounded-sm">
                    <f.icon className="w-5 h-5 text-lime" />
                  </div>
                  <span className="font-space font-bold text-sm uppercase tracking-wide text-gray-300 group-hover:text-white transition-colors">
                    {f.text}
                  </span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-lime animate-pulse" />
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
                  className="region-card group relative p-6 border border-white/5 hover:border-lime/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-400 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-lime/0 group-hover:bg-lime/50 transition-all duration-500" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <MapPin className="w-5 h-5 text-lime" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-1 animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <div className="font-space font-black text-xl md:text-2xl text-white uppercase tracking-tight mb-1 group-hover:text-lime transition-colors">
                    {region.label}
                  </div>
                  <div className="text-gray-500 text-[10px] md:text-xs font-mono uppercase tracking-widest mb-2 md:mb-3">{region.coverage}</div>
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
