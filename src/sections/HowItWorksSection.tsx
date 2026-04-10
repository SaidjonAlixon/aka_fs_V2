import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Target, Truck, DollarSign, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Get Set Up',
      desc: 'Sign up with our company and get ready to start receiving PO loads.',
    },
    {
      step: '02',
      icon: Target,
      title: 'We Find Your Load',
      desc: 'We secure high RPM, preloaded trailers with fast pick & drop no waiting, no stress.',
    },
    {
      step: '03',
      icon: Truck,
      title: 'Pick Up & Go',
      desc: 'Hook your trailer and hit the road. All loads are no touch, secured and ready.',
    },
    {
      step: '04',
      icon: DollarSign,
      title: 'Get Paid Weekly',
      desc: 'Get paid quickly with transparent rates and consistent weekly settlements.',
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.step-card',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.step-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-background overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-dark/20 dark:via-lime/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 md:mb-24 px-4">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime-dark dark:text-lime block mb-4 md:mb-6">Simple Process</span>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.85]">
            HOW PO DISPATCH <span className="text-lime-dark dark:text-lime">WORKS</span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl font-black mt-6">
            Simple. Fast. No touch freight. Built for drivers.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-[1px] bg-foreground/10">
            <div className="step-line origin-left absolute inset-0 bg-lime-dark/50 dark:bg-lime/50" />
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="step-card relative flex flex-col items-center text-center px-4 md:px-8 py-8 md:py-10 group">
              {/* Number badge */}
              <div className="relative z-10 mb-8">
                <div className="w-28 h-28 border-2 border-foreground/10 group-hover:border-lime-dark/50 dark:group-hover:border-lime/50 transition-all duration-500 flex flex-col items-center justify-center bg-secondary relative">
                  <step.icon className="w-8 h-8 text-lime-dark dark:text-lime mb-1" />
                  <span className="font-mono text-[10px] text-lime-dark/70 dark:text-lime/60 tracking-widest">{step.step}</span>
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-lime-dark/30 dark:border-lime/30" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-lime-dark/30 dark:border-lime/30" />
                </div>
              </div>

              <h3 className="font-space font-black text-2xl text-foreground uppercase tracking-tight mb-4 group-hover:text-lime-dark dark:group-hover:text-lime transition-colors">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed font-bold">{step.desc}</p>

              {/* Arrow (not last) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-14 z-20 text-lime-dark dark:text-lime">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
