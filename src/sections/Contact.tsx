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
      className="relative min-h-[160vh] lg:min-h-[180vh] flex flex-col justify-end pb-40 px-6 lg:px-[8vw] overflow-hidden"
    >
      {/* Background Image Layer - Fixed/Sticky for maximum clarity */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src="/images/Office.png"
            alt="AKA FS Background"
            className="w-full h-full object-cover object-[center_20%]"
          />
          {/* Minimalist, high-end overlays with seamless fade */}
          <div className="absolute inset-0 bg-navy/20 backdrop-blur-[0.2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy" />
          <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-navy to-transparent" />
        </div>
      </div>

      {/* Main Content - Pushed for depth but integrated via gradients */}
      <div className="relative z-10 w-full pt-[80vh]">
        {/* Refined Header - Slightly larger for impact */}
        <div className="mb-24 max-w-3xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-0.5 w-20 bg-lime" />
            <span className="text-lime font-black tracking-[0.8em] uppercase text-[11px]">CONNECT WITH EXCELLENCE</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            GLOBAL <span className="text-lime">STANDARDS.</span><br />
            LOCAL ROOTS.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-[45ch] leading-relaxed">
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
                  className="glass-card bg-navy/40 backdrop-blur-2xl p-6 border-white/5 flex flex-col gap-4 hover:border-lime/30 hover:bg-navy/60 transition-all border-l-4 border-l-lime/10 group"
                >
                  <div className="p-3 bg-navy/60 border border-white/10 text-lime w-fit group-hover:bg-lime group-hover:text-navy transition-all">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{info.label}</div>
                    <div className="text-sm font-black text-white tracking-wide">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Substantial Glass Form */}
            <div className="glass-card bg-navy/50 backdrop-blur-3xl p-10 md:p-14 border-white/10 shadow-3xl">
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
                      className="w-full bg-navy/30 border-b-2 border-white/10 px-6 py-4 text-sm text-white focus:border-lime focus:outline-none focus:bg-white/5 transition-all"
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
                      className="w-full bg-navy/30 border-b-2 border-white/10 px-6 py-4 text-sm text-white focus:border-lime focus:outline-none focus:bg-white/5 transition-all"
                      placeholder="Professional Email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Requirements</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-navy/30 border-b-2 border-white/10 px-6 py-4 text-sm text-white focus:border-lime focus:outline-none focus:bg-white/5 transition-all resize-none"
                    placeholder="Describe your logistics challenges or shipment details..."
                  />
                </div>

                <button
                  type="submit"
                  className="group/btn relative w-full py-6 bg-lime text-navy font-black text-sm uppercase tracking-[0.5em] overflow-hidden transition-all hover:scale-[1.01] shadow-[0_0_60px_rgba(184,255,44,0.15)]"
                  style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 0 100%)' }}
                >
                  <span className="relative z-10 flex justify-center items-center gap-3">
                    <Send className="w-5 h-5" />
                    Secure Inbound Request
                  </span>
                  <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-700 ease-in-out" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Prominent Map */}
          <div ref={rightRef} className="lg:col-span-5 h-full">
            <div className="glass-card bg-navy/40 backdrop-blur-3xl p-2 border-white/10 h-full min-h-[500px] lg:min-h-[600px] relative group overflow-hidden">
              <div className="w-full h-full relative overflow-hidden grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-1000 brightness-90 hover:brightness-105">
                <iframe
                  title="AKA FS HQ"
                  src="https://maps.google.com/maps?q=400%20Lydia%20Street,%20Suite%20103,%20Carnegie,%20PA%2015106&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-navy/60 via-transparent to-navy/20" />
              </div>

              {/* Floating HQ Identity */}
              <div className="absolute top-10 left-10">
                <div className="glass-card bg-navy/95 backdrop-blur-3xl border-lime/40 p-6 px-10 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-lime animate-ping" />
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">HEADQUARTERS</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-5 leading-relaxed">
                    400 Lydia Street, Suite 103<br/>Carnegie, PA 15106
                  </p>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 flex items-center gap-6">
                <div className="h-px w-16 bg-white/20" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.6em] opacity-40">Live Network Feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
