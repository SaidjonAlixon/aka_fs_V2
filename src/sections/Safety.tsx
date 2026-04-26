import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, GraduationCap, Settings } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SafetyProps {
  className?: string;
}

const Safety = ({ className = '' }: SafetyProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const safetyItems = [
    { icon: Shield, label: 'DOT compliant' },
    { icon: GraduationCap, label: 'Regular training' },
    { icon: Settings, label: 'Preventive maintenance' },
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

      entranceTl.fromTo(
        panelRef.current,
        { x: '10vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        0.1
      );

      const items = panelRef.current?.querySelectorAll('.safety-item');
      if (items) {
        entranceTl.fromTo(
          items,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
          0.3
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
        [headlineRef.current, panelRef.current, slashNavyRef.current, slashLimeRef.current],
        { y: -50, opacity: 0, stagger: 0.05, ease: 'power2.in', duration: 0.5 },
        0.5
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="safety"
      className={`relative w-full h-screen overflow-hidden bg-background ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/home_diz/photo_2026-04-26_13-48-14.jpg"
          alt="Safety on snowy road"
          className="bg-full opacity-50 grayscale-[0.2]"
        />
        <div className="bg-overlay" />
      </div>

      {/* Slash bars - repositioned */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[12vw] bg-background/90 skew-x-[-12deg] origin-top border-r border-foreground/10 z-0 shadow-2xl"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[5vw] top-0 h-full w-[4vw] bg-lime skew-x-[-12deg] origin-top z-10"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[15vw] top-[12vh] md:top-[20vh] md:w-[35vw] max-w-[600px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-foreground mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            SAFETY <span className="text-lime-dark dark:text-lime">FIRST.</span><br />
            ALWAYS.
          </h2>
          <p className="text-foreground text-lg md:text-2xl leading-relaxed max-w-md font-bold">
            Hiring standards, continuous training, and maintenance discipline that protect your cargo and our people.
          </p>
        </div>
      </div>

      {/* Stats panel */}
      <div
        ref={panelRef}
        className="absolute inset-x-6 md:inset-x-auto md:left-[54vw] bottom-[10vh] md:top-[18vh] md:w-[38vw] max-w-[550px] will-change-transform"
      >
        <div className="glass-card p-6 md:p-8">
          <span className="eyebrow block mb-8">Safety Program</span>

          <div className="space-y-6">
            {safetyItems.map((item, index) => (
              <div
                key={index}
                className="safety-item flex items-center gap-4 will-change-transform"
              >
                <div className="p-3 bg-lime/10 rounded-sm">
                  <item.icon className="w-5 h-5 text-lime-dark dark:text-lime" />
                </div>
                <span className="font-space font-semibold text-text-primary uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary w-full justify-center mt-6 md:mt-8 py-3 md:py-5 text-sm uppercase tracking-widest font-bold">
            See Safety Program
          </a>
        </div>
      </div>
    </section>
  );
};

export default Safety;
