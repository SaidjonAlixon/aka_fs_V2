import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  onApplyClick?: () => void;
}

const Navigation = ({ onApplyClick }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'DRIVERS', href: '/drivers' },
    { label: 'CONTACT', href: '/contact' },
  ];

  // Mobile overlay rendered via portal directly into document.body
  // so no stacking context of a parent can clip it
  const mobileMenu = createPortal(
    <div
      className={`fixed inset-0 bg-background z-[2147483647] lg:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Close Button */}
      <button
        style={{ position: 'absolute', top: '2rem', right: '2rem' }}
        className="text-text-primary p-2 hover:text-lime transition-colors"
        onClick={() => setIsOpen(false)}
      >
        <X size={44} />
      </button>

      {/* Nav Links */}
      <div className="flex flex-col items-center gap-10 w-full px-12">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.href}
            className={({ isActive }) =>
              `font-space font-black text-4xl md:text-6xl tracking-widest transition-all duration-300 px-6 py-2 ${
                isActive ? 'text-lime' : 'text-text-primary hover:text-lime'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <div className="pt-8 w-full max-w-sm flex flex-col gap-4 items-center">
          <ThemeToggle />
          <button
            onClick={() => {
              onApplyClick?.();
              setIsOpen(false);
            }}
            className="w-full py-5 bg-lime text-navy font-space font-black text-base tracking-[0.2em] uppercase rounded-sm shadow-[0_0_30px_rgba(184,255,44,0.4)]"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[99999] transition-all duration-500 ${
          scrolled ? 'bg-navy/95 backdrop-blur-md py-4 shadow-2xl' : 'bg-transparent py-8'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo_aka.png"
              alt="AKA Logo"
              className="h-10 lg:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-105 logo-filter"
            />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `font-space font-black text-sm tracking-[0.2em] transition-all duration-500 px-4 py-2 rounded-sm border-2 ${
                    scrolled 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                  } ${
                    isActive
                    ? 'text-lime border-foreground/20 bg-foreground/5'
                    : 'text-text-primary border-transparent hover:text-lime'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <ThemeToggle />
              <button
                onClick={onApplyClick}
                className="px-6 py-2 bg-lime text-navy font-space font-black text-xs tracking-[0.15em] hover:bg-foreground hover:text-background transition-all uppercase rounded-sm shadow-[0_0_20px_rgba(184,255,44,0.3)]"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-text-primary p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay via Portal */}
      {mobileMenu}
    </>
  );
};

export default Navigation;
