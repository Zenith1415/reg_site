import { motion } from 'framer-motion';
import { ArrowRight, Users, Shield, Mail, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartRegistration: () => void;
}

export default function HeroSection({ onStartRegistration }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Registration Now Open</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="text-slate-900 dark:text-white">Register Your</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Dream Team
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Join thousands of teams worldwide. Our secure platform makes registration 
            simple, fast, and verified. Get your unique Team ID in minutes.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={onStartRegistration}
            className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Registration
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
          >
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
              title="Verified Security"
              description="reCAPTCHA protection and ID verification ensure only legitimate teams register."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-purple-600" />}
              title="Unique Team ID"
              description="Each team receives a unique identifier for easy tracking and management."
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-pink-600" />}
              title="Email Confirmation"
              description="Instant email confirmation sent to your team leader upon successful registration."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-400"
          >
            <TrustBadge icon={<CheckCircle2 className="w-4 h-4" />} text="SSL Secured" />
            <TrustBadge icon={<CheckCircle2 className="w-4 h-4" />} text="GDPR Compliant" />
            <TrustBadge icon={<CheckCircle2 className="w-4 h-4" />} text="24/7 Support" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      className="card p-6 text-left hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-emerald-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
