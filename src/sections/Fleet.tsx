import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Wrench, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Fleet = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const totalFrames = 180;
  
  const seq = useRef({ frame: 0 });

  // Refs for UI elements
  const headlineRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const slashNavyRef = useRef<HTMLDivElement>(null);
  const slashLimeRef = useRef<HTMLDivElement>(null);

  const fleetStats = [
    { icon: Calendar, label: 'AVG AGE', value: 'Under 3 years' },
    { icon: Wrench, label: 'MAINTENANCE', value: 'Scheduled intervals' },
    { icon: Phone, label: 'SUPPORT', value: 'Roadside + recovery' },
  ];

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        img.src = `/fleet1/ezgif-frame-${frameNum}.jpg`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalFrames) {
                setImagesLoaded(true);
            }
        };
        images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || imagesRef.current.length === 0) return;

    const frameIndex = Math.floor(seq.current.frame);
    const img = imagesRef.current[frameIndex] || imagesRef.current[0];

    if (img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  useLayoutEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (canvas) {
        contextRef.current = canvas.getContext('2d');
        render();
    }

    const section = sectionRef.current;
    if (section) {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=6000', // Slow, cinematic speed
                    pin: true,
                    scrub: 1.5, // Heavier feel
                    onUpdate: () => {
                        requestAnimationFrame(render);
                    }
                }
            });

            tl.to(seq.current, {
                frame: totalFrames - 1,
                ease: 'none',
                duration: 1
            }, 0);

            tl.fromTo(headlineRef.current, 
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.25 }, 
                0.15
            );

            tl.fromTo([slashNavyRef.current, slashLimeRef.current],
                { x: '-100%', opacity: 0 },
                { x: '0%', opacity: 1, stagger: 0.1, duration: 0.3 },
                0.08
            );

            tl.fromTo(infoCardRef.current,
                { x: 120, opacity: 0, scale: 0.95 },
                { x: 0, opacity: 1, scale: 1, duration: 0.35 },
                0.35
            );

            tl.to([headlineRef.current, infoCardRef.current, slashNavyRef.current, slashLimeRef.current], {
                opacity: 0,
                y: -30,
                duration: 0.2
            }, 0.9);

        }, section);

        return () => ctx.revert();
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            render();
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50 pointer-events-none" />

      <div
        ref={slashNavyRef}
        className="absolute left-[-2vw] top-0 h-full w-[15vw] bg-background/80 skew-x-[-15deg] origin-top border-r border-foreground/10 pointer-events-none shadow-2xl"
      />
      <div
        ref={slashLimeRef}
        className="absolute left-[7vw] top-0 h-full w-[5vw] bg-lime skew-x-[-15deg] origin-top pointer-events-none"
      />

      <div className="relative z-10 container mx-auto h-full flex items-center px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 w-full items-center">
          
          <div ref={headlineRef} className="max-w-2xl">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-foreground mb-8 uppercase tracking-tighter leading-[0.85]">
              NEWER <span className="text-lime">TRUCKS.</span><br />
              FEWER DELAYS.
            </h2>
            <p className="text-foreground text-xl md:text-2xl leading-relaxed max-w-lg font-bold">
              Late-model tractors with preventive maintenance, ELD compliance, and 24/7 roadside support.
            </p>
          </div>

          <div className="flex justify-end">
            <div ref={infoCardRef} className="glass-card p-10 lg:p-12 w-full max-w-lg border-lime/20">
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-lime mb-10 block font-bold">
                Fleet Standards
              </span>

              <div className="space-y-8 mb-12">
                {fleetStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-8 group">
                    <div className="p-5 bg-lime/10 rounded-sm border border-lime/20 group-hover:bg-lime/20 transition-colors">
                      <stat.icon className="w-7 h-7 text-lime" />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-secondary mb-2">
                        {stat.label}
                      </div>
                      <div className="font-space font-bold text-2xl text-text-primary">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary w-full py-6 text-base uppercase tracking-widest font-bold group overflow-hidden relative">
                <span className="relative z-10">Meet the Fleet</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Fleet;
