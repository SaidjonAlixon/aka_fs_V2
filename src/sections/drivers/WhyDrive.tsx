import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Truck, ShieldCheck, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhyDrive = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reasons = [
    {
      icon: TrendingUp,
      title: 'High Earnings',
      desc: 'Top industry pay with performance bonuses and stable loads.',
      color: 'lime'
    },
    {
      icon: Truck,
      title: 'Modern Trucks',
      desc: 'Drive late-model trucks equipped with advanced safety technology.',
      color: 'white'
    },
    {
      icon: Headphones,
      title: 'Reliable Dispatch',
      desc: 'Professional dispatch team that respects your time and routes.',
      color: 'lime'
    },
    {
      icon: ShieldCheck,
      title: 'Safety First',
      desc: 'Safety is our priority with continuous support and training.',
      color: 'white'
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.reason-card');
      if (cards) {
        gsap.fromTo(cards, 
          { y: 60, opacity: 0, scale: 0.9 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            stagger: 0.2, 
            duration: 1, 
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      gsap.fromTo('.why-title', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="why-choose"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-lime/5 rounded-full blur-[120px] -mr-[25vw] -mt-[25vw]" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary rounded-full blur-[100px] -ml-[15vw] -mb-[15vw]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 text-center max-w-4xl mx-auto">
          <span className="text-lime-dark dark:text-lime font-black tracking-[0.3em] uppercase text-sm mb-4 block">
            Premium Carrier
          </span>
          <h2 className="why-title text-4xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter leading-none">
            WHY DRIVERS CHOOSE <br className="hidden md:block" />
            <span className="text-outline text-transparent opacity-30">AKA FS</span>
          </h2>
        </div>

        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {reasons.map((reason, idx) => (
            <div 
              key={idx} 
              className="reason-card group relative h-full"
            >
              <div className="glass-card h-full p-8 md:p-10 border-foreground/10 group-hover:border-lime/40 transition-all duration-500 flex flex-col items-start gap-6 overflow-hidden">
                {/* Hover accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-lime/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`p-4 bg-secondary border border-foreground/10 ${reason.color === 'lime' ? 'text-lime-dark dark:text-lime' : 'text-foreground'} group-hover:bg-lime group-hover:text-[#0A0F1A] transition-all duration-500 transform group-hover:rotate-12`}>
                  <reason.icon className="w-8 h-8" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight group-hover:text-lime transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed group-hover:text-foreground transition-colors font-bold">
                    {reason.desc}
                  </p>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-lime transition-all duration-700 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDrive;
