import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardCheck, Search, PhoneCall, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface JoinProcessProps {
  onApplyClick?: () => void;
}

const JoinProcess = ({ onApplyClick }: JoinProcessProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: '01',
      icon: ClipboardCheck,
      title: 'Submit Application',
      desc: 'Fill out the online driver form with your basic information and experience.'
    },
    {
      number: '02',
      icon: Search,
      title: 'Quick Review',
      desc: 'Our recruitment team reviews your documents and safety record.'
    },
    {
      number: '03',
      icon: PhoneCall,
      title: 'Interview Call',
      desc: 'We will contact you within 24 hours for a brief interview and discussion.'
    },
    {
      number: '04',
      icon: Check,
      title: 'Start Driving',
      desc: 'Welcome to the team! Finish orientation and hit the road with AKA FS.'
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll('.step-item');
      if (items) {
        items.forEach((item, idx) => {
          gsap.fromTo(item, 
            { x: idx % 2 === 0 ? -50 : 50, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 1, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
              }
            }
          );
        });

        // Line animation
        gsap.fromTo('.timeline-line',
            { scaleY: 0 },
            { 
                scaleY: 1, 
                duration: 2, 
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top 70%',
                    end: 'bottom 20%',
                    scrub: true
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
      className="relative py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 md:mb-32">
          <span className="text-lime font-black tracking-[0.5em] uppercase text-xs mb-4 block">
            The Journey
          </span>
          <h2 className="text-4xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-none">
            HOW TO <span className="text-lime text-outline-foreground">JOIN</span> AKA FS
          </h2>
        </div>

        <div 
          ref={timelineRef}
          className="relative max-w-5xl mx-auto"
        >
          {/* Central Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-foreground/10 -translate-x-1/2 z-0">
            <div className="timeline-line w-full h-full bg-lime origin-top transform-gpu" />
          </div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`step-item relative flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Visual marker */}
                <div className="absolute left-[20px] md:left-1/2 top-0 -translate-x-1/2 w-4 h-4 bg-background border-4 border-lime z-10 rounded-full" />

                <div className={`w-full md:w-1/2 flex ${idx % 2 === 1 ? 'md:justify-start' : 'md:justify-end'} pl-16 md:pl-0`}>
                  <div className="glass-card p-8 md:p-10 border-foreground/10 bg-secondary/20 hover:bg-secondary/40 transition-all duration-500 max-w-md group">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-4xl md:text-6xl font-black text-foreground/10 group-hover:text-lime/20 transition-colors tracking-tighter">
                        {step.number}
                      </div>
                      <div className="p-4 bg-secondary border border-foreground/10 text-lime group-hover:bg-lime group-hover:text-navy transition-all duration-500">
                        <step.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4 group-hover:text-lime transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary font-black leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
                
                {/* Spacer for MD screens */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center">
            <button 
                onClick={onApplyClick}
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-lime text-navy font-black text-xl uppercase tracking-[0.2em] transform transition-all duration-500 overflow-hidden shadow-[0_0_50px_rgba(184,255,44,0.3)] hover:scale-105"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
            >
                <span className="relative z-10 transition-transform group-hover:scale-110">Apply To Become A Driver</span>
                <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default JoinProcess;
