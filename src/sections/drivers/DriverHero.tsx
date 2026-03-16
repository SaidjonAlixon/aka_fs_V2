import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Heart, PiggyBank, Calendar, Truck, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DriverHeroProps {
  onApplyClick?: () => void;
}

const DriverHero = ({ onApplyClick }: DriverHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const benefits = [
    { icon: DollarSign, text: 'Competitive Pay + Weekly Bonuses' },
    { icon: Heart, text: 'Health + Dental Insurance' },
    { icon: PiggyBank, text: '401k Retirement Plan' },
    { icon: Calendar, text: 'Paid Time Off' },
    { icon: Truck, text: 'New Equipment Fleet' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entrance animation
      tl.fromTo('.hero-bg', 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
      )
      .fromTo(contentRef.current, 
        { x: -50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=1"
      )
      .fromTo([slashNavyRef.current, slashLimeRef.current],
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' },
        "-=0.8"
      )
      .fromTo(cardRef.current,
        { x: 50, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        "-=0.8"
      );

      // Scroll revealparallax
      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 150,
        ease: 'none'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-navy flex items-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/careers_driver_cab.jpg" // Using existing image for now, user prompt mentions sunset truck
          alt="Driver recruitment"
          className="hero-bg w-full h-full object-cover opacity-60 grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
      </div>

      {/* Futuristic Accents */}
      <div
        ref={slashNavyRef}
        className="absolute left-[-5vw] top-0 h-full w-[15vw] bg-navy/80 skew-x-[-15deg] origin-top z-10 border-r border-white/5"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[8vw] top-0 h-full w-[4vw] bg-lime skew-x-[-15deg] origin-top z-10 shadow-[0_0_40px_rgba(184,255,44,0.2)]"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div ref={contentRef} className="max-w-2xl pt-20 lg:pt-0">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
            DRIVE YOUR <br />
            <span className="text-lime">FUTURE</span> WITH <br />
            AKA FS
          </h1>
          <p className="text-xl md:text-2xl font-bold text-white/90 mb-4 font-space">
            Join a team that values safety, professionalism, and top performance.
          </p>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            At AKA FS Logistics we believe our drivers are the backbone of our success.
            We provide competitive pay, modern trucks, reliable dispatch and a respectful work environment.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onApplyClick}
              className="px-8 py-4 bg-lime text-navy font-black text-lg uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(184,255,44,0.3)]"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              Apply Now
            </button>
            <button 
              onClick={() => document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-lg uppercase tracking-wider hover:bg-white/20 transition-all duration-300"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              Benefits
            </button>
          </div>
        </div>

        {/* Right Card */}
        <div ref={cardRef} className="hidden lg:block">
          <div className="glass-card p-10 border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-lime/20 transition-all duration-500" />
            
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="w-8 h-1 bg-lime"></span>
              DRIVER BENEFITS
            </h2>

            <div className="space-y-6 mb-10">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 group/item">
                  <div className="p-3 bg-navy border border-white/10 text-lime group-hover/item:bg-lime group-hover/item:text-navy transition-all duration-300">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-gray-200 group-hover/item:text-white transition-colors">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={onApplyClick}
              className="w-full group/btn relative flex items-center justify-center gap-3 px-8 py-5 bg-navy border border-lime text-lime font-black text-lg uppercase tracking-widest hover:bg-lime hover:text-navy transition-all duration-500 overflow-hidden"
            >
              <span>Start Application</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
        <span className="text-[10px] text-white uppercase tracking-[0.5em] font-black">Scroll</span>
      </div>
    </section>
  );
};

export default DriverHero;
