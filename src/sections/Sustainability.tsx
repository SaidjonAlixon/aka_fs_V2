import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fuel, Route, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SustainabilityProps {
  className?: string;
}

const Sustainability = ({ className = '' }: SustainabilityProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const initiatives = [
    { icon: Fuel, text: 'Fuel-efficient driving' },
    { icon: Route, text: 'Route optimization' },
    { icon: Truck, text: 'Continuous fleet renewal' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: '-30vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: '45vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      const items = panelRef.current?.querySelectorAll('.initiative-item');
      if (items) {
        scrollTl.fromTo(
          items,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: 'none' },
          0.18
        );
      }

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sustainability"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/sustainability_scenic.jpg"
          alt="Truck on scenic road"
          className="bg-full"
        />
        <div className="bg-overlay" />
      </div>

      {/* Slash bars - repositioned */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[12vw] bg-navy/90 skew-x-[-12deg] origin-top border-r border-white/5 z-0"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[5vw] top-0 h-full w-[4vw] bg-lime skew-x-[-12deg] origin-top z-10"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[15vw] top-[12vh] md:top-[20vh] md:w-[35vw] max-w-[600px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            GREENER <span className="text-lime">MILES.</span><br />
            SMARTER ROUTES.
          </h2>
          <p className="text-gray-300 text-lg md:text-2xl leading-relaxed max-w-md">
            Fuel efficiency, route optimization, and a modern fleet that reduces emissions per mile.
          </p>
        </div>
      </div>

      {/* Initiatives panel */}
      <div
        ref={panelRef}
        className="absolute inset-x-6 md:inset-x-auto md:left-[54vw] bottom-[10vh] md:top-[18vh] md:w-[38vw] max-w-[550px] will-change-transform"
      >
        <div className="glass-card p-6 md:p-8">
          <span className="eyebrow block mb-8">Our Approach</span>

          <div className="space-y-6">
            {initiatives.map((item, index) => (
              <div
                key={index}
                className="initiative-item flex items-center gap-4 will-change-transform"
              >
                <div className="p-3 bg-lime/10 rounded-sm">
                  <item.icon className="w-5 h-5 text-lime" />
                </div>
                <span className="font-space font-semibold text-text-primary">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary w-full justify-center mt-6 md:mt-8 py-3 md:py-5 text-sm uppercase tracking-widest font-bold">
            Read Our Approach
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
