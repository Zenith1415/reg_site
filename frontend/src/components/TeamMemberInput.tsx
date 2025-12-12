import { motion } from 'framer-motion';
import { Plus, Trash2, User } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamMemberInputProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export default function TeamMemberInput({ members, onChange }: TeamMemberInputProps) {
  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addMember = () => {
    onChange([...members, { name: '', email: '', role: '' }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      onChange(members.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4 py-4">
      {members.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Member {index + 1}</span>
            </div>
            {members.length > 1 && (
              <button
                onClick={() => removeMember(index)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                placeholder="John Doe"
                className="input-field text-sm py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={member.email}
                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                placeholder="john@example.com"
                className="input-field text-sm py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Role (Optional)
              </label>
              <input
                type="text"
                value={member.role}
                onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                placeholder="Developer, Designer..."
                className="input-field text-sm py-2"
              />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={addMember}
        className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-4 h-4" />
        Add Another Member
      </motion.button>

      <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
        You can add up to 10 team members
      </p>
    </div>
  );
}
