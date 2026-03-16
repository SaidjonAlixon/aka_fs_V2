import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PositionsProps {
  onApplyClick?: () => void;
}

const DriverPositions = ({ onApplyClick }: PositionsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const positions = [
    {
      title: 'Company Driver',
      features: ['Steady miles', 'Weekly pay', 'Modern equipment', 'Home time options'],
      type: 'Local / Regional',
      btnText: 'View Details'
    },
    {
      title: 'Owner Operator',
      features: ['High percentage pay', 'Freedom to choose loads', 'Fuel discounts', 'Maintenance support'],
      type: 'OTR / Long Haul',
      btnText: 'Apply Now',
      featured: true
    },
    {
      title: 'Dedicated Route Driver',
      features: ['Predictable routes', 'Consistent schedule', 'Stable income', 'Regional deliveries'],
      type: 'Dedicated',
      btnText: 'Learn More'
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.position-card');
      if (cards) {
        gsap.fromTo(cards, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.2, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-navy border-t border-white/5"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-lime font-black tracking-[0.2em] uppercase text-sm mb-4 block">
              Opportunities
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              DRIVER <span className="text-lime text-outline-lime">POSITIONS</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg md:text-xl max-w-sm mb-2">
            Explore the best career path that fits your lifestyle and goals.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {positions.map((pos, idx) => (
            <div 
              key={idx} 
              className={`position-card group h-full ${pos.featured ? 'lg:-translate-y-4' : ''}`}
            >
              <div className={`relative h-full glass-card p-10 border-white/10 ${pos.featured ? 'bg-navy-light/40 border-lime/30' : ''} group-hover:bg-navy-light/60 transition-all duration-500 flex flex-col`}>
                {pos.featured && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-lime text-navy font-black text-xs uppercase tracking-widest">
                    Hot Job
                  </div>
                )}

                <div className="mb-8">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-2 transition-colors group-hover:text-lime">
                    {pos.type}
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                    {pos.title}
                  </h3>
                </div>

                <div className="space-y-4 mb-12 flex-grow">
                  {pos.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-lime opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-gray-300 font-bold group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onApplyClick}
                  className={`w-full group/btn relative flex items-center justify-between px-6 py-5 border ${pos.featured ? 'bg-lime text-navy border-lime' : 'border-white/20 text-white hover:border-lime hover:text-lime'} font-black text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden`}
                >
                  <span className="relative z-10 transition-transform group-hover/btn:translate-x-1">{pos.btnText}</span>
                  <ArrowUpRight className="w-5 h-5 relative z-10 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                  
                  {!pos.featured && (
                    <div className="absolute inset-0 bg-lime translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  )}
                  {!pos.featured && (
                    <div className="absolute inset-0 flex items-center justify-between px-6 py-5 text-navy font-black opacity-0 group-hover/btn:opacity-100 transition-opacity">
                      <span>{pos.btnText}</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DriverPositions;
