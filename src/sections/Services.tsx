import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, Thermometer, Container } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  className?: string;
}

const Services = ({ className = '' }: ServicesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const serviceListRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: Truck,
      title: 'Dry Van',
      description: 'Secure, tracked, on-time.',
    },
    {
      icon: Thermometer,
      title: 'Reefer',
      description: 'Temp-controlled, compliant.',
    },
    {
      icon: Container,
      title: 'Flatbed',
      description: 'Oversized, permitted, safe.',
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative w-full h-screen overflow-hidden bg-navy ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/services_warehouse.jpg"
          alt="Warehouse interior"
          className="bg-full opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/40 to-transparent" />
      </div>

      {/* Slash bars (left side) - repositioned to avoid overlap */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[12vw] bg-navy/90 skew-x-[-12deg] origin-top border-r border-white/5 z-0"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[5vw] top-0 h-full w-[4vw] bg-lime skew-x-[-12deg] origin-top z-10"
      />

      {/* Content - repositioned further right */}
      <div className="absolute inset-x-6 md:inset-x-auto md:left-[18vw] top-[15vh] md:top-[20vh] md:w-[35vw] max-w-[600px] z-20">
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-[0.85]">
            ONE <span className="text-lime">TEAM.</span><br />
            THREE LANES.
          </h2>
          <p className="text-gray-300 text-lg md:text-2xl leading-relaxed max-w-md">
            Dry van, temperature-controlled, and flatbed—built for schedules that don't bend.
          </p>
        </div>
      </div>

      {/* Service list */}
      <div
        ref={serviceListRef}
        className="absolute inset-x-6 md:inset-x-auto md:right-[8vw] bottom-[8vh] md:top-[25vh] md:w-[35vw] max-w-[500px] space-y-4 md:space-y-8 z-20"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="service-item glass-card p-4 md:p-8 hover:border-lime/40 transition-all duration-300 will-change-transform"
          >
            <div className="flex items-center md:items-start gap-4 md:gap-6">
              <div className="p-3 md:p-4 bg-lime/10 rounded-sm">
                <service.icon className="w-6 h-6 md:w-8 md:h-8 text-lime" />
              </div>
              <div>
                <h3 className="font-space font-black text-lg md:text-2xl text-text-primary uppercase tracking-wide mb-1 md:mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed">{service.description}</p>
              </div>
            </div>
          </div>
        ))}

        <a href="#contact" className="btn-primary inline-flex mt-4 md:mt-8 py-3 md:py-5 px-6 md:px-10 text-xs md:text-base uppercase tracking-widest font-bold">
          See All Capabilities
        </a>
      </div>
    </section>
  );
};

export default Services;
