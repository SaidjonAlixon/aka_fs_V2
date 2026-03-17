import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Truck, Briefcase, CheckCircle2, 
  ArrowRight, ArrowLeft, Upload,
  ShieldCheck, MapPin, ChevronRight, ChevronDown,
  Loader2
} from 'lucide-react';
import { uploadToBlob, submitApplication, type ApplicationPayload } from '../lib/driverApplicationApi';

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
  const [cdlDropdownOpen, setCdlDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'uploaded' | null>(null);
  const cdlDropdownRef = useRef<HTMLDivElement>(null);
  
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
    // Company Driver – Experience & License (Step 3)
    ssnOrEid: '',
    ssnImage: null as File | null,
    ssnImageUrl: '',
    licenseFront: null as File | null,
    licenseFrontUrl: '',
    licenseBack: null as File | null,
    licenseBackUrl: '',
    medicalCard: null as File | null,
    medicalCardUrl: '',
    resumeDoc: null as File | null,
    resumeDocUrl: '',
    drivingExperienceYears: 0,
    termsAccepted: false,
    // Owner Operator – Documents & Truck (Step 3)
    annualTruckInspection: null as File | null,
    annualTruckInspectionUrl: '',
    truckEngine: null as File | null,
    truckEngineUrl: '',
    truckUnderEngine: null as File | null,
    truckUnderEngineUrl: '',
    truckTires: null as File | null,
    truckTiresUrl: '',
    // Lease Purchase – Documents & Truck (Step 3, 3-rasm)
    leaseCapCard: null as File | null,
    leaseCapCardUrl: '',
    leaseAnnualInspection: null as File | null,
    leaseAnnualInspectionUrl: '',
    leaseTruckEngine: null as File | null,
    leaseTruckEngineUrl: '',
    leaseTruckUnderEngine: null as File | null,
    leaseTruckUnderEngineUrl: '',
    leaseTruckTires: null as File | null,
    leaseTruckTiresUrl: '',
  });

  const ssnInputRef = useRef<HTMLInputElement>(null);
  const licenseFrontRef = useRef<HTMLInputElement>(null);
  const licenseBackRef = useRef<HTMLInputElement>(null);
  const medicalRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const annualInspectionRef = useRef<HTMLInputElement>(null);
  const truckEngineRef = useRef<HTMLInputElement>(null);
  const truckUnderEngineRef = useRef<HTMLInputElement>(null);
  const truckTiresRef = useRef<HTMLInputElement>(null);
  const leaseCapCardRef = useRef<HTMLInputElement>(null);
  const leaseAnnualInspectionRef = useRef<HTMLInputElement>(null);
  const leaseTruckEngineRef = useRef<HTMLInputElement>(null);
  const leaseTruckUnderEngineRef = useRef<HTMLInputElement>(null);
  const leaseTruckTiresRef = useRef<HTMLInputElement>(null);

  const CDL_OPTIONS = [
    { value: 'Class A', label: 'CLASS A CDL' },
    { value: 'Class B', label: 'CLASS B CDL' },
    { value: 'Class C', label: 'CLASS C CDL' },
  ];

  useEffect(() => {
    if (!cdlDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (cdlDropdownRef.current && !cdlDropdownRef.current.contains(e.target as Node)) setCdlDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [cdlDropdownOpen]);

  if (!isOpen && !isVisible) return null;

  const nextStep = () => { setSubmitError(null); setCurrentStep(prev => Math.min(prev + 1, STEP_COUNT)); };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  async function handleSubmitApplication() {
    if (!selectedPosition || !formData.termsAccepted) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const documents: ApplicationPayload['documents'] = {};

      if (selectedPosition === 'company') {
        documents.ssnImage = formData.ssnImageUrl || undefined;
        documents.licenseFront = formData.licenseFrontUrl || undefined;
        documents.licenseBack = formData.licenseBackUrl || undefined;
        documents.medicalCard = formData.medicalCardUrl || undefined;
        documents.resume = formData.resumeDocUrl || undefined;
      } else if (selectedPosition === 'owner') {
        documents.ssnImage = formData.ssnImageUrl || undefined;
        documents.licenseFront = formData.licenseFrontUrl || undefined;
        documents.licenseBack = formData.licenseBackUrl || undefined;
        documents.medicalCard = formData.medicalCardUrl || undefined;
        documents.truckInspection = formData.annualTruckInspectionUrl || undefined;
        documents.enginePhoto = formData.truckEngineUrl || undefined;
        documents.underEnginePhoto = formData.truckUnderEngineUrl || undefined;
        documents.tirePhoto = formData.truckTiresUrl || undefined;
      } else if (selectedPosition === 'lease') {
        documents.capCard = formData.leaseCapCardUrl || undefined;
        documents.truckInspection = formData.leaseAnnualInspectionUrl || undefined;
        documents.enginePhoto = formData.leaseTruckEngineUrl || undefined;
        documents.underEnginePhoto = formData.leaseTruckUnderEngineUrl || undefined;
        documents.tirePhoto = formData.leaseTruckTiresUrl || undefined;
      }

      const positionLabel = selectedPosition === 'company' ? 'Company Driver' : selectedPosition === 'owner' ? 'Owner Operator' : 'Lease Purchase';
      const experience = selectedPosition === 'company'
        ? String(formData.drivingExperienceYears)
        : (formData.experienceYears || '');

      const payload: ApplicationPayload = {
        position: positionLabel,
        name: [formData.firstName, formData.lastName].filter(Boolean).join(' ') || '—',
        phone: formData.phone || '—',
        email: formData.email || '—',
        address: formData.location || '—',
        experience,
        cdlType: `${formData.cdlType || 'Class A'} CDL`,
        ssn: formData.ssnOrEid || '—',
        documents,
      };
      await submitApplication(payload);
      onClose();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }

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
                currentStep === 3 ? (selectedPosition === 'company' ? 'Experience & License' : selectedPosition === 'owner' || selectedPosition === 'lease' ? 'Documents & Truck' : 'Professional Experience') : 'Application Review'
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

            {currentStep === 3 && selectedPosition === 'company' && (
              /* Company Driver – Step 3: Experience & License (3-rasm) */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <h3 className="text-xl font-space font-black text-white uppercase tracking-tight">Experience & License</h3>

                <div className="space-y-3" ref={cdlDropdownRef}>
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.25em] block">Choose your CDL type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCdlDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-white/10 rounded-sm bg-lime text-navy font-space font-bold uppercase tracking-wide transition-all hover:bg-lime/90"
                    >
                      {(formData.cdlType || 'Class A') === 'Class A' && 'CLASS A CDL'}
                      {(formData.cdlType || 'Class A') === 'Class B' && 'CLASS B CDL'}
                      {(formData.cdlType || 'Class A') === 'Class C' && 'CLASS C CDL'}
                      <ChevronDown className={`w-5 h-5 transition-transform ${cdlDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {cdlDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 border border-white/10 overflow-hidden rounded-sm bg-[#0A0F1D] z-10 shadow-xl">
                        {CDL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, cdlType: opt.value });
                              setCdlDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-b-0 transition-all font-medium ${
                              (formData.cdlType || 'Class A') === opt.value
                                ? 'bg-lime text-navy font-bold'
                                : 'bg-white/[0.03] text-white/90 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Your SSN or EID number</label>
                  <input
                    type="text"
                    placeholder="Your SSN or EID number"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all font-medium"
                    value={formData.ssnOrEid}
                    onChange={(e) => setFormData({ ...formData, ssnOrEid: e.target.value })}
                  />
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">SSN (Image copy)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={ssnInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, ssnImage: file, ssnImageUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, ssnImageUrl: url }));
                          } catch {
                            // ignore upload error here; submit will fail later
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => ssnInputRef.current?.click()}
                      className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all"
                    >
                      Choose file
                    </button>
                    <span className={`text-sm font-mono ${formData.ssnImageUrl ? 'text-lime' : 'text-white/50'}`}>
                      {formData.ssnImage ? (formData.ssnImageUrl ? 'UPLOAD' : formData.ssnImage.name) : 'File not selected'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Years of commercial driving experience?</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white focus:border-lime focus:outline-none transition-all font-medium"
                    value={formData.drivingExperienceYears}
                    onChange={(e) => setFormData({ ...formData, drivingExperienceYears: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  />
                </div>

                <div className="space-y-3 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Driver License (Both Sides)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded border border-dashed border-white/10 bg-black/20">
                    <input
                      ref={licenseFrontRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, licenseFront: file, licenseFrontUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, licenseFrontUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                      <button type="button" onClick={() => licenseFrontRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all shrink-0">Choose file</button>
                      <span className={`text-sm font-mono truncate min-w-0 ${formData.licenseFrontUrl ? 'text-lime' : 'text-white/50'}`}>{formData.licenseFront ? (formData.licenseFrontUrl ? 'UPLOAD' : formData.licenseFront.name) : 'File not selected'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded border border-dashed border-white/10 bg-black/20">
                      <input
                        ref={licenseBackRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] ?? null;
                          setFormData((prev) => ({ ...prev, licenseBack: file, licenseBackUrl: '' }));
                          if (file) {
                            try {
                              const url = await uploadToBlob(file);
                              setFormData((prev) => ({ ...prev, licenseBackUrl: url }));
                            } catch {}
                          }
                        }}
                      />
                      <button type="button" onClick={() => licenseBackRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all shrink-0">Choose file</button>
                      <span className={`text-sm font-mono truncate min-w-0 ${formData.licenseBackUrl ? 'text-lime' : 'text-white/50'}`}>{formData.licenseBack ? (formData.licenseBackUrl ? 'UPLOAD' : formData.licenseBack.name) : 'File not selected'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Medical Card</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={medicalRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, medicalCard: file, medicalCardUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, medicalCardUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => medicalRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.medicalCardUrl ? 'text-lime' : 'text-white/50'}`}>{formData.medicalCard ? (formData.medicalCardUrl ? 'UPLOAD' : formData.medicalCard.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Resume / Document (Optional)</label>
                  <div
                    className="p-8 border-2 border-dashed border-white/20 bg-white/[0.02] hover:border-lime/40 hover:bg-lime/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 rounded-sm"
                    onClick={() => resumeRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-lime', 'bg-lime/10'); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove('border-lime', 'bg-lime/10'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-lime', 'bg-lime/10');
                      const f = e.dataTransfer.files?.[0];
                      if (f) setFormData((prev) => ({ ...prev, resumeDoc: f }));
                    }}
                  >
                    <input
                      ref={resumeRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, resumeDoc: file, resumeDocUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, resumeDocUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <div className={`p-3 rounded-full ${formData.resumeDoc ? 'bg-lime/20 text-lime' : 'bg-white/5 text-white/50'}`}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-white/70 text-sm">to upload or drag and drop</p>
                    <p className="text-[10px] font-mono text-white/40">PDF, JPEG, JPG, PNG (Max 10MB)</p>
                    {formData.resumeDoc && (
                      <p className={`text-sm font-mono font-bold ${formData.resumeDocUrl ? 'text-lime' : 'text-white/70'}`}>
                        {formData.resumeDocUrl ? 'UPLOAD' : formData.resumeDoc.name}
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    />
                    <div className="w-5 h-5 bg-white/5 border-2 border-white/10 peer-checked:bg-lime peer-checked:border-lime transition-all rounded" />
                    <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-text-secondary">Accept terms and conditions</span>
                </label>
              </div>
            )}

            {currentStep === 3 && selectedPosition === 'owner' && (
              /* Owner Operator – Step 3: Documents & Truck (3-rasm) */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <h3 className="text-xl font-space font-black text-white uppercase tracking-tight">Owner Operator – Documents & Truck</h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Your SSN or EID number</label>
                  <input
                    type="text"
                    placeholder="Your SSN or EID number"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-white placeholder:text-white/20 focus:border-lime focus:outline-none transition-all font-medium rounded-sm"
                    value={formData.ssnOrEid}
                    onChange={(e) => setFormData({ ...formData, ssnOrEid: e.target.value })}
                  />
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">SSN (Image Copy)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={ssnInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, ssnImage: file, ssnImageUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, ssnImageUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => ssnInputRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.ssnImageUrl ? 'text-lime' : 'text-white/50'}`}>{formData.ssnImage ? (formData.ssnImageUrl ? 'UPLOAD' : formData.ssnImage.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Driver License (Both Sides)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded border border-dashed border-white/10 bg-black/20">
                    <input
                      ref={licenseFrontRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, licenseFront: file, licenseFrontUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, licenseFrontUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                      <button type="button" onClick={() => licenseFrontRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all shrink-0">Choose file</button>
                      <span className={`text-sm font-mono truncate min-w-0 ${formData.licenseFrontUrl ? 'text-lime' : 'text-white/50'}`}>{formData.licenseFront ? (formData.licenseFrontUrl ? 'UPLOAD' : formData.licenseFront.name) : 'File not selected'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded border border-dashed border-white/10 bg-black/20">
                      <input
                        ref={licenseBackRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] ?? null;
                          setFormData((prev) => ({ ...prev, licenseBack: file, licenseBackUrl: '' }));
                          if (file) {
                            try {
                              const url = await uploadToBlob(file);
                              setFormData((prev) => ({ ...prev, licenseBackUrl: url }));
                            } catch {}
                          }
                        }}
                      />
                      <button type="button" onClick={() => licenseBackRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all shrink-0">Choose file</button>
                      <span className={`text-sm font-mono truncate min-w-0 ${formData.licenseBackUrl ? 'text-lime' : 'text-white/50'}`}>{formData.licenseBack ? (formData.licenseBackUrl ? 'UPLOAD' : formData.licenseBack.name) : 'File not selected'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Medical Card</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={medicalRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, medicalCard: file, medicalCardUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, medicalCardUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => medicalRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.medicalCardUrl ? 'text-lime' : 'text-white/50'}`}>{formData.medicalCard ? (formData.medicalCardUrl ? 'UPLOAD' : formData.medicalCard.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Annual truck inspection</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={annualInspectionRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, annualTruckInspection: file, annualTruckInspectionUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, annualTruckInspectionUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => annualInspectionRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.annualTruckInspectionUrl ? 'text-lime' : 'text-white/50'}`}>{formData.annualTruckInspection ? (formData.annualTruckInspectionUrl ? 'UPLOAD' : formData.annualTruckInspection.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Please upload truck pictures (engine, under engine, tires)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Engine</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={truckEngineRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, truckEngine: file, truckEngineUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, truckEngineUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => truckEngineRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.truckEngineUrl ? 'text-lime' : 'text-white/50'}`}>{formData.truckEngine ? (formData.truckEngineUrl ? 'UPLOAD' : formData.truckEngine.name) : 'File not selected'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Under engine</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={truckUnderEngineRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, truckUnderEngine: file, truckUnderEngineUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, truckUnderEngineUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => truckUnderEngineRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.truckUnderEngineUrl ? 'text-lime' : 'text-white/50'}`}>{formData.truckUnderEngine ? (formData.truckUnderEngineUrl ? 'UPLOAD' : formData.truckUnderEngine.name) : 'File not selected'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Tires</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={truckTiresRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, truckTires: file, truckTiresUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, truckTiresUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => truckTiresRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.truckTiresUrl ? 'text-lime' : 'text-white/50'}`}>{formData.truckTires ? (formData.truckTiresUrl ? 'UPLOAD' : formData.truckTires.name) : 'File not selected'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input type="checkbox" className="peer sr-only" checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} />
                    <div className="w-5 h-5 bg-transparent border-2 border-white/30 rounded-sm peer-checked:bg-lime peer-checked:border-lime transition-all" />
                    <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-navy opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed">Accept terms and conditions</span>
                </label>
              </div>
            )}

            {currentStep === 3 && selectedPosition === 'lease' && (
              /* Lease Purchase – Documents & Truck (3-rasm) */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <h3 className="text-xl font-space font-black text-white uppercase tracking-tight">Lease Purchase – Documents & Truck</h3>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Registration Card (CAP Card)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={leaseCapCardRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, leaseCapCard: file, leaseCapCardUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, leaseCapCardUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => leaseCapCardRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.leaseCapCardUrl ? 'text-lime' : 'text-white/50'}`}>{formData.leaseCapCard ? (formData.leaseCapCardUrl ? 'UPLOAD' : formData.leaseCapCard.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Annual truck inspection</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={leaseAnnualInspectionRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData((prev) => ({ ...prev, leaseAnnualInspection: file, leaseAnnualInspectionUrl: '' }));
                        if (file) {
                          try {
                            const url = await uploadToBlob(file);
                            setFormData((prev) => ({ ...prev, leaseAnnualInspectionUrl: url }));
                          } catch {}
                        }
                      }}
                    />
                    <button type="button" onClick={() => leaseAnnualInspectionRef.current?.click()} className="px-5 py-3 border-2 border-white/30 bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                    <span className={`text-sm font-mono ${formData.leaseAnnualInspectionUrl ? 'text-lime' : 'text-white/50'}`}>{formData.leaseAnnualInspection ? (formData.leaseAnnualInspectionUrl ? 'UPLOAD' : formData.leaseAnnualInspection.name) : 'File not selected'}</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-sm border border-white/15 bg-white/[0.02]">
                  <label className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">Please upload truck pictures (engine, under engine, tires)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Engine</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={leaseTruckEngineRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, leaseTruckEngine: file, leaseTruckEngineUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, leaseTruckEngineUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => leaseTruckEngineRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.leaseTruckEngineUrl ? 'text-lime' : 'text-white/50'}`}>{formData.leaseTruckEngine ? (formData.leaseTruckEngineUrl ? 'UPLOAD' : formData.leaseTruckEngine.name) : 'File not selected'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Under engine</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={leaseTruckUnderEngineRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, leaseTruckUnderEngine: file, leaseTruckUnderEngineUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, leaseTruckUnderEngineUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => leaseTruckUnderEngineRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.leaseTruckUnderEngineUrl ? 'text-lime' : 'text-white/50'}`}>{formData.leaseTruckUnderEngine ? (formData.leaseTruckUnderEngineUrl ? 'UPLOAD' : formData.leaseTruckUnderEngine.name) : 'File not selected'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-white/50 uppercase">Tires</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={leaseTruckTiresRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            setFormData((prev) => ({ ...prev, leaseTruckTires: file, leaseTruckTiresUrl: '' }));
                            if (file) {
                              try {
                                const url = await uploadToBlob(file);
                                setFormData((prev) => ({ ...prev, leaseTruckTiresUrl: url }));
                              } catch {}
                            }
                          }}
                        />
                        <button type="button" onClick={() => leaseTruckTiresRef.current?.click()} className="px-4 py-2 border-2 border-white/30 bg-white/5 text-white text-xs font-mono uppercase tracking-wider hover:border-lime hover:bg-lime/10 transition-all">Choose file</button>
                        <span className={`text-xs font-mono truncate ${formData.leaseTruckTiresUrl ? 'text-lime' : 'text-white/50'}`}>{formData.leaseTruckTires ? (formData.leaseTruckTiresUrl ? 'UPLOAD' : formData.leaseTruckTires.name) : 'File not selected'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input type="checkbox" className="peer sr-only" checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} />
                    <div className="w-5 h-5 bg-transparent border-2 border-white/30 rounded-sm peer-checked:bg-lime peer-checked:border-lime transition-all" />
                    <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-navy opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed">Accept terms and conditions</span>
                </label>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Selected Position</div>
                      <div className="text-lime font-space font-black uppercase text-lg md:text-xl">
                        {selectedPosition === 'company' ? 'Company Driver' : selectedPosition === 'owner' ? 'Owner Operator' : selectedPosition === 'lease' ? 'Lease Purchase' : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Full Name</div>
                      <div className="text-white font-space font-bold uppercase">{formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : '—'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Phone</div>
                      <div className="text-white font-space font-bold uppercase">{formData.phone || '—'}</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Email</div>
                      <div className="text-white font-space font-bold uppercase">{formData.email || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">CDL / Experience</div>
                      <div className="text-white font-space font-bold uppercase">
                        {selectedPosition === 'company'
                          ? `${(formData.cdlType || 'Class A').toUpperCase()} • ${formData.drivingExperienceYears} YRS`
                          : `${(formData.cdlType || 'Class A').toUpperCase()} • ${formData.experienceYears || '—'}`
                        }
                      </div>
                    </div>
                    {(selectedPosition === 'company' || selectedPosition === 'owner') && (
                      <div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">SSN / EID</div>
                        <div className="text-white font-space font-bold uppercase">{formData.ssnOrEid || '—'}</div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedPosition === 'company' && (formData.licenseFront || formData.licenseBack || formData.medicalCard || formData.resumeDoc) && (
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Documents</div>
                    <div className="text-white/80 text-sm font-mono">
                      {formData.licenseFront && <>License (front): {formData.licenseFront.name}</>}
                      {formData.licenseBack && <> · License (back): {formData.licenseBack.name}</>}
                      {formData.medicalCard && <> · Medical: {formData.medicalCard.name}</>}
                      {formData.resumeDoc && <> · Resume: {formData.resumeDoc.name}</>}
                    </div>
                  </div>
                )}
                {selectedPosition === 'owner' && (formData.licenseFront || formData.licenseBack || formData.medicalCard || formData.annualTruckInspection || formData.truckEngine || formData.truckUnderEngine || formData.truckTires) && (
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Documents & Truck</div>
                    <div className="text-white/80 text-sm font-mono space-y-1">
                      {formData.licenseFront && <div>License (front): {formData.licenseFront.name}</div>}
                      {formData.licenseBack && <div>License (back): {formData.licenseBack.name}</div>}
                      {formData.medicalCard && <div>Medical card: {formData.medicalCard.name}</div>}
                      {formData.annualTruckInspection && <div>Annual truck inspection: {formData.annualTruckInspection.name}</div>}
                      {formData.truckEngine && <div>Truck (engine): {formData.truckEngine.name}</div>}
                      {formData.truckUnderEngine && <div>Truck (under engine): {formData.truckUnderEngine.name}</div>}
                      {formData.truckTires && <div>Truck (tires): {formData.truckTires.name}</div>}
                    </div>
                  </div>
                )}
                {selectedPosition === 'lease' && (formData.leaseCapCard || formData.leaseAnnualInspection || formData.leaseTruckEngine || formData.leaseTruckUnderEngine || formData.leaseTruckTires) && (
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Documents & Truck</div>
                    <div className="text-white/80 text-sm font-mono space-y-1">
                      {formData.leaseCapCard && <div>Registration (CAP Card): {formData.leaseCapCard.name}</div>}
                      {formData.leaseAnnualInspection && <div>Annual truck inspection: {formData.leaseAnnualInspection.name}</div>}
                      {formData.leaseTruckEngine && <div>Truck (engine): {formData.leaseTruckEngine.name}</div>}
                      {formData.leaseTruckUnderEngine && <div>Truck (under engine): {formData.leaseTruckUnderEngine.name}</div>}
                      {formData.leaseTruckTires && <div>Truck (tires): {formData.leaseTruckTires.name}</div>}
                    </div>
                  </div>
                )}

                {submitError && (
                  <p className="text-red-400 text-sm font-mono">{submitError}</p>
                )}
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    />
                    <div className="w-5 h-5 bg-transparent border-2 border-white/30 rounded-sm peer-checked:bg-lime peer-checked:border-lime transition-all" />
                    <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-navy opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed">
                    I confirm that the information provided is accurate and I agree to AKA FS LOGISTICS’ terms and conditions regarding driver recruitment and data handling.
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Navigation Buttons */}
        <div className="p-6 md:p-8 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0D1426]">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Submission ID: #AKA-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </span>
            {uploadStatus && (
              <span
                className={`font-mono text-[11px] tracking-[0.25em] uppercase ${
                  uploadStatus === 'uploaded' ? 'text-lime' : 'text-white/60'
                }`}
              >
                {uploadStatus === 'uploaded' ? 'UPLOAD' : 'UPLOADING...'}
              </span>
            )}
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
                onClick={handleSubmitApplication}
                disabled={!formData.termsAccepted || isSubmitting}
                className="group flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-lime text-navy font-space font-black text-xs uppercase tracking-widest hover:bg-white disabled:opacity-30 disabled:hover:bg-lime transition-all shadow-[0_0_30px_rgba(184,255,44,0.3)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationForm;

