import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Copy, ArrowRight, Download, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { TeamRegistrationData } from '../types';

interface SuccessPageProps {
  teamData: TeamRegistrationData;
  onBackToHome: () => void;
}

export default function SuccessPage({ teamData, onBackToHome }: SuccessPageProps) {
  const copyTeamId = () => {
    navigator.clipboard.writeText(teamData.teamId);
    toast.success('Team ID copied to clipboard!');
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-8 text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Registration Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 dark:text-slate-400 mb-8"
          >
            Your team has been registered successfully. A confirmation email has been sent to your team leader.
          </motion.p>

          {/* Team ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium opacity-80">Team ID Card</span>
              </div>

              <h2 className="text-2xl font-bold mb-1">{teamData.teamName}</h2>
              <p className="text-white/70 text-sm mb-4">Led by {teamData.teamLeaderName}</p>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 mb-1">Unique Team ID</p>
                  <p className="text-xl font-mono font-bold tracking-wider">{teamData.teamId}</p>
                </div>
                <button
                  onClick={copyTeamId}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Email Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-8"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-emerald-800 dark:text-emerald-300">Confirmation Email Sent</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{teamData.teamLeaderEmail}</p>
            </div>
          </motion.div>

          {/* Team Details Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-left mb-8"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Team Details</h3>
            <div className="space-y-3">
              <DetailRow label="Team Name" value={teamData.teamName} />
              <DetailRow label="Team Leader" value={teamData.teamLeaderName} />
              <DetailRow label="Email" value={teamData.teamLeaderEmail} />
              <DetailRow label="Members" value={`${teamData.teamMembers.length} members`} />
              <DetailRow label="Registered On" value={new Date(teamData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="btn-secondary flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            <button 
              onClick={onBackToHome}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <span className="text-slate-600 dark:text-slate-400 text-sm">{label}</span>
      <span className="font-medium text-slate-900 dark:text-white text-sm">{value}</span>
    </div>
  );
}
