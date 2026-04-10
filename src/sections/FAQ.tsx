import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What areas do you cover?",
      answer: "We operate across 48 states with major hubs in the Midwest, Southeast, and West Coast. Our network includes scheduled lanes to major metropolitan areas with daily departures."
    },
    {
      question: "What equipment types do you offer?",
      answer: "Our fleet includes dry vans, temperature-controlled reefers, and flatbeds. All equipment is late-model (under 3 years old) and maintained to the highest standards."
    },
    {
      question: "How do I track a shipment?",
      answer: "We provide real-time tracking through our customer portal and mobile app. You'll receive geofenced notifications at key milestones, including pickup, transit updates, and delivery confirmation."
    },
    {
      question: "Do you provide dedicated capacity?",
      answer: "Yes, we offer dedicated fleet solutions for customers with consistent volume needs. This includes assigned tractors, drivers, and guaranteed capacity on your lanes."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We serve retail, food & beverage, manufacturing, healthcare, agriculture, and construction. Each vertical has specialized handling protocols and compliance requirements."
    },
    {
      question: "How do I become a driver?",
      answer: "Visit our Careers section and submit an application. Requirements include a valid CDL, clean driving record, and passing our safety screening. We offer competitive pay and comprehensive benefits."
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const items = accordionRef.current?.querySelectorAll('.faq-item');
      if (items) {
        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: accordionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy py-20 lg:py-32 px-6 lg:px-[7vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left column - Header */}
        <div ref={headerRef}>
          <h2 className="headline-section text-text-primary mb-4">
            Common Questions
          </h2>
          <p className="body-text max-w-[36ch]">
            Quick answers about coverage, equipment, and how we work.
          </p>
        </div>

        {/* Right column - Accordion */}
        <div ref={accordionRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item glass-card overflow-hidden will-change-transform"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/5 transition-colors"
              >
                <span className="font-space font-semibold text-text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-lime-dark dark:text-lime flex-shrink-0 transition-transform duration-250 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-250 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 body-text text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
