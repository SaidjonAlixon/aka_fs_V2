import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Utensils, Factory, Heart, Wheat, HardHat } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface IndustriesProps {
  className?: string;
  onApplyClick?: () => void;
}

const Industries = ({ className = '', onApplyClick }: IndustriesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const industries = [
    { icon: ShoppingCart, name: 'Retail & CPG', desc: 'Fast-moving consumer goods logistics.' },
    { icon: Utensils, name: 'Food & Beverage', desc: 'Temperature-sensitive food transport.' },
    { icon: Factory, name: 'Manufacturing', desc: 'Industrial supply chain solutions.' },
    { icon: Heart, name: 'Healthcare', desc: 'Medical and pharmaceutical delivery.' },
    { icon: Wheat, name: 'Agriculture', desc: 'Seasonal and bulk farm transport.' },
    { icon: HardHat, name: 'Construction', desc: 'Heavy equipment and material hauling.' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      // ENTRANCE
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: '-100%', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' },
        0
      );

      const items = listRef.current?.querySelectorAll('.industry-item');
      if (items) {
        scrollTl.fromTo(
          items,
          { 
            x: '30vw', 
            opacity: 0, 
            scale: 0.8, 
            rotationY: 45,
            y: (i) => (i % 2 === 0 ? -40 : 40) 
          },
          { 
            x: 0, 
            opacity: 1, 
            stagger: 0.1, 
            scale: 1, 
            rotationY: 0,
            y: 0, 
            ease: 'back.out(1.2)' 
          },
          0.1
        );
      }

      // EXIT
      scrollTl.to(
        [headlineRef.current, slashNavyRef.current, slashLimeRef.current],
        { x: '-20vw', opacity: 0, ease: 'power2.in', duration: 0.3 },
        0.75
      );

      if (items) {
        scrollTl.to(
          items,
          { x: '20vw', opacity: 0, stagger: 0.04, ease: 'power2.in', duration: 0.3 },
          0.75
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="industries"
      className={`relative w-full h-screen overflow-hidden bg-background ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Background image with deeper overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/industries_reefer_night.jpg"
          alt="Reefer truck at night"
          className="bg-full opacity-40 grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      {/* Slash bars */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[12vw] bg-background/95 skew-x-[-12deg] origin-top border-r border-foreground/10 z-0 shadow-2xl"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[5vw] top-0 h-full w-[4.5vw] bg-lime skew-x-[-12deg] origin-top z-10 shadow-[0_0_50px_rgba(184,255,44,0.3)]"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[18vw] top-[12vh] md:top-[20vh] md:w-[35vw] max-w-[650px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black text-foreground mb-4 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            BUILT <span className="text-lime">FOR</span><br />
            YOUR SECTOR.
          </h2>
          <p className="text-foreground text-base sm:text-lg md:text-2xl leading-relaxed max-w-lg mb-6 md:mb-12 font-bold">
            Compliance, handling, and delivery windows tailored to your industry. 100% specialized logistics.
          </p>

          {/* REPOSITIONED AND REDESIGNED BUTTON */}
          <div className="flex justify-start">
            <button 
              onClick={onApplyClick}
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-lime text-navy font-black text-xs sm:text-sm md:text-lg uppercase tracking-[0.2em] transform transition-all duration-500 overflow-hidden shadow-[0_0_20px_rgba(184,255,44,0.3)]"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">Apply Now</span>
              <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* UNIQUE INDUSTRIES GRID */}
      <div
        ref={listRef}
        className="absolute inset-x-4 sm:inset-x-6 md:inset-x-auto md:right-[8vw] bottom-[5vh] sm:bottom-[10vh] md:top-[18vh] md:w-[40vw] max-w-[650px] z-20"
      >
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-8 lg:gap-10">
          {industries.map((industry, index) => (
            <div
              key={index}
              className={`industry-item group relative p-0.5 sm:p-1 transition-all duration-500 ${
                index % 2 === 1 ? 'md:mt-12' : ''
              }`}
            >
              <div className="relative glass-card p-3 sm:p-4 lg:p-10 border-foreground/10 hover:border-lime/40 transition-all duration-500 group-hover:-translate-y-2 sm:group-hover:-translate-y-4 group-hover:bg-secondary/90 overflow-hidden h-full">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-lime/5 -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 rounded-full blur-2xl sm:blur-3xl group-hover:bg-lime/20 transition-all duration-500" />
                
                <div className="flex flex-col items-start gap-3 sm:gap-4 lg:gap-6 relative z-10">
                  <div className="p-2 sm:p-3 md:p-5 bg-secondary border border-foreground/10 rounded-sm group-hover:border-lime/50 group-hover:bg-lime/10 transition-all duration-500 transform group-hover:rotate-[360deg]">
                    <industry.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-lime" />
                  </div>
                  
                  <div>
                    <h3 className="font-space font-black text-xs sm:text-lg lg:text-3xl text-text-primary uppercase tracking-tight mb-1 group-hover:text-lime transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-text-secondary text-[10px] sm:text-sm lg:text-base leading-snug opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 line-clamp-2 hidden sm:block font-bold">
                      {industry.desc}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-lime transition-all duration-700 group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
