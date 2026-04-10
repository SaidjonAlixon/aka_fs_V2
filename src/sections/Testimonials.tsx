import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "AKA FS hits our delivery windows. Every time.",
      author: "Logistics Manager",
      company: "Retail Brand",
    },
    {
      quote: "Their updates are instant. No chasing.",
      author: "Operations Lead",
      company: "Food Distributor",
    },
    {
      quote: "Professional drivers, clean trucks, clear communication.",
      author: "Supply Chain Director",
      company: "Manufacturer",
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards reveal with stagger
      const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background py-20 lg:py-32 px-6 lg:px-[7vw]"
    >
      <div ref={headerRef} className="mb-12 lg:mb-16">
        <h2 className="headline-section text-text-primary mb-4">
          What Partners Say
        </h2>
        <p className="body-text max-w-[40ch]">
          Consistent, transparent, and easy to work with.
        </p>
      </div>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card glass-card p-8 hover:border-lime/30 transition-all duration-300"
          >
            <Quote className="w-8 h-8 text-lime-dark dark:text-lime mb-6" />
            <p className="font-space text-lg text-text-primary leading-relaxed mb-6">
              "{testimonial.quote}"
            </p>
            <div className="border-t border-foreground/10 pt-4">
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime-dark dark:text-lime block mb-6 px-1">What Clients Say</span>
              <div className="font-space font-semibold text-text-primary text-sm">
                {testimonial.author}
              </div>
              <div className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                {testimonial.company}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
