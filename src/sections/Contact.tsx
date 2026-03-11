import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Clock, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'dispatch@akafs.com' },
    { icon: Phone, label: 'Phone', value: '1-800-555-0142' },
    { icon: Clock, label: 'Hours', value: 'Mon–Fri 6am–10pm ET' },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { x: '6vw', opacity: 0, scale: 1.02 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const fields = formRef.current?.querySelectorAll('.form-field');
      if (fields) {
        gsap.fromTo(
          fields,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your inquiry! We will respond within one business day.');
    setFormData({ name: '', company: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-navy-light py-20 lg:py-32 px-6 lg:px-[7vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left column - Form */}
        <div ref={leftRef}>
          <h2 className="headline-section text-text-primary mb-4">
            Let's Move Freight.
          </h2>
          <p className="body-text max-w-[40ch] mb-8">
            Tell us what you're shipping. We'll respond within one business day.
          </p>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="glass-card p-4 text-center hover:border-lime/30 transition-all duration-300"
              >
                <info.icon className="w-5 h-5 text-lime mx-auto mb-2" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                  {info.label}
                </div>
                <div className="font-space text-sm text-text-primary">
                  {info.value}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-field">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div className="form-field">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors"
                  placeholder="Your company"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-field">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-field">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                Freight Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your shipping needs..."
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              <Send className="w-4 h-4 mr-2" />
              Send Inquiry
            </button>
          </form>
        </div>

        {/* Right column - Image */}
        <div ref={rightRef} className="relative hidden lg:block">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/contact_truck_road.jpg"
              alt="Truck on open road"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-light/50 to-transparent" />
          </div>
          {/* Diagonal slash overlay */}
          <div className="absolute left-0 top-0 h-full w-16 bg-lime slash-bar opacity-80" />
        </div>
      </div>
    </section>
  );
};

export default Contact;
