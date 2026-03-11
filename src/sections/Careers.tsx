import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Heart, PiggyBank, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CareersProps {
  className?: string;
  onApplyClick?: () => void;
}

const Careers = ({ className = '', onApplyClick }: CareersProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const benefits = [
    { icon: DollarSign, text: 'Competitive pay + bonuses' },
    { icon: Heart, text: 'Health + dental' },
    { icon: PiggyBank, text: '401(k) with match' },
    { icon: Calendar, text: 'Paid time off' },
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

      const isMobile = window.innerWidth < 768;

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: isMobile ? -50 : '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: isMobile ? -30 : '-30vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: isMobile ? 50 : '45vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      const items = panelRef.current?.querySelectorAll('.benefit-item');
      if (items) {
        scrollTl.fromTo(
          items,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, ease: 'none' },
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
      id="drivers"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/careers_driver_cab.jpg"
          alt="Professional driver in cab"
          className="bg-full"
        />
        <div className="bg-overlay" />
      </div>

      {/* Slash bars (left side) */}
      <div
        ref={slashNavyRef}
        className="hidden md:block absolute left-[-6vw] top-0 h-full w-[10vw] bg-navy slash-bar will-change-transform"
      />
      <div
        ref={slashLimeRef}
        className="hidden md:block absolute left-[2vw] top-0 h-full w-[3.5vw] bg-lime slash-bar will-change-transform"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[15vw] top-[15vh] md:top-[20vh] md:w-[35vw] max-w-[600px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            DRIVE <span className="text-lime">WITH</span><br />
            A TEAM.
          </h2>
          <p className="text-gray-300 text-lg md:text-2xl leading-relaxed max-w-md">
            Competitive pay, consistent freight, respectful dispatch, and modern equipment.
          </p>
        </div>
      </div>

      {/* Benefits panel */}
      <div
        ref={panelRef}
        className="absolute inset-x-6 md:inset-x-auto md:left-[54vw] bottom-[10vh] md:top-[18vh] md:w-[38vw] max-w-[550px] will-change-transform"
      >
        <div className="glass-card p-6 md:p-8">
          <span className="eyebrow block mb-8">Driver Benefits</span>

          <div className="space-y-5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="benefit-item flex items-center gap-4 will-change-transform"
              >
                <div className="p-3 bg-lime/10 rounded-sm">
                  <benefit.icon className="w-5 h-5 text-lime" />
                </div>
                <span className="font-space font-semibold text-text-primary">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={onApplyClick}
            className="btn-primary w-full justify-center mt-6 md:mt-8 py-3 md:py-5 text-sm uppercase tracking-widest font-bold"
          >
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Careers;
