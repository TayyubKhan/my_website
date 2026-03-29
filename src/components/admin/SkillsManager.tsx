import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Zap, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Globe2,
  Code, 
  Smartphone, 
  Database, 
  Cloud, 
  Settings,
  Layers,
  Terminal,
  Save
} from 'lucide-react';

const SKILL_TEMPLATES = [
  {
    category: 'Architecture',
    skills: [
      { title: 'Clean Architecture', level: 95, icon: 'Layers', color: 'bg-blue-500', yearsOfExperience: '4+ Years', specialties: ['SOLID', 'TDD', 'Domain Driven'], description: 'Separating Domain, Data, and Presentation for scalable systems.' },
      { title: 'Modular Architecture', level: 92, icon: 'Terminal', color: 'bg-blue-600', yearsOfExperience: '3+ Years', specialties: ['Micro-apps', 'Melos', 'Packages'], description: 'Decoupling features into independent, reusable modules.' },
      { title: 'Advanced DI', level: 98, icon: 'Zap', color: 'bg-purple-500', yearsOfExperience: '4+ Years', specialties: ['Riverpod', 'GetIt', 'Compile-time Safety'], description: 'Loose coupling with reactive dependency injection patterns.' }
    ]
  },
  {
    category: 'Performance',
    skills: [
      { title: 'Impeller Optimization', level: 90, icon: 'Cpu', color: 'bg-emerald-500', yearsOfExperience: '2+ Years', specialties: ['Shader Jitters', 'Metal/Vulkan'], description: 'Eliminating shader compilation jank with Flutters new engine.' },
      { title: 'Rendering Pipeline', level: 94, icon: 'Layers', color: 'bg-emerald-600', yearsOfExperience: '4+ Years', specialties: ['RepaintBoundary', 'Isolates', 'UI/Raster Threads'], description: 'Granular control over rebuilds and offloading heavy tasks.' },
    ]
  },
  {
    category: 'Security',
    skills: [
      { title: 'Secured Persistence', level: 96, icon: 'ShieldCheck', color: 'bg-amber-500', yearsOfExperience: '3+ Years', specialties: ['Biometrics', 'AES-256', 'KeyChain'], description: 'Protecting user data with encrypted local storage strategies.' },
      { title: 'Secure Networking', level: 92, icon: 'Globe2', color: 'bg-amber-600', yearsOfExperience: '4+ Years', specialties: ['SSL Pinning', 'OAuth2', 'JWT'], description: 'Hardening API communications against MITM and interception.' },
    ]
  }
];

import { useSkillsAdmin } from '../../hooks/useFirebaseAdmin';
import { Skill } from '../../hooks/useFirebaseData';

const iconOptions = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Cloud', label: 'Cloud', icon: Cloud },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Zap', label: 'Zap', icon: Zap },
];

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue', color: '#3B82F6' },
  { value: 'bg-green-500', label: 'Green', color: '#10B981' },
  { value: 'bg-purple-500', label: 'Purple', color: '#8B5CF6' },
  { value: 'bg-red-500', label: 'Red', color: '#EF4444' },
  { value: 'bg-yellow-500', label: 'Yellow', color: '#F59E0B' },
  { value: 'bg-orange-500', label: 'Orange', color: '#F97316' },
];

const SkillsManager: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = useSkillsAdmin();

  const categories = [
    'Architecture',
    'State Management',
    'Ecosystem',
    'DevOps'
  ];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    level: 90,
    yearsOfExperience: '4+ Years',
    specialties: [] as string[],
    description: '',
    icon: 'Layers',
    color: 'bg-blue-500',
    category: 'Architecture',
    order: 0
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      level: 90,
      yearsOfExperience: '4+ Years',
      specialties: [],
      description: '',
      icon: 'Layers',
      color: 'bg-blue-500',
      category: 'Architecture',
      order: 0
    });
    setEditingSkill(null);
    setIsFormOpen(false);
    setNewSpecialty('');
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      title: skill.title,
      level: skill.level,
      yearsOfExperience: skill.yearsOfExperience || '4+ Years',
      specialties: skill.specialties || [],
      description: skill.description,
      icon: skill.icon,
      color: skill.color,
      category: skill.category,
      order: skill.order
    });
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData);
      } else {
        await addSkill(formData as Omit<Skill, 'id'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[UI] Triggering deletion for:', id);
      await deleteSkill(id);
      setDeletingId(null);
    } catch (error) {
      console.error('[UI] Deletion failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Skills Management
        </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Skill
          </motion.button>
        </div>

      {/* Template Gallery */}
      <div className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[10px]">
              Quick-Add Senior Stack
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
              Instantly populate your portfolio with researched professional expertise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKILL_TEMPLATES.map((group) => (
            <div key={group.category} className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
                {group.category}
              </h4>
              <div className="space-y-2">
                {group.skills.map((template) => {
                  const alreadyAdded = skills.some(s => s.title === template.title);
                  // Map icon name to Lucide component
                  const IconComponent = 
                    template.icon === 'Layers' ? Layers :
                    template.icon === 'Terminal' ? Terminal :
                    template.icon === 'Zap' ? Zap :
                    template.icon === 'Cpu' ? Cpu :
                    template.icon === 'ShieldCheck' ? ShieldCheck :
                    template.icon === 'Globe2' ? Globe2 :
                    TrendingUp;
                  return (
                    <motion.button
                      key={template.title}
                      whileHover={!alreadyAdded ? { x: 4 } : {}}
                      onClick={async () => {
                        if (alreadyAdded) return;
                        await addSkill(template as any);
                      }}
                      disabled={alreadyAdded}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        alreadyAdded 
                          ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 opacity-60 grayscale' 
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg ${template.color} text-white flex items-center justify-center`}>
                           <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold leading-none ${alreadyAdded ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                            {template.title}
                          </p>
                          <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-tight">
                            Template
                          </p>
                        </div>
                      </div>
                      {alreadyAdded ? (
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                          Added
                        </div>
                      ) : (
                        <Plus className="h-4 w-4 text-zinc-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {skills.map((skill) => {
            const IconComponent = iconOptions.find(opt => opt.value === skill.icon)?.icon || Code;
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${skill.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(skill)}
                      className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('[UI] Trash icon clicked for:', skill.id);
                        setDeletingId(skill.id);
                      }}
                      className={`p-2 transition-colors ${deletingId === skill.id ? 'text-red-500' : 'text-zinc-400 hover:text-red-600'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {deletingId === skill.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl"
                    >
                      <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">
                        Confirm Deletion?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="flex-1 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Yes, Delete
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
                
                 <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {skill.title}
                  </h3>
                  <div className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[8px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {skill.level >= 95 ? 'Architect' : skill.level >= 90 ? 'Lead' : 'Expert'}
                  </div>
                </div>
                
                <p className="text-zinc-500 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-3">
                  {skill.yearsOfExperience || '4+ Years Experience'}
                </p>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-xs mb-4 line-clamp-2">
                  {skill.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(skill.specialties || []).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-500">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  <span>{skill.category}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{skill.level}%</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Flutter Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the skill..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 4+ Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Proficiency Level ({formData.level}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Specialties (Stack)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.specialties.map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center">
                        {s}
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, specialties: formData.specialties.filter((_, idx) => idx !== i) })}
                          className="ml-1.5 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSpecialty.trim()) {
                            setFormData({ ...formData, specialties: [...formData.specialties, newSpecialty.trim()] });
                            setNewSpecialty('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Add specialty (Enter to add)..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSpecialty.trim()) {
                          setFormData({ ...formData, specialties: [...formData.specialties, newSpecialty.trim()] });
                          setNewSpecialty('');
                        }
                      }}
                      className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: option.value })}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400'
                        }`}
                      >
                        <option.icon className="h-6 w-6 mx-auto text-zinc-600 dark:text-zinc-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: option.value })}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          formData.color === option.value
                            ? 'border-zinc-900 dark:border-white scale-110'
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                        style={{ backgroundColor: option.color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Display order"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingSkill ? 'Update' : 'Create'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
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

export default SkillsManager;