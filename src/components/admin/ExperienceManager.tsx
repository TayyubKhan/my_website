import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building,
  Calendar,
  Clock
} from 'lucide-react';
import { useExperienceAdmin } from '../../hooks/useFirebaseAdmin';
import { Experience } from '../../hooks/useFirebaseData';

const ExperienceManager: React.FC = () => {
  const { experience, addExperience, updateExperience, deleteExperience } = useExperienceAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
    tech: [] as string[],
    current: false,
    order: 0
  });
  const [newTech, setNewTech] = useState('');

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      period: '',
      description: '',
      tech: [],
      current: false,
      order: 0
    });
    setNewTech('');
    setEditingExperience(null);
    setIsFormOpen(false);
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      period: exp.period,
      description: exp.description,
      tech: exp.tech || [],
      current: exp.current,
      order: exp.order
    });
    setEditingExperience(exp);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const experienceData = {
        ...formData,
        createdAt: editingExperience?.createdAt || new Date()
      };
      
      if (editingExperience) {
        await updateExperience(editingExperience.id, experienceData);
      } else {
        await addExperience(experienceData as Omit<Experience, 'id'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[UI] Triggering experience deletion for:', id);
      await deleteExperience(id);
      setDeletingId(null);
    } catch (error) {
      console.error('[UI] Experience deletion failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Experience Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Experience
        </motion.button>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        <AnimatePresence>
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow relative"
            >
              {/* Current Badge */}
              {exp.current && (
                <div className="absolute top-4 right-16">
                  <div className="flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    Current
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(exp)}
                  className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('[UI] Experience trash icon clicked for:', exp.id);
                    setDeletingId(exp.id);
                  }}
                  className={`p-2 transition-colors ${deletingId === exp.id ? 'text-red-500' : 'text-zinc-400 hover:text-red-600'}`}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>

              <AnimatePresence>
                {deletingId === exp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl"
                  >
                    <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">
                      Delete Experience Entry?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="flex-1 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="flex-1 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start space-x-4">
                {/* Timeline Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${exp.current ? 'bg-green-500' : 'bg-blue-500'} border-4 border-white dark:border-zinc-800 shadow-lg`}></div>
                  {index < experience.length - 1 && (
                    <div className="w-0.5 h-16 bg-zinc-200 dark:bg-zinc-700 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                        {exp.position}
                      </h3>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        {exp.company}
                      </div>
                    </div>
                    <div className="flex items-center text-zinc-600 dark:text-zinc-400 font-medium">
                      <Calendar className="h-4 w-4 mr-2" />
                      {exp.period}
                    </div>
                  </div>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Order: {exp.order}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Added: {exp.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-2xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Senior Flutter Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Period *
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 2022 - Present"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Display order"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Technologies Used
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
                            setFormData({ ...formData, tech: [...formData.tech, newTech.trim()] });
                            setNewTech('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., React, Node.js (Press Enter to add)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
                          setFormData({ ...formData, tech: [...formData.tech, newTech.trim()] });
                          setNewTech('');
                        }
                      }}
                      className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tech.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, tech: formData.tech.filter((t) => t !== tech) })}
                          className="ml-2 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-zinc-300 rounded"
                  />
                  <label htmlFor="current" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                    This is my current position
                  </label>
                </div>

                <div className="flex space-x-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingExperience ? 'Update Experience' : 'Create Experience'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceManager;