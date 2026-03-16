import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DriverLife = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    { title: 'Modern Fleet', img: '/images/Modern Fleet.jpeg', desc: 'Late-model Kenworth & Peterbilt trucks.' },
    { title: 'Team Culture', img: '/images/Team Culture.jpeg', desc: 'A community of professionals.' },
    { title: 'Expert Service', img: '/images/Expert Service.jpeg', desc: 'In-house maintenance protocols.' },
    { title: 'Global Reach', img: '/images/Global Reach.jpeg', desc: 'Routes covering the entire US & Canada.' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = scrollContainerRef.current?.querySelectorAll('.gallery-item');
      if (items) {
        gsap.fromTo(items, 
          { x: 100, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            stagger: 0.2, 
            duration: 1, 
            ease: 'power2.out',
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
      className="relative py-24 md:py-32 bg-navy overflow-hidden"
    >
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-baseline gap-4">
          <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
            LIFE ON <span className="text-lime">THE ROAD</span>
          </h2>
          <span className="text-lime/60 font-black tracking-[0.5em] uppercase text-xs">
            Experience AKA FS
          </span>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-12 px-6 no-scrollbar gap-6 md:gap-10"
      >
        {galleryItems.map((item, idx) => (
          <div 
            key={idx} 
            className="gallery-item flex-none w-[300px] md:w-[500px] h-[400px] md:h-[600px] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-navy z-0" />
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
            
            {/* Context */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-lime font-black tracking-[1em] uppercase text-[10px] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">
                Featured
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                {item.desc}
              </p>
            </div>

            {/* Side Slash */}
            <div className="absolute top-0 right-0 h-full w-12 bg-lime/10 skew-x-[-15deg] translate-x-12 group-hover:translate-x-6 transition-transform duration-700" />
          </div>
        ))}
      </div>

      {/* Decorative text background */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none overflow-hidden opacity-[0.02]">
        <p className="text-[20vw] font-black text-white whitespace-nowrap leading-none transform translate-y-1/2">
            PREMIER CARRIER LOGISTICS TRANSPORT
        </p>
      </div>
    </section>
  );
};

export default DriverLife;
