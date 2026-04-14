import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Navigation, MapPin, Activity, Globe, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const phrases = [
  "The Future of",
  "The Power of",
  "Driving Modern",
  "Transforming",
  "Connecting"
];

const liveShipments = [
  { driver: "Amerite Louisjacques", origin: "Lake Buena Vista, FL", destination: "Bartlett, TN", loadBase: "2002507501" },
  { driver: "Artun Yaman", origin: "Virginia Beach, VA", destination: "New Castle, DE", loadBase: "115CKHK7Z" },
  { driver: "Jean Meme", origin: "Richmond, VA", destination: "Ocala, FL", loadBase: "114GQV4ZK" },
  { driver: "Onur Ozcan", origin: "Davenport, IA", destination: "Grand Island, NE", loadBase: "128319205" },
  { driver: "Elbrus Jabbarli", origin: "San Marcos, TX", destination: "San Marcos, TX", loadBase: "34148" },
  { driver: "Emre Cetin", origin: "Aurora, CO", destination: "East Peoria, IL", loadBase: "G067359703" },
  { driver: "Mahmut Arkoc", origin: "Edwardsville, IL", destination: "Moreno Valley, CA", loadBase: "T-116CBTX5Z" },
  { driver: "Timothy Love", origin: "Little Rock, AR", destination: "Jacksonville, FL", loadBase: "0153842" },
  { driver: "Rahmanberdi Yazdurdyyev", origin: "Tomah, WI", destination: "Woodbury, MN", loadBase: "113FN1WXK" },
  { driver: "Begench Mamiyev", origin: "Henderson, NV", destination: "San Bernardino, CA", loadBase: "112YSSDC8" }
];

interface HeroProps {
  className?: string;
  onApplyClick?: () => void;
}

const Hero = ({ className = '', onApplyClick }: HeroProps) => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [activeShipmentIndex, setActiveShipmentIndex] = useState(0);
  const [randomLoadId, setRandomLoadId] = useState("AK-4829-X");
  const [randomETA, setRandomETA] = useState("04:12 PM");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);

    const shipmentInterval = setInterval(() => {
      const nextIndex = (activeShipmentIndex + 1) % liveShipments.length;
      setActiveShipmentIndex(nextIndex);
      
      const base = liveShipments[nextIndex].loadBase;
      const suffix = Math.random().toString(36).substring(7).toUpperCase();
      setRandomLoadId(`AK-${base.substring(0, 4)}-${suffix}`);
      
      const hour = Math.floor(Math.random() * 12) + 1;
      const min = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const period = Math.random() > 0.5 ? 'AM' : 'PM';
      setRandomETA(`${hour}:${min} ${period}`);
    }, 3000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(shipmentInterval);
    };
  }, [activeShipmentIndex]);

  // Handle Mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Abstract Canvas Logistics Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameID: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const paths: { points: { x: number; y: number }[]; progress: number; speed: number; color: string }[] = [];
    const numPaths = 15;

    const createPath = () => {
      const points = [];
      let x = Math.random() * width;
      let y = Math.random() * height;
      const length = 5 + Math.random() * 5;
      
      for (let i = 0; i < length; i++) {
        points.push({ x, y });
        x += (Math.random() - 0.5) * 400;
        y += (Math.random() - 0.5) * 400;
      }
      
      
      return {
        points,
        progress: 0,
        speed: 0.001 + Math.random() * 0.002,
        color: theme === 'dark' 
          ? (Math.random() > 0.5 ? '#B8FF2C' : '#10B981')
          : (Math.random() > 0.5 ? '#0A0F1A' : '#10B981'),
      };
    };

    for (let i = 0; i < numPaths; i++) paths.push(createPath());

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      
      paths.forEach((path, i) => {
        ctx.beginPath();
        const pathAlpha = theme === 'dark' ? '22' : '11';
        ctx.strokeStyle = path.color + pathAlpha; // Very faint path
        ctx.moveTo(path.points[0].x, path.points[0].y);
        
        path.points.forEach((p, idx) => {
          if (idx > 0) ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Moving Freight Particle
        const segmentCount = path.points.length - 1;
        const totalProgress = path.progress * segmentCount;
        const currentSegment = Math.floor(totalProgress);
        const segmentProgress = totalProgress - currentSegment;

        if (currentSegment < segmentCount) {
          const p1 = path.points[currentSegment];
          const p2 = path.points[currentSegment + 1];
          const px = p1.x + (p2.x - p1.x) * segmentProgress;
          const py = p1.y + (p2.y - p1.y) * segmentProgress;

          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = path.color;
          ctx.shadowBlur = theme === 'dark' ? 20 : 10;
          ctx.shadowColor = path.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        path.progress += path.speed;
        if (path.progress >= 1) {
          paths[i] = createPath();
        }
      });

      animationFrameID = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameID);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo('.hero-title-part', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'power4.out' }
      )
      .fromTo('.hero-glass-card',
        { scale: 0.8, opacity: 0, backdropFilter: 'blur(0px)' },
        { scale: 1, opacity: 1, backdropFilter: 'blur(24px)', stagger: 0.3, duration: 1.5, ease: 'elastic.out(1, 0.75)' },
        "-=0.8"
      )
      .fromTo('.hero-cta-btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        "-=1"
      );

      gsap.to('.float-element', {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.6
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="hero" 
      className={`relative w-full h-[95vh] md:h-screen mesh-gradient overflow-hidden flex items-center ${className}`}
    >
      {/* Background Canvas: Logistics Flow */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-[0.3] dark:opacity-50" />
      <div className="absolute inset-0 bg-navy/5 dark:bg-navy/20 backdrop-blur-[2px] z-[1]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pt-36 lg:pt-28">
        
        {/* Left: Global Freight Infrastructure Message */}
        <div 
          className="max-w-4xl"
          style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm glass-premium-dark mb-8 border-l-2 border-l-lime dark:border-l-lime">
             <Globe className="w-4 h-4 text-emerald-600 dark:text-lime animate-spin-slow" />
             <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/80 dark:text-foreground/70">Welcome to AKA FS LLC</span>
          </div>
          
          <h1 className="hero-title text-[clamp(44px,8vw,120px)] font-black text-foreground leading-none tracking-tighter uppercase mb-4 flex flex-col items-start gap-0">
            <span className="hero-title-part block">Engineering</span>
            <span className="hero-title-part block h-[1.1em] overflow-hidden">
               <span className="hero-rotating-text block uppercase text-foreground/40 dark:text-white/30 text-[clamp(24px,4.5vw,54px)]">
                 {phrases[activePhraseIndex]}
               </span>
            </span>
            <span className="hero-title-part block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-[#4D7C0F] to-emerald-800 dark:from-lime dark:via-[#a2e61a] dark:to-emerald-400 mt-[-15px] md:mt-[-25px]">
               Global Freight
            </span>
          </h1>

          <p className="hero-title-part text-text-secondary text-lg md:text-2xl font-bold max-w-xl leading-relaxed mb-8 border-l-2 border-lime/20 pl-6">
            We've built a world-class logistics operating system that transforms complexity into pure profitability. Reliable, scalable, and relentlessly efficient.
          </p>

          <div className="hero-cta-btn flex flex-wrap gap-6">
            <button 
              onClick={onApplyClick}
              className="hero-cta-btn group relative px-10 py-5 bg-emerald-600 dark:bg-lime overflow-hidden rotate-[-2deg] hover:rotate-0 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-lime/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-lime dark:to-emerald-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-3 text-white dark:text-navy font-black text-sm uppercase tracking-[0.2em]">
                Apply For Partnership
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Right: Abstract UI Floating Components */}
        <div 
          className="hidden lg:flex flex-col gap-8 relative"
          style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
        >
          <div className="hero-glass-card glass-premium-dark p-8 w-[400px] float-element relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
               <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-lime uppercase tracking-widest mb-1">Live Shipment</span>
                  <span className="text-xl font-black text-foreground tracking-tight underline decoration-emerald-700/30 dark:decoration-lime/30 underline-offset-8 transition-all duration-500">
                    {randomLoadId}
                  </span>
               </div>
               <Activity className={`w-8 h-8 text-emerald-600 dark:text-lime ${theme === 'dark' ? 'animate-pulse' : ''}`} />
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-700/10 dark:bg-lime/10 flex items-center justify-center text-emerald-700 dark:text-lime border border-emerald-700/20 dark:border-lime/20">
                     <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-mono text-foreground/40 uppercase">Origin State</p>
                     <p className="text-sm font-bold text-foreground transition-all duration-500">{liveShipments[activeShipmentIndex].origin}</p>
                  </div>
               </div>
               <div className="ml-4 h-12 w-[1px] bg-gradient-to-b from-emerald-600 via-emerald-600/20 to-emerald-600 dark:from-lime dark:via-lime/20 dark:to-lime shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-[0_0_10px_#B8FF2C]" />
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                     <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-mono text-foreground/40 uppercase">Destination</p>
                     <p className="text-sm font-bold text-foreground transition-all duration-500">{liveShipments[activeShipmentIndex].destination}</p>
                  </div>
               </div>
            </div>

            <div className="mt-8 pt-4 border-t border-foreground/5 mb-2">
                <p className="text-[10px] font-mono text-foreground/30 uppercase mb-1">Assigned Driver</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                   <p className="text-xs font-bold text-foreground uppercase tracking-wider">{liveShipments[activeShipmentIndex].driver}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-foreground/5 flex justify-between items-center">
               <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-foreground/30 uppercase">ETA Estimate</span>
                  <span className="text-lg font-black text-foreground transition-all duration-500">{randomETA}</span>
               </div>
               <div className="px-4 py-2 bg-emerald-700/10 dark:bg-lime/10 border border-emerald-700/20 dark:border-lime/20 text-emerald-700 dark:text-lime text-[10px] font-mono uppercase tracking-widest">In Transit</div>
            </div>
          </div>

          {/* Secondary Mini Card */}
          <div className="hero-glass-card glass-premium p-6 w-[280px] float-element self-end lg:mr-[-40px] border-l-4 border-l-emerald-600 dark:border-l-lime group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-foreground/5 dark:bg-navy/80 rounded-sm flex items-center justify-center border border-foreground/5 group-hover:border-emerald-600/30 dark:group-hover:border-lime/30 transition-colors">
                   <Truck className="w-5 h-5 text-emerald-600 dark:text-lime" />
                </div>
                <div>
                   <h4 className="text-xs font-black text-foreground uppercase tracking-wider">Fleet Live Status</h4>
                   <p className="text-[10px] font-mono text-emerald-600 dark:text-lime">100+ Units Active</p>
                </div>
             </div>
             <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 dark:bg-lime w-[85%] animate-pulse" />
             </div>
          </div>

          {/* Abstract Data Stream Background */}
          <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-20 data-stream font-mono text-[8px] text-emerald-800 dark:text-lime overflow-hidden select-none pointer-events-none p-4 leading-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap mb-1">
                {Array.from({ length: 15 }).map((_, j) => (
                  <span key={j} className="mr-8">
                    {Math.random().toString(36).substring(7).toUpperCase()} // {Math.floor(Math.random() * 9999)} // {Math.random() > 0.5 ? 'OK' : 'BUSY'}
                  </span>
                ))}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Futuristic Background Accents */}
      <div className="absolute left-[-10vw] top-[30vh] w-[40vw] h-[40vw] bg-lime/10 rounded-full blur-[200px] z-0 opacity-50 pointer-events-none" />
      <div className="absolute right-[-10vw] bottom-[-10vh] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[200px] z-0 opacity-30 pointer-events-none" />

      {/* Left-side Subtle Scroll Indicator */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-12 group pointer-events-none">
         <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-mono uppercase tracking-[0.5em] text-foreground/20 group-hover:text-emerald-600 dark:group-hover:text-lime transition-colors duration-500">
            Scroll Exploration
         </span>
         <div className="w-[1px] h-32 bg-foreground/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-emerald-600 dark:via-lime to-transparent animate-scroll-line" />
         </div>
      </div>

    </section>
  );
};

export default Hero;
