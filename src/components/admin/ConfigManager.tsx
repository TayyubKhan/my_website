import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCcw, AlertCircle, CheckCircle2, TrendingUp, Users, Smartphone, Briefcase } from 'lucide-react';
import { usePortfolioConfig, PortfolioConfig } from '../../hooks/usePortfolioConfig';

const ConfigManager: React.FC = () => {
  const { config, loading, error, updateConfig } = usePortfolioConfig();
  const [formData, setFormData] = useState<PortfolioConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['yearsExperience', 'totalProjects', 'happyClients', 'publishedApps'].includes(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateConfig(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Configuration updated successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Failed to update configuration.' });
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <RefreshCcw className="h-10 w-10 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-800/50 rounded-[2.5rem] p-12 border border-zinc-200 dark:border-zinc-700/50 shadow-sm backdrop-blur-md">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Portfolio Engine.</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Global System Configuration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Core Analytics / Numbers */}
          <div className="space-y-8">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-700/50 pb-4">Influence Metrics</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: 'Years of Mastery', name: 'yearsExperience', icon: TrendingUp, color: 'text-blue-500' },
                 { label: 'Enterprise Projects', name: 'totalProjects', icon: Briefcase, color: 'text-emerald-500' },
                 { label: 'Global Partnerships', name: 'happyClients', icon: Users, color: 'text-purple-500' },
                 { label: 'Digital Shipments', name: 'publishedApps', icon: Smartphone, color: 'text-pink-500' },
               ].map((field) => (
                 <div key={field.name} className="space-y-3">
                   <label className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                     <field.icon className={`h-3 w-3 mr-2 ${field.color}`} />
                     {field.label}
                   </label>
                   <input
                     type="number"
                     name={field.name}
                     value={(formData as any)[field.name]}
                     onChange={handleChange}
                     className="w-full px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all placeholder:text-zinc-300"
                   />
                 </div>
               ))}
             </div>
          </div>

          {/* Site Identity */}
          <div className="space-y-8">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-700/50 pb-4">Social Presence</h3>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LinkedIn Profile URL</label>
                   <input
                     type="url"
                     name="linkedinUrl"
                     // @ts-ignore
                     value={formData.linkedinUrl || ''}
                     onChange={handleChange}
                     placeholder="https://linkedin.com/in/..."
                     className="w-full px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GitHub Profile URL</label>
                   <input
                     type="url"
                     name="githubUrl"
                     // @ts-ignore
                     value={formData.githubUrl || ''}
                     onChange={handleChange}
                     placeholder="https://github.com/..."
                     className="w-full px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                   />
                </div>
             </div>
          </div>

          {/* Commit Actions */}
          <div className="flex items-center justify-between pt-12 border-t border-zinc-100 dark:border-zinc-700/50">
            <div className="flex-1">
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${
                      message.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-500/20"
            >
              {isSaving ? (
                <RefreshCcw className="h-4 w-4 mr-3 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-3" />
              )}
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigManager;
