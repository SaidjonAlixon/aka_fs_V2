import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  className?: string;
  onApplyClick?: () => void;
}

const Hero = ({ className = '', onApplyClick }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Element refs
  const initialRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);

  const images = useRef<HTMLImageElement[]>([]);
  const seq = { frame: 0 };
  const frameCount = 180;
  
  // Preload function
  const currentFrame = (index: number) => `/home1/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // 1. Preload images
    if (images.current.length === 0) {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.current.push(img);
      }
    }

    const ctx = gsap.context(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      // Render function
      const render = () => {
        // Force the frame to map to an integer for correct image array lookup
        const frameIndex = Math.min(Math.max(0, Math.floor(seq.frame)), frameCount - 1);
        const img = images.current[frameIndex];
        
        if (img && img.complete && img.naturalWidth > 0) {
          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = img.width / img.height;
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      };

      // Initial render attempt when first image loads
      if (images.current[0]) {
        images.current[0].onload = render;
      }

      // Handle resize
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      // Continuous render loop for maximum smoothness during scroll
      let animationFrameId: number;
      const loop = () => {
        render();
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      // 2. Setup GSAP ScrollTrigger timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=4000', // large distance for cinematic feeling
          pin: true,
          scrub: 1, // 1 second smoothing for cinematic feel
        },
      });

      // Frame progression
      scrollTl.to(seq, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        duration: 10 // timeline total relative duration
      }, 0);

      // Map out animations along the 10 duration blocks

      // Block 0-1: Initial elements fade out
      scrollTl.to(initialRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.5);

      // Block 2-4: Phase 1 entering and leaving
      scrollTl.fromTo(p1Ref.current, 
        { autoAlpha: 0, x: 50 },
        { autoAlpha: 1, x: 0, duration: 1, ease: 'power2.out' }, 
        2
      );
      scrollTl.to(p1Ref.current, 
        { autoAlpha: 0, y: -30, duration: 1, ease: 'power2.in' }, 
        4
      );

      // Block 5-7: Phase 2 entering and leaving
      scrollTl.fromTo(p2Ref.current, 
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 1, ease: 'power2.out' }, 
        5
      );
      scrollTl.to(p2Ref.current, 
        { autoAlpha: 0, scale: 0.95, duration: 1, ease: 'power2.in' }, 
        7
      );

      // Block 8-10: Phase 3 entering
      scrollTl.fromTo(p3Ref.current, 
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' }, 
        8
      );

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className={`relative w-full h-screen bg-black overflow-hidden ${className}`}>
      
      {/* Background Canvas */}
      <div className="absolute inset-0 w-full h-full will-change-transform">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
        <div className="absolute inset-0 bg-black/40" /> {/* Slight dark overlay */}
      </div>

      {/* --- INITIAL HERO CONTENT --- */}
      <div 
        ref={initialRef} 
        className="absolute inset-x-6 md:inset-x-auto md:left-[7vw] top-[15vh] md:top-[20vh] md:w-[46vw] max-w-[700px] z-10 will-change-transform"
      >
        <span className="eyebrow block mb-6 text-lime uppercase tracking-widest text-sm font-semibold">
          AKA FS LLC
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
          FREIGHT <br /> THAT NEVER <br /> STOPS MOVING
        </h1>
        <h2 className="text-white font-bold text-lg md:text-xl mb-4 tracking-wide">
          POWERING YOUR FREIGHT. DELIVERING RESULTS.
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
          Run strong with reliable power-only loads and consistent miles. <br className="hidden md:block"/>
          24/7 dispatch. No-touch freight. Real support.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onApplyClick}
            className="px-8 py-4 bg-lime text-black font-bold tracking-widest text-sm hover:bg-white transition-all uppercase rounded-sm shadow-[0_0_30px_rgba(184,255,44,0.3)]"
          >
            Apply Now
          </button>
          <a href="#services" className="px-8 py-4 bg-transparent text-white border border-white/20 font-bold tracking-widest text-sm hover:bg-white/10 transition-colors uppercase rounded-sm">
            Explore Services
          </a>
        </div>
      </div>

      {/* --- PHASE 1 --- */}
      <div 
        ref={p1Ref} 
        className="absolute inset-x-6 md:inset-x-auto md:right-[8vw] top-[20vh] md:top-[25vh] md:w-[35vw] max-w-[500px] text-right z-20 invisible flex flex-col items-end will-change-transform"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-lime/30 bg-black/60 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(182,255,0,0.15)] text-lime eyebrow">
          <Cpu className="w-5 h-5" />
          Smart dispatch. Maximum Efficiency.
        </div>
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-4 uppercase tracking-wider leading-tight">
          Intelligent <br /> Routing
        </h2>
        <p className="text-gray-200 text-lg max-w-[400px]">
          We use advanced dispatch strategies and real-time tracking to reduce empty miles, increase profits, and keep your trucks moving without delays.
        </p>
      </div>

      {/* --- PHASE 2 --- */}
      <div 
        ref={p2Ref} 
        className="absolute inset-x-6 md:inset-x-auto md:left-[8vw] bottom-[10vh] md:bottom-[15vh] md:w-[45vw] max-w-[650px] z-20 invisible will-change-transform"
      >
        <div className="bg-navy/80 backdrop-blur-lg p-6 md:p-10 border-l-4 border-l-lime flex flex-col sm:flex-row items-start gap-4 md:gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <ShieldCheck className="w-12 h-12 text-lime shrink-0" />
          <div>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 uppercase tracking-wide">
              Built for Reliability.<br />Trusted Every Mile.
            </h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Our experienced team handles complex logistics with precision delivering consistent loads, secure operations, and on-time performance every time.
            </p>
          </div>
        </div>
      </div>

      {/* --- PHASE 3 --- */}
      <div 
        ref={p3Ref} 
        className="absolute inset-0 flex flex-col items-center justify-center z-30 invisible will-change-transform"
      >
        <div className="flex flex-col items-center bg-black/50 backdrop-blur-md p-12 md:p-16 rounded-3xl border border-white/10 pointer-events-auto">
          <Zap className="w-24 h-24 text-lime mb-8 drop-shadow-[0_0_30px_rgba(182,255,0,0.8)]" />
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white text-center uppercase tracking-tighter drop-shadow-2xl leading-[0.9]">
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-emerald-400">
              FREIGHT
            </span>
          </h2>
          <div className="mt-12">
            <button 
              onClick={onApplyClick}
              className="px-10 py-5 bg-lime text-black text-lg font-bold tracking-widest hover:bg-white transition-all uppercase rounded-sm shadow-[0_0_30px_rgba(182,255,0,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
