import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Headphones, Navigation, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CoverageProps {
  className?: string;
}

const Coverage = ({ className = '' }: CoverageProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: MapPin, value: '48', label: 'states covered' },
    { icon: Clock, value: '99.2%', label: 'on-time' },
    { icon: Headphones, value: '24/7', label: 'dispatch' },
  ];

  const features = [
    { icon: Navigation, title: 'Smart Routing', desc: 'AI-driven path optimization.' },
    { icon: Shield, title: 'Safe Delivery', desc: 'Secure transit for every load.' },
    { icon: Zap, title: 'Express Tech', desc: 'Real-time tracking & updates.' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ENTRANCE
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      });

      entranceTl.fromTo(
        headlineRef.current,
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0
      );

      entranceTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: '-100%', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' },
        0
      );

      const smallCards = cardsRef.current?.querySelectorAll('.small-card');
      if (smallCards) {
        entranceTl.fromTo(
            smallCards,
            { x: -50, opacity: 0, scale: 0.8 },
            { x: 0, opacity: 1, stagger: 0.1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
            0.2
        );
      }

      entranceTl.fromTo(
        mapPanelRef.current,
        { x: '10vw', opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        0.2
      );

      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        entranceTl.fromTo(
          statItems,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out' },
          0.4
        );
      }

      // SCROLL PIN & EXIT
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
        },
      });

      // EXIT
      scrollTl.to(
        [headlineRef.current, slashNavyRef.current, slashLimeRef.current, cardsRef.current],
        { x: '-20vw', opacity: 0, ease: 'power2.in', duration: 0.5 },
        0.5
      );

      scrollTl.to(
        mapPanelRef.current,
        { x: '20vw', opacity: 0, ease: 'power2.in', duration: 0.5 },
        0.5
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="coverage"
      className={`relative w-full h-screen overflow-hidden bg-background ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/home_diz/photo_2026-04-26_13-47-51.jpg"
          alt="Flatbed truck on road"
          className="bg-full opacity-50 grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Slash bars */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[12vw] bg-background/90 skew-x-[-12deg] origin-top border-r border-foreground/10 z-0 shadow-2xl"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[5vw] top-0 h-full w-[4vw] bg-lime skew-x-[-12deg] origin-top z-10"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[18vw] top-[12vh] md:top-[15vh] md:w-[35vw] max-w-[650px] z-20">
        <div ref={headlineRef} className="will-change-transform mb-12">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-foreground mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            COAST <span className="text-lime-dark dark:text-lime">TO</span><br />
            COAST.
          </h2>
          <p className="text-foreground text-lg md:text-2xl leading-relaxed max-w-md font-bold">
            Scheduled lanes, real-time tracking, and a network built for consistency.
          </p>
        </div>

        {/* Small Floating Cards/Icons */}
        <div ref={cardsRef} className="flex gap-4 md:gap-6">
            {features.map((item, idx) => (
                <div key={idx} className="small-card glass-card p-5 flex flex-col items-center text-center gap-3 border-foreground/10 hover:border-lime/30 transition-all duration-300 group">
                    <div className="p-3 bg-lime/10 rounded-sm group-hover:bg-lime/20 transition-colors">
                        <item.icon className="w-6 h-6 text-lime-dark dark:text-lime" />
                    </div>
                    <div className="hidden lg:block">
                        <div className="text-foreground font-black text-xs uppercase tracking-widest mb-1">{item.title}</div>
                        <div className="text-text-secondary text-[10px] leading-tight font-bold">{item.desc}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Map panel */}
      <div
        ref={mapPanelRef}
        className="absolute inset-x-6 md:inset-x-auto md:right-[8vw] bottom-[10vh] md:top-[18vh] md:w-[38vw] max-w-[550px] z-20"
      >
        <div className="glass-card p-6 md:p-10 h-auto md:h-[65vh] flex flex-col border-lime/20">
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-lime-dark dark:text-lime mb-6 md:mb-10 block font-bold">
            Active Lanes
          </span>

          <div className="hidden md:block flex-1 relative mb-10 overflow-hidden">
            <svg
              viewBox="0 0 400 250"
              className="w-full h-full transform scale-110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 200 L100 200 L120 180 L200 180 L220 160 L350 160 L380 140 L380 80 L350 60 L200 60 L150 40 L80 40 L50 60 Z"
                stroke="rgba(184, 255, 44, 0.2)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M80 120 Q150 100 200 110 Q280 120 350 100"
                stroke="currentColor"
                className="text-lime-dark/30 dark:text-lime/20"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
              />
              <path
                d="M100 150 Q180 140 250 150 Q320 160 360 140"
                stroke="currentColor"
                className="text-lime-dark/20 dark:text-lime/10"
                opacity="0.6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
              <circle cx="80" cy="120" r="5" fill="currentColor" className="text-lime-dark dark:text-lime" />
              <circle cx="200" cy="110" r="5" fill="currentColor" className="text-lime-dark dark:text-lime" />
              <circle cx="350" cy="100" r="5" fill="currentColor" className="text-lime-dark dark:text-lime" />
              <circle cx="100" cy="150" r="4" fill="currentColor" className="text-lime-dark dark:text-lime opacity-70" />
              <circle cx="250" cy="150" r="4" fill="currentColor" className="text-lime-dark dark:text-lime opacity-70" />
              <circle cx="360" cy="140" r="4" fill="currentColor" className="text-lime-dark dark:text-lime opacity-70" />
            </svg>
          </div>

          <div ref={statsRef} className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <stat.icon className="w-7 h-7 text-lime-dark dark:text-lime mx-auto mb-3" />
                <div className="font-space font-black text-xl md:text-3xl text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary w-full justify-center mt-6 md:mt-10 py-4 md:py-5 text-xs md:text-sm uppercase tracking-widest font-bold group relative overflow-hidden">
            <span className="relative z-10">View Lane Schedule</span>
             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Coverage;
