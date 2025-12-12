import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, User, Users, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { TeamMember, TeamRegistrationData, RegistrationFormData } from '../types';
import FileUpload from './FileUpload';
import TeamMemberInput from './TeamMemberInput';
import { registerTeam } from '../api/registration';

interface RegistrationFormProps {
  onSuccess: (data: TeamRegistrationData) => void;
  onBack: () => void;
}

const STEPS = [
  { id: 1, title: 'Verification', icon: Shield, description: 'Confirm you are human' },
  { id: 2, title: 'Team Info', icon: User, description: 'Basic team details' },
  { id: 3, title: 'Members', icon: Users, description: 'Add team members' },
  { id: 4, title: 'ID Verification', icon: Upload, description: 'Upload ID card' },
];


const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function RegistrationForm({ onSuccess, onBack }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    teamName: '',
    teamLeaderName: '',
    teamLeaderEmail: '',
    teamMembers: [{ name: '', email: '', role: '' }],
    idCardFile: null,
    recaptchaToken: '',
  });

  const handleRecaptchaChange = useCallback((token: string | null) => {
    setFormData(prev => ({ ...prev, recaptchaToken: token || '' }));
  }, []);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMembersChange = (members: TeamMember[]) => {
    setFormData(prev => ({ ...prev, teamMembers: members }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, idCardFile: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.recaptchaToken) {
          toast.error('Please complete the reCAPTCHA verification');
          return false;
        }
        return true;
      case 2:
        if (!formData.teamName.trim()) {
          toast.error('Please enter your team name');
          return false;
        }
        if (!formData.teamLeaderName.trim()) {
          toast.error('Please enter the team leader name');
          return false;
        }
        if (!formData.teamLeaderEmail.trim() || !isValidEmail(formData.teamLeaderEmail)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 3:
        const validMembers = formData.teamMembers.filter(m => m.name.trim() && m.email.trim());
        if (validMembers.length === 0) {
          toast.error('Please add at least one team member');
          return false;
        }
        for (const member of validMembers) {
          if (!isValidEmail(member.email)) {
            toast.error(`Invalid email for ${member.name}`);
            return false;
          }
        }
        return true;
      case 4:
        if (!formData.idCardFile) {
          toast.error('Please upload an ID card for verification');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const response = await registerTeam(formData);
      
      if (response.success && response.data) {
        toast.success('Registration successful! Check your email for confirmation.');
        onSuccess(response.data);
      } else {
        toast.error(response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />
            <motion.div 
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />

            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                  animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepContent key="step1" title="Human Verification" subtitle="Please verify that you are not a robot">
                <div className="flex flex-col items-center py-8">
                  <div className="mb-6">
                    <Shield className="w-16 h-16 text-indigo-600 dark:text-indigo-400 opacity-50" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md">
                    To ensure the security of our platform and prevent automated registrations, 
                    please complete the verification below.
                  </p>
                  <div className="transform scale-105">
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      theme="light"
                    />
                  </div>
                  {formData.recaptchaToken && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-6 text-emerald-600"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Verification successful!</span>
                    </motion.div>
                  )}
                </div>
              </StepContent>
            )}

            {currentStep === 2 && (
              <StepContent key="step2" title="Team Information" subtitle="Enter your team's basic details">
                <div className="space-y-6 py-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      placeholder="Enter your team name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Team Leader Name *
                    </label>
                    <input
                      type="text"
                      value={formData.teamLeaderName}
                      onChange={(e) => handleInputChange('teamLeaderName', e.target.value)}
                      placeholder="Enter team leader's full name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Team Leader Email *
                    </label>
                    <input
                      type="email"
                      value={formData.teamLeaderEmail}
                      onChange={(e) => handleInputChange('teamLeaderEmail', e.target.value)}
                      placeholder="leader@example.com"
                      className="input-field"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                      Confirmation email will be sent to this address
                    </p>
                  </div>
                </div>
              </StepContent>
            )}

            {currentStep === 3 && (
              <StepContent key="step3" title="Team Members" subtitle="Add your team members (minimum 1)">
                <TeamMemberInput
                  members={formData.teamMembers}
                  onChange={handleMembersChange}
                />
              </StepContent>
            )}

            {currentStep === 4 && (
              <StepContent key="step4" title="ID Card Verification" subtitle="Upload your ID card for verification">
                <div className="py-4">
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Please upload a clear photo or scan of your ID card. This helps us verify 
                    the authenticity of your registration.
                  </p>
                  <FileUpload
                    file={formData.idCardFile}
                    onFileChange={handleFileChange}
                  />
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <strong>Privacy Note:</strong> Your ID card is securely processed and only used 
                      for verification purposes. We do not store or share your personal information.
                    </p>
                  </div>
                </div>
              </StepContent>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepContent({ 
  children, 
  title, 
  subtitle 
}: { 
  children: React.ReactNode; 
  title: string; 
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>
      {children}
    </motion.div>
  );
}
