import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, PackageX, Zap, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesPreviewProps {
  onApplyClick?: () => void;
}

const ServicesPreview = ({ onApplyClick }: ServicesPreviewProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: PackageX,
      title: 'No Touch Freight',
      desc: 'Keep moving and earning. Never worry about loading or unloading the cargo yourself.',
      badge: 'Driver First',
    },
    {
      icon: Truck,
      title: 'Preloaded Trailers',
      desc: 'Hook up and go. Our preloaded trailers save you hours of wait time at the dock.',
      badge: 'Efficient',
    },
    {
      icon: Zap,
      title: 'Fast Pick & Drop',
      desc: 'Streamlined facility operations engineered to minimize your dwell time.',
      badge: 'High RPM',
    },
    {
      icon: Clock,
      title: 'Fast Operations',
      desc: '24/7 dispatch and support dedicated to resolving issues instantly and keeping you rolling.',
      badge: 'Support',
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-preview-card',
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.services-headline',
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-lime to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="services-headline">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-4 md:mb-6">What We Move</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.95]">
              POWER ONLY <br />
              <span className="text-lime">SOLUTIONS.</span><br />
              BUILT FOR SPEED.
            </h2>
          </div>
          <p className="text-text-secondary text-base md:text-lg max-w-sm leading-relaxed font-bold">
            Preloaded trailers, no touch freight, and high RPM loads built for drivers who want consistency, speed, and real support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              onClick={onApplyClick}
              className="service-preview-card group relative p-6 md:p-8 bg-secondary border border-foreground/10 hover:border-lime/30 transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-4"
            >
              {/* Badge */}
              <div className="absolute top-5 right-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime bg-lime/10 px-2 py-1">
                  {service.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="p-5 bg-lime/10 inline-flex mb-8 group-hover:bg-lime/20 transition-colors rounded-sm">
                <service.icon className="w-10 h-10 text-lime" />
              </div>

              <h3 className="font-space font-black text-3xl text-foreground uppercase mb-4 group-hover:text-lime transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 font-bold">
                {service.desc}
              </p>

              {/* Hover bottom bar */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-lime group-hover:w-full transition-all duration-700" />

              <span className="text-lime text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Apply Now →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
