import React, { useState, useEffect } from 'react';
import { 
  X, Truck, Briefcase, CheckCircle2, 
  ArrowRight, ArrowLeft, Upload, FileText,
  ShieldCheck, MapPin, ChevronRight
} from 'lucide-react';

interface DriverApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type PositionType = 'company' | 'owner' | 'lease';

const STEP_COUNT = 4;

const DriverApplicationForm: React.FC<DriverApplicationFormProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    cdlType: '',
    experienceYears: '',
    termsAccepted: false
  });

  if (!isOpen && !isVisible) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEP_COUNT));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const positions = [
    {
      id: 'company' as PositionType,
      title: 'Company Driver',
      description: 'Drive our late-model equipment with full benefits and consistent freight.',
      tags: ['Health & Dental', 'Weekly Pay', 'Modern Fleet', 'Home Time'],
      icon: Truck
    },
    {
      id: 'owner' as PositionType,
      title: 'Owner Operator',
      description: 'Bring your own truck and leverage our nationwide network for maximum earnings.',
      tags: ['High % Pay', 'Fuel Cards', '24/7 Dispatch', 'Flexibility'],
      icon: ShieldCheck
    },
    {
      id: 'lease' as PositionType,
      title: 'Lease Purchase',
      description: 'Become your own boss with our path to truck ownership and stable support.',
      tags: ['No Money Down', 'Maintenance Plan', 'Stable Freight', 'Success Support'],
      icon: Briefcase
    }
  ];

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 lg:p-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-navy/95 backdrop-blur-xl transition-all duration-500"
      />

      {/* Main Container */}
      <div 
        className={`relative w-full max-w-4xl bg-[#0A0F1D] border border-white/10 rounded-sm overflow-hidden flex flex-col max-h-[90vh] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-[#0D1426]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/10 border border-lime/20 rounded-full mb-3 text-[10px] font-black tracking-widest text-lime uppercase font-mono">
              <Truck className="w-3 h-3" />
              AKA FS LOGISTICS
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
              Driver Application
            </h2>
            <p className="text-text-secondary font-mono text-xs mt-1 uppercase tracking-wider">
              Step {currentStep} of {STEP_COUNT} — {
                currentStep === 1 ? 'Position Selection' :
                currentStep === 2 ? 'Contact Details' :
                currentStep === 3 ? 'Professional Experience' : 'Application Review'
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full relative">
          <div 
            className="h-full bg-lime shadow-[0_0_10px_#B8FF2C] transition-all duration-500"
            style={{ width: `${(currentStep / STEP_COUNT) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <div className="relative">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <p className="text-text-secondary text-lg font-space italic">
                  "Choose the path that fits your goals. We're looking for partners, not just drivers."
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setSelectedPosition(pos.id)}
                      className={`group relative p-6 text-left border transition-all duration-300 ${
                        selectedPosition === pos.id 
                        ? 'bg-lime/5 border-lime shadow-[0_0_30px_rgba(184,255,44,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-4">
                          <div className={`p-4 rounded-sm transition-colors ${
                            selectedPosition === pos.id ? 'bg-lime text-black' : 'bg-white/5 text-white/50'
                          }`}>
                            <pos.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-space font-black text-xl text-white uppercase tracking-tight">
                              {pos.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed max-w-md mt-1">
                              {pos.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pos.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white/5 text-[9px] font-mono text-white/40 uppercase tracking-widest border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {selectedPosition === pos.id && (
                        <div className="absolute top-4 right-4 text-lime drop-shadow-glow">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your first name"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all uppercase font-medium"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your last name"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all uppercase font-medium"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (---) --- ----"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Current Location (City, State)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="e.g. Chicago, IL"
                      className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all uppercase font-medium"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">CDL License Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Class A', 'Class B'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, cdlType: type})}
                          className={`p-4 border font-space font-bold uppercase tracking-widest transition-all ${
                            formData.cdlType === type ? 'bg-lime text-black border-lime shadow-glow' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Driving Experience</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['< 1yr', '1-3yrs', '3-5yrs', '5-10yrs', '10+yrs'].map(range => (
                        <button
                          key={range}
                          onClick={() => setFormData({...formData, experienceYears: range})}
                          className={`p-3 border text-[11px] font-mono font-bold uppercase transition-all ${
                            formData.experienceYears === range ? 'bg-lime text-black border-lime' : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 border-2 border-dashed border-white/10 hover:border-lime/30 transition-colors group cursor-pointer flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-lime/10 group-hover:text-lime transition-all">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="font-space font-bold text-sm uppercase tracking-widest text-white/70">Upload CDL (Front)</div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">MAX 10MB • JPG, PNG, PDF</div>
                   </div>
                   <div className="p-8 border-2 border-dashed border-white/10 hover:border-lime/30 transition-colors group cursor-pointer flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-lime/10 group-hover:text-lime transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="font-space font-bold text-sm uppercase tracking-widest text-white/70">Upload Resume (Optional)</div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">MAX 10MB • PDF, DOCX</div>
                   </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="bg-white/[0.02] border border-white/5 p-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Selected Position</span>
                    <span className="text-lime font-space font-black uppercase text-xl">{selectedPosition?.replace('_', ' ')}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6">
                    <div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Full Name</div>
                      <div className="text-white font-space font-bold uppercase">{formData.firstName} {formData.lastName}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Email</div>
                      <div className="text-white font-space font-bold uppercase">{formData.email}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Phone</div>
                      <div className="text-white font-space font-bold uppercase">{formData.phone}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">CDL / Experience</div>
                      <div className="text-white font-space font-bold uppercase">{formData.cdlType} • {formData.experienceYears}</div>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    />
                    <div className="w-6 h-6 bg-white/5 border-2 border-white/10 peer-checked:bg-lime peer-checked:border-lime transition-all" />
                    <CheckCircle2 className="absolute top-0 left-0 w-6 h-6 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs text-text-secondary leading-relaxed font-inter font-medium">
                    I confirm that the information provided is accurate and I agree to AKA FS LOGISTICS’ terms and conditions regarding driver recruitment and data handling.
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Navigation Buttons */}
        <div className="p-6 md:p-8 border-t border-white/5 flex items-center justify-between bg-[#0D1426]">
          <div className="hidden md:block">
             <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
               Submission ID: #AKA-{Math.random().toString(36).substr(2, 6).toUpperCase()}
             </span>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {currentStep > 1 && (
              <button 
                onClick={prevStep}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border border-white/10 text-white font-space font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {currentStep < STEP_COUNT ? (
              <button 
                onClick={nextStep}
                disabled={currentStep === 1 && !selectedPosition}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-lime text-navy font-space font-black text-xs uppercase tracking-widest hover:bg-white disabled:opacity-30 disabled:hover:bg-lime transition-all group"
              >
                Continue
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button 
                onClick={onClose}
                disabled={!formData.termsAccepted}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-lime text-navy font-space font-black text-xs uppercase tracking-widest hover:bg-white disabled:opacity-30 disabled:hover:bg-lime transition-all shadow-[0_0_30px_rgba(184,255,44,0.3)]"
              >
                Submit Application
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationForm;

