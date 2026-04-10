import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@akafsllc.com' },
    { icon: Phone, label: 'Phone', value: '+1 (412) 235-3377' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Thank you for your inquiry! We will respond within one business day.');
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-24 md:py-32 px-6 lg:px-[8vw] overflow-hidden bg-background"
    >
      {/* Dynamic Background Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-lime/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-navy-light/20 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,255,44,0.02)_0%,transparent_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        {/* Refined Header */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-0.5 w-16 bg-lime-dark dark:bg-lime" />
            <span className="text-lime-dark dark:text-lime font-black tracking-[0.6em] uppercase text-[10px]">CONNECT WITH EXCELLENCE</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none mb-6">
            GLOBAL <span className="text-lime-dark dark:text-lime">STANDARDS.</span><br />
            LOCAL ROOTS.
          </h2>
          <p className="text-text-secondary text-lg md:text-xl font-medium max-w-[45ch] leading-relaxed">
            Experience the AKA FS standard in logistics. Our experts are ready to optimize your supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Substantial Info & Form */}
          <div ref={leftRef} className="lg:col-span-7 space-y-10">
            {/* Larger Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="glass-card bg-background/40 backdrop-blur-2xl p-6 border-foreground/10 flex flex-col gap-4 hover:border-lime/30 hover:bg-secondary transition-all border-l-4 border-l-lime/10 group"
                >
                  <div className="p-3 bg-secondary border border-foreground/10 text-lime-dark dark:text-lime w-fit group-hover:bg-lime-dark dark:group-hover:bg-lime group-hover:text-[#0A0F1A] transition-all">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-1">{info.label}</div>
                    <div className="text-sm font-black text-foreground tracking-wide">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Substantial Glass Form */}
            <div className="glass-card bg-background/50 backdrop-blur-3xl p-10 md:p-14 border-foreground/10 shadow-3xl">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Identity</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-foreground/5 border-b-2 border-foreground/10 px-6 py-4 text-sm text-foreground focus:border-lime focus:outline-none focus:bg-lime/5 transition-all"
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Channel</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-foreground/5 border-b-2 border-foreground/10 px-6 py-4 text-sm text-foreground focus:border-lime focus:outline-none focus:bg-lime/5 transition-all"
                      placeholder="Professional Email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary ml-1">Requirements</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-foreground/5 border-b-2 border-foreground/10 px-6 py-4 text-sm text-foreground focus:border-lime focus:outline-none focus:bg-foreground/10 transition-all resize-none"
                    placeholder="Describe your logistics challenges or shipment details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group/btn relative w-full py-6 bg-lime text-[#0A0F1A] font-black text-sm uppercase tracking-[0.5em] overflow-hidden transition-all hover:scale-[1.01] shadow-[0_0_60px_rgba(184,255,44,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 0 100%)' }}
                >
                  <span className="relative z-10 flex justify-center items-center gap-3">
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isSubmitting ? 'Sending Request...' : 'Secure Inbound Request'}
                  </span>
                  <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-700 ease-in-out" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Prominent Map */}
          <div ref={rightRef} className="lg:col-span-5 h-full">
            <div className="glass-card bg-background/40 backdrop-blur-3xl p-2 border-foreground/10 h-full min-h-[500px] lg:min-h-[600px] relative group overflow-hidden">
              <div className="w-full h-full relative overflow-hidden grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-1000 brightness-90 hover:brightness-105">
                <iframe
                  title="AKA FS HQ"
                  src="https://maps.google.com/maps?q=400%20Lydia%20Street,%20Suite%20103,%20Carnegie,%20PA%2015106&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-background/60 via-transparent to-background/20" />
              </div>

              {/* Floating HQ Identity */}
              <div className="absolute top-10 left-10">
                <div className="glass-card bg-background/95 backdrop-blur-3xl border-lime/40 p-6 px-10 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-lime-dark dark:bg-lime animate-ping" />
                    <h4 className="text-xl font-black text-foreground uppercase tracking-tight">HEADQUARTERS</h4>
                  </div>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] ml-5 leading-relaxed">
                    400 Lydia Street, Suite 103<br/>Carnegie, PA 15106
                  </p>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 flex items-center gap-6">
                <div className="h-px w-16 bg-foreground/20" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-[0.6em] opacity-40">Live Network Feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
