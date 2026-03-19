import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Supply Chain Director, RetailCo',
    quote: 'AKA FS has been a game-changer. Our on-time rate jumped to 99% and we\'ve never had better visibility into our freight.',
    rating: 5,
    accent: 'from-lime/20 to-lime/5',
  },
  {
    name: 'Sarah K.',
    role: 'Operations Manager, FoodGroup',
    quote: 'Their reefer division is exceptional. Sensitive temperature loads delivered perfectly every single time.',
    rating: 5,
    accent: 'from-blue-500/20 to-blue-500/5',
  },
  {
    name: 'James R.',
    role: 'Logistics VP, ManuCorp',
    quote: 'From quoting to delivery, AKA FS is the most professional carrier we\'ve worked with in 20 years of logistics.',
    rating: 5,
    accent: 'from-purple-500/20 to-purple-500/5',
  },
  {
    name: 'Linda W.',
    role: 'Director of Logistics, AgriCo',
    quote: 'Incredible service. They handle our seasonal loads without a single delay. Truly a reliable partner.',
    rating: 5,
    accent: 'from-orange-400/20 to-orange-400/5',
  },
  {
    name: 'Carlos M.',
    role: 'CEO, FastMedical Supply',
    quote: 'The real-time tracking and communication is unmatched. We run a tight operation and AKA FS keeps up every time.',
    rating: 5,
    accent: 'from-cyan-400/20 to-cyan-400/5',
  },
];

// Duplicate for seamless loop
const allCards = [...testimonials, ...testimonials];

const TestimonialsHome = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);


  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track1 = track1Ref.current;
    if (!section || !track1) return;

    // Infinite horizontal scroll — row 1 goes left, row 2 goes right
    const tween1 = gsap.to(track1, {
      x: '-50%',
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    // Pause on hover
    const cards = section.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => { tween1.pause(); });
      card.addEventListener('mouseleave', () => { tween1.resume(); });
    });

    // Scroll entrance for headline
    gsap.fromTo(
      section.querySelector('.t-headline'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      }
    );

    return () => {
      tween1.kill();
    };
  }, []);

  const Card = ({ t, floatDelay = 0 }: { t: typeof testimonials[0]; floatDelay?: number }) => (
    <div
      className="testimonial-card flex-shrink-0 w-80 md:w-[400px] mx-4 relative group cursor-default"
      style={{ animation: `floatCard ${3 + (floatDelay % 2)}s ease-in-out infinite alternate`, animationDelay: `${floatDelay * 0.4}s` }}
    >
      <div className={`relative p-8 border border-white/5 group-hover:border-lime/30 bg-gradient-to-br ${t.accent} backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden`}>
        {/* Rotating decoration circle */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/5 opacity-30 group-hover:opacity-70 transition-opacity"
          style={{ animation: 'spinSlow 10s linear infinite' }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-lime/10"
          style={{ animation: 'spinSlow 7s linear infinite reverse' }}
        />

        <Quote className="w-10 h-10 text-lime/10 absolute top-4 right-4 group-hover:text-lime/30 transition-colors" />

        <div className="flex gap-1 mb-6">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-lime fill-lime" />
          ))}
        </div>

        <p className="text-gray-200 text-base leading-relaxed mb-8 font-space">"{t.quote}"</p>

        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full font-space font-black text-navy text-xl bg-lime flex-shrink-0"
          >
            {t.name[0]}
          </div>
          <div>
            <div className="font-space font-black text-white uppercase tracking-tight text-sm">{t.name}</div>
            <div className="text-lime/60 text-[10px] font-mono uppercase tracking-widest">{t.role}</div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-lime group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-navy overflow-hidden">
      <style>{`
        @keyframes floatCard {
          0% { transform: translateY(0px) rotate(-0.5deg); }
          100% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-lime/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 mb-20">
        <div className="t-headline text-center">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime block mb-6">Client Voices</span>
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            WHAT THEY <span className="text-lime">SAY</span>
          </h2>
        </div>
      </div>

      {/* Row 1 — scrolling left */}
      <div className="overflow-hidden mb-8">
        <div ref={track1Ref} className="flex" style={{ width: 'max-content', x: '0%' } as React.CSSProperties}>
          {allCards.map((t, idx) => (
            <Card key={`r1-${idx}`} t={t} floatDelay={idx} />
          ))}
        </div>
      </div>


    </section>
  );
};

export default TestimonialsHome;
