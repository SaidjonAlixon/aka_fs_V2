import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Zap, Users, HeartHandshake, DollarSign, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhyUsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const reasons = [
    { icon: CheckCircle, title: 'Guaranteed On-Time', desc: '99.2% on-time delivery backed by real-time tracking and proactive communication.' },
    { icon: Zap, title: 'Instant Quoting', desc: 'Get capacity and quotes within minutes — not hours. We move at the speed of business.' },
    { icon: Users, title: 'Dedicated Team', desc: 'A single point of contact who knows your freight, your lanes, and your expectations.' },
    { icon: HeartHandshake, title: 'Partnership Mindset', desc: "We treat every shipment like it's our own cargo. Your success is our success." },
    { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees. No surprises. Just clear, competitive rates you can plan around.' },
    { icon: Lock, title: 'Cargo Security', desc: 'GPS-tracked, fully insured freight with real-time alerts for peace of mind.' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-navy overflow-hidden">
      {/* Diagonal accent */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-bl from-lime/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-4 md:mb-6">Why AKA FS</span>
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            WHY <span className="text-lime">CHOOSE</span> US?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="why-card group flex flex-col sm:flex-row gap-6 p-6 md:p-8 border border-white/5 hover:border-lime/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-full w-0 bg-lime/5 group-hover:w-full transition-all duration-700" />
              
              <div className="relative z-10 flex-shrink-0">
                <div className="p-4 bg-lime/10 rounded-sm group-hover:bg-lime/20 transition-colors">
                  <reason.icon className="w-7 h-7 text-lime" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-space font-black text-xl text-white uppercase tracking-tight mb-3 group-hover:text-lime transition-colors">
                  {reason.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
