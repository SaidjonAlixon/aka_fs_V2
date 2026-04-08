import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DriverApplicationForm from './components/DriverApplicationForm';

// Home sections
import Hero from './sections/Hero';
import StatsSection from './sections/StatsSection';
import ServicesPreview from './sections/ServicesPreview';
import WhyUsSection from './sections/WhyUsSection';
import HowItWorksSection from './sections/HowItWorksSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import NetworkSection from './sections/NetworkSection';
import TestimonialsHome from './sections/TestimonialsHome';
import HomeCTA from './sections/HomeCTA';

// About sections
import Services from './sections/Services';
import Coverage from './sections/Coverage';
import Industries from './sections/Industries';
import Technology from './sections/Technology';
import Safety from './sections/Safety';
import Sustainability from './sections/Sustainability';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';

// Other pages
import Careers from './sections/Careers';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Router>
      <div className="relative bg-background min-h-screen">
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Navigation */}
        <Navigation onApplyClick={() => setIsFormOpen(true)} />

        {/* Main content */}
        <main className="relative">
          <Routes>
            {/* HOME PAGE */}
            <Route
              path="/"
              element={
                <>
                  <Hero onApplyClick={() => setIsFormOpen(true)} />
                  <StatsSection />
                  <ServicesPreview onApplyClick={() => setIsFormOpen(true)} />
                  <WhyUsSection />
                  <HowItWorksSection />
                  <CapabilitiesSection />
                  <NetworkSection />
                  <TestimonialsHome />
                  <HomeCTA onApplyClick={() => setIsFormOpen(true)} />
                </>
              }
            />

            {/* ABOUT PAGE */}
            <Route
              path="/about"
              element={
                <>
                  <Services onApplyClick={() => setIsFormOpen(true)} className="z-20" />
                  <Coverage className="z-30" />
                  <Industries onApplyClick={() => setIsFormOpen(true)} className="z-50" />
                  <Technology className="z-[60]" />
                  <Safety className="z-[70]" />
                  <Sustainability className="z-[80]" />
                  <Testimonials />
                  <FAQ />
                </>
              }
            />

            {/* DRIVERS PAGE */}
            <Route path="/drivers" element={<Careers onApplyClick={() => setIsFormOpen(true)} className="z-[90]" />} />

            {/* CONTACT PAGE */}
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer onApplyClick={() => setIsFormOpen(true)} />

        <DriverApplicationForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
