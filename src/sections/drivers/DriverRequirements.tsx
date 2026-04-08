import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileBadge, ShieldAlert, Search, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DriverRequirements = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const requirements = [
    {
      icon: FileBadge,
      title: 'Valid CDL License',
      desc: 'Minimum 2 years driving experience required for all applicants.'
    },
    {
      icon: ShieldAlert,
      title: 'Clean Driving Record',
      desc: 'No major violations or preventable accidents in the last 3 years.'
    },
    {
      icon: Search,
      title: 'Background Check',
      desc: 'Must pass comprehensive safety and employment verification process.'
    },
    {
      icon: Activity,
      title: 'Medical Certification',
      desc: 'Valid DOT medical card required and must be maintained.'
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.requirement-card', 
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          stagger: 0.15, 
          duration: 0.8, 
          ease: 'power2.out',
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
      className="relative py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter leading-none mb-6">
            QUALIFICATION <br />
            <span className="text-lime text-outline-lime">STANDARDS</span>
          </h2>
          <div className="w-24 h-1 bg-lime mx-auto mb-8" />
          <p className="text-text-secondary text-lg md:text-2xl max-w-2xl mx-auto uppercase tracking-widest font-black opacity-80 transition-opacity">
            High standards for high performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
          {requirements.map((req, idx) => (
            <div key={idx} className="requirement-card group">
              <div className="glass-card p-8 md:p-12 border-foreground/10 group-hover:bg-lime/5 group-hover:border-lime/20 transition-all duration-500 flex flex-col sm:flex-row items-start gap-8">
                <div className="p-6 bg-secondary border border-foreground/10 text-lime group-hover:scale-110 group-hover:bg-lime group-hover:text-navy transition-all duration-500">
                  <req.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4 group-hover:text-lime transition-colors">
                    {req.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed font-black">
                    {req.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-foreground/40 text-sm font-black uppercase tracking-[0.4em]">
                All drivers must meet these minimum criteria to be considered.
            </p>
        </div>
      </div>
    </section>
  );
};

export default DriverRequirements;
