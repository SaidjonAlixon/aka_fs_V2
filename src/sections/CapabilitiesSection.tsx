import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Package, BarChart3, Globe2, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesSectionProps {
  onApplyClick?: () => void;
}

const CapabilitiesSection = ({ onApplyClick }: CapabilitiesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const capabilities = [
    { icon: Package, label: 'Full Truckload (FTL)' },
    { icon: BarChart3, label: 'Partial Loads (LTL)' },
    { icon: Globe2, label: 'Cross-Country Lanes' },
    { icon: ShieldCheck, label: 'Hazmat Certified' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }
      );
      gsap.fromTo(
        contentRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-[#060d14] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left visual */}
          <div ref={imageRef} className="relative">
            <div className="aspect-[4/3] bg-navy border border-white/10 relative overflow-hidden">
              <img
                src="/images/safety_wet_road.jpg"
                alt="AKA FS Fleet"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

              {/* Overlay badge */}
              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 glass-card p-4 md:p-6">
                <div className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-lime mb-2 md:mb-3">Active Right Now</div>
                <div className="flex items-end gap-2 md:gap-3">
                  <span className="font-space font-black text-3xl md:text-5xl text-white">340+</span>
                  <span className="text-gray-400 text-[10px] md:text-sm pb-1 md:pb-2">active trucks on road today</span>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-lime/60" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-lime/60" />
            </div>
          </div>

          {/* Right content */}
          <div ref={contentRef}>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-8">Our Capabilities</span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8">
              BUILT TO <br /><span className="text-lime">SCALE</span><br />WITH YOU.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
              From single loads to dedicated fleets, we grow with your logistics needs. No volume too small, no lane too complex.
            </p>

            {/* Capabilities list */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-center gap-4 group p-4 border border-white/5 hover:border-lime/30 transition-all duration-300">
                  <div className="p-3 bg-lime/10 group-hover:bg-lime/20 transition-colors">
                    <cap.icon className="w-5 h-5 text-lime" />
                  </div>
                  <span className="font-space font-bold text-sm uppercase tracking-tight text-gray-300 group-hover:text-white transition-colors">
                    {cap.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onApplyClick}
              className="inline-flex items-center gap-4 font-space font-black text-xs md:text-sm uppercase tracking-widest text-lime border border-lime/30 px-6 md:px-8 py-4 md:py-5 hover:bg-lime hover:text-navy transition-all duration-300 shadow-[0_0_20px_rgba(184,255,44,0.2)]"
            >
              Apply Now
              <span className="text-lg md:text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
