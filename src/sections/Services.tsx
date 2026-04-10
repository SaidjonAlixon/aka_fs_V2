import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, Package, Zap, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  className?: string;
  onApplyClick?: () => void;
}

const Services = ({ className = '', onApplyClick }: ServicesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const serviceListRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: Package,
      title: 'No touch freight',
      description: '',
    },
    {
      icon: Truck,
      title: 'Preloaded trailers',
      description: '',
    },
    {
      icon: Zap,
      title: 'Fast pick & drop',
      description: '',
    },
    {
      icon: Activity,
      title: 'Fast Operations',
      description: '',
    },
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

      // ENTRANCE - More aggressive reveal for ONE TEAM
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-15vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
        0
      );

      // Sequential line reveal
      const lines = headlineRef.current?.querySelectorAll('.headline-line');
      if (lines) {
        scrollTl.fromTo(
          lines,
          { y: 80, opacity: 0, rotateX: -20 },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0, 
            stagger: 0.4, 
            duration: 0.8, 
            ease: 'back.out(1.2)' 
          },
          0.1
        );
      }

      scrollTl.fromTo(
        '.description-text',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.8
      );

      scrollTl.fromTo(
        [slashNavyRef.current, slashLimeRef.current],
        { x: '-100%', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' },
        0
      );

      const serviceItems = serviceListRef.current?.querySelectorAll('.service-item');
      if (serviceItems) {
        scrollTl.fromTo(
          serviceItems,
          { x: '30vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, stagger: 0.1, scale: 1, ease: 'power2.out' },
          0.1
        );
      }

      // EXIT
      scrollTl.to(
        [headlineRef.current, slashNavyRef.current, slashLimeRef.current],
        { x: '-20vw', opacity: 0, ease: 'power2.in', duration: 0.3 },
        0.75
      );

      if (serviceItems) {
        scrollTl.to(
          serviceItems,
          { x: '20vw', opacity: 0, stagger: 0.05, ease: 'power2.in', duration: 0.3 },
          0.75
        );
      }

      // Scroll Dot Animation
      gsap.to('.scroll-dot', {
        y: 12,
        opacity: 0,
        repeat: -1,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative w-full h-screen overflow-hidden bg-background ${className}`}
    >
      {/* Dynamic Background Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Abstract Glows */}
        <div 
          className="absolute top-[20%] right-[-5%] w-[60vw] h-[60vw] opacity-30 will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(184,255,44,0.15) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] opacity-20 will-change-transform"
          style={{
            background: 'radial-gradient(circle, #0f172a 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(184,255,44,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(184,255,44,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      {/* Slash bars (left side) */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[15vw] bg-background/50 backdrop-blur-3xl skew-x-[-15deg] origin-top border-r border-foreground/5 z-0"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[8vw] top-0 h-full w-[2px] bg-lime/30 skew-x-[-15deg] origin-top z-10"
      />

      {/* Content */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[15vw] top-[15vh] md:top-[20vh] md:w-[45vw] lg:w-[40vw] max-w-[800px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-foreground mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            <div className="headline-line block pr-4">
              POWER ONLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-emerald-400">SOLUTIONS.</span>
            </div>
            <div className="headline-line block">
              BUILT FOR SPEED
            </div>
          </h2>
          <p className="description-text text-text-secondary text-lg md:text-2xl leading-relaxed max-w-xl opacity-0 font-medium">
            Maximizing efficiency with our dedicated power-only freight network. 
            We focus on velocity, reliability, and the success of every mile.
          </p>
        </div>
      </div>

      {/* Service list */}
      <div
        ref={serviceListRef}
        className="absolute inset-x-6 md:inset-x-auto md:right-[5vw] bottom-[8vh] md:top-[25vh] md:w-[35vw] max-w-[500px] space-y-4 md:space-y-6 z-20"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="service-item glass-card p-4 md:p-6 border-foreground/10 hover:border-lime/30 hover:bg-lime/5 group transition-all duration-500 will-change-transform"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 bg-secondary border border-foreground/10 group-hover:bg-lime group-hover:text-navy group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="font-space font-black text-lg md:text-xl text-foreground uppercase tracking-wider mb-0.5">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={onApplyClick}
          className="btn-primary mt-4 md:mt-8"
        >
          Apply Now
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 z-30">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-foreground to-transparent" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center p-1.5 overflow-hidden">
            <div className="scroll-dot w-1.5 h-1.5 bg-lime rounded-full" />
          </div>
          <span className="text-[10px] text-foreground uppercase tracking-[0.4em] font-black">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Services;
