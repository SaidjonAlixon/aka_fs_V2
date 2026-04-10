import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HomeCTAProps {
  onApplyClick?: () => void;
}

const HomeCTA = ({ onApplyClick }: HomeCTAProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 bg-background overflow-hidden">
      {/* Lime glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lime/5 blur-[120px] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />

      {/* Diagonal lines decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-lime/10 to-transparent"
            style={{ left: `${20 + i * 15}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <div ref={contentRef}>
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-8">Ready to Ship?</span>
          <h2 className="text-4xl md:text-7xl lg:text-[10rem] font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-8 md:mb-10">
            LET'S <span className="text-lime">MOVE</span><br />YOUR FREIGHT.
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 md:mb-16 font-bold">
            Get a quote in minutes. Our team is standing by 24/7 to handle your freight needs with precision and professionalism.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onApplyClick}
              className="group relative inline-flex items-center gap-4 bg-lime text-[#0A0F1A] font-black text-base md:text-lg uppercase tracking-[0.15em] px-8 md:px-14 py-5 md:py-7 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(184,255,44,0.4)]"
              style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)', backgroundImage: 'linear-gradient(165deg, #B8FF2C 0%, #a2e61a 100%)' }}
            >
              <span className="relative z-10">Apply Now</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <a
                href="tel:+14122353377"
                className="flex items-center gap-3 text-foreground hover:text-lime transition-colors group"
              >
                <div className="p-3 border border-foreground/10 group-hover:border-lime/50 transition-colors bg-secondary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-lime/60">Call Us</div>
                  <div className="font-space font-bold uppercase">+1 (412) 235-3377</div>
                </div>
              </a>

              <a
                href="mailto:info@akafsllc.com"
                className="flex items-center gap-3 text-foreground hover:text-lime transition-colors group"
              >
                <div className="p-3 border border-foreground/10 group-hover:border-lime/50 transition-colors bg-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-lime/60">Email Us</div>
                  <div className="font-space font-bold uppercase">info@akafsllc.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
