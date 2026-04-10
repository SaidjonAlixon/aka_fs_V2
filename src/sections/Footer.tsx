import { useLayoutEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Facebook } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onApplyClick?: () => void;
}

const Footer = ({ onApplyClick }: FooterProps) => {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'DRIVERS', href: '/drivers' },
    { label: 'CONTACT', href: '/contact' },
  ];


  return (
    <footer
      ref={footerRef}
      className="relative bg-background py-12 lg:py-16 px-6 lg:px-[7vw] border-t border-foreground/10"
    >
      {/* Decorative slash */}
      <div className="absolute top-0 left-[7vw] w-24 h-1 bg-lime-dark dark:bg-lime slash-bar -translate-y-1/2" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block"
          >
            <video
              src="/grok-footer.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-20 w-auto object-contain logo-filter"
            />
          </a>
          <button 
            onClick={onApplyClick}
            className="text-[10px] font-black text-lime-dark dark:text-lime uppercase tracking-[0.3em] hover:text-foreground transition-colors"
          >
            Join Our Fleet →
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className="font-space font-black text-sm uppercase tracking-[0.15em] text-text-secondary hover:text-lime-dark dark:hover:text-lime transition-all duration-200"
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={onApplyClick}
            className="font-space font-black text-sm uppercase tracking-[0.15em] text-lime-dark dark:text-lime hover:text-foreground transition-all duration-200"
          >
            APPLY
          </button>
        </nav>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 text-text-secondary hover:text-lime-dark dark:hover:text-lime transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 text-text-secondary hover:text-lime-dark dark:hover:text-lime transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 text-text-secondary hover:text-lime-dark dark:hover:text-lime transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
        <p className="font-mono text-[10px] text-text-secondary">
          © 2026 AKA FS Logistics. All rights reserved.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={(e) => e.preventDefault()}
            className="font-mono text-[10px] text-text-secondary hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="font-mono text-[10px] text-text-secondary hover:text-text-primary transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
