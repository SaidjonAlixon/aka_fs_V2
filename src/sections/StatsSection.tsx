import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Award, Clock, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: TrendingUp, value: '500K+', label: 'Loads Delivered', sub: 'and counting' },
  { icon: Globe, value: '48', label: 'States Covered', sub: 'nationwide network' },
  { icon: Clock, value: '99.2%', label: 'On-Time Rate', sub: 'industry-leading' },
  { icon: Award, value: '12+', label: 'Years Experience', sub: 'trusted partner' },
];

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pin and scrub — bidirectional (works on scroll up too)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Each card animates in from a different direction
      const directions = [
        { x: -120, y: 60, rotation: -15 },  // card 0: from left-bottom, tilted
        { x: 0,    y: -100, rotation: 10 }, // card 1: from top, tilt right
        { x: 0,    y: 120, rotation: -8 },  // card 2: from bottom, tilt left
        { x: 120,  y: 60, rotation: 12 },   // card 3: from right-bottom, tilted
      ];

      // ENTER phase (0 → 0.5)
      directions.forEach((dir, idx) => {
        const isMobile = window.innerWidth < 768;
        const xOffset = isMobile ? dir.x * 0.4 : dir.x;
        const yOffset = isMobile ? dir.y * 0.4 : dir.y;

        tl.fromTo(
          `.stat-card-${idx}`,
          { x: xOffset, y: yOffset, rotation: dir.rotation, opacity: 0, scale: 0.7 },
          { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.4 },
          idx * 0.04
        );
      });

      // Connecting line fills up
      tl.fromTo(
        '.stats-line',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', duration: 0.3 },
        0.05
      );

      // Hold in middle (0.5 → 0.55)
      tl.to({}, { duration: 0.1 });

      // EXIT phase: cards fly out in opposite directions
      directions.forEach((dir, idx) => {
        tl.fromTo(
          `.stat-card-${idx}`,
          { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 },
          { x: -dir.x * 0.8, y: dir.y * 0.8, rotation: -dir.rotation, opacity: 0, scale: 0.75, ease: 'power2.in', duration: 0.35 },
          0.55 + idx * 0.04
        );
      });

      // Headline exit — slides up
      tl.fromTo(
        '.stats-headline',
        { y: 0, opacity: 1 },
        { y: -60, opacity: 0, ease: 'power2.in', duration: 0.3 },
        0.58
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-40 bg-navy overflow-hidden">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(184,255,44,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,255,44,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Headline */}
        <div className="stats-headline text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime">Performance Metrics</span>
          {/* Animated connector line under eyebrow */}
          <div className="mx-auto mt-4 w-48 h-[2px] bg-white/5 relative overflow-hidden">
            <div className="stats-line absolute inset-0 bg-lime/60 origin-left" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`stat-card-${idx} group relative text-center p-6 md:p-10 border border-white/5 hover:border-lime/30 transition-colors duration-500 bg-white/[0.02] hover:bg-white/[0.05] overflow-hidden`}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-lime group-hover:w-full transition-all duration-700" />

              {/* Rotating ring decoration */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full border border-lime/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ animation: 'spinSlow 8s linear infinite' }}
              />

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-lime/10 rounded-sm group-hover:bg-lime/20 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-lime" />
                </div>
              </div>

              <div className="font-space font-black text-3xl md:text-5xl lg:text-6xl text-white mb-2 group-hover:text-lime transition-colors duration-300">
                {stat.value}
              </div>
              <div className="font-space font-bold text-sm uppercase tracking-widest text-white mb-1">
                {stat.label}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">
                {stat.sub}
              </div>

              {/* Bottom corner accent */}
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-lime/20 group-hover:border-lime/60 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
