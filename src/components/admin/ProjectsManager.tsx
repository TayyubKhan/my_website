import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ExternalLink,
  Github,
  Star,
  Calendar,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { useProjectsAdmin } from '../../hooks/useFirebaseAdmin';
import { Project } from '../../hooks/useFirebaseData';

const ProjectsManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectsAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    tags: [] as string[],
    features: [] as string[],
    metrics: {
      users: '',
      rating: '',
      downloads: ''
    },
    links: {
      github: '',
      live: '',
      demo: ''
    },
    category: '',
    featured: false,
    order: 0
  });
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      image: '',
      tags: [],
      features: [],
      metrics: {
        users: '',
        rating: '',
        downloads: ''
      },
      links: {
        github: '',
        live: '',
        demo: ''
      },
      category: '',
      featured: false,
      order: 0
    });
    setEditingProject(null);
    setIsFormOpen(false);
    setNewTag('');
    setNewFeature('');
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      tags: project.tags,
      features: project.features,
      metrics: project.metrics,
      links: {
        github: project.links.github,
        live: project.links.live,
        demo: project.links.demo || ''
      },
      category: project.category,
      featured: project.featured,
      order: project.order
    });
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        createdAt: editingProject?.createdAt || new Date()
      };
      
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await addProject(projectData as Omit<Project, 'id'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[UI] Triggering project deletion for:', id);
      await deleteProject(id);
      setDeletingId(null);
    } catch (error) {
      console.error('[UI] Project deletion failed:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(feature => feature !== featureToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Projects Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-800/50 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-700/50 hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Project Image Container */}
              <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-zinc-300" />
                  </div>
                )}
                
                {/* Overlay Badges */}
                <div className="absolute top-6 left-6 flex space-x-2">
                  {project.featured && (
                    <div className="flex items-center px-4 py-2 bg-yellow-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-yellow-500/20">
                      <Star className="h-3 w-3 mr-1.5 fill-current" />
                      Featured
                    </div>
                  )}
                  <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {project.category}
                  </div>
                </div>

                {/* Floating Actions */}
                <div className="absolute top-6 right-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(project)}
                    className="p-3 bg-white text-zinc-900 rounded-2xl shadow-xl hover:bg-zinc-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('[UI] Project trash icon clicked for:', project.id);
                      setDeletingId(project.id);
                    }}
                    className={`p-3 rounded-2xl shadow-xl transition-colors ${deletingId === project.id ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>

                  <AnimatePresence>
                    {deletingId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                         <div className="bg-white dark:bg-zinc-800 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-700 shadow-2xl max-w-sm w-full">
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Project?</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Are you sure you want to delete <span className="font-bold">"{project.title}"</span>? This action cannot be undone.</p>
                            <div className="flex space-x-3">
                               <button 
                                 onClick={() => handleDelete(project.id)}
                                 className="flex-1 py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-colors"
                               >
                                 Yes, Delete
                               </button>
                               <button 
                                 onClick={() => setDeletingId(null)}
                                 className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
                               >
                                 Cancel
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        Released {project.createdAt.getFullYear()}
                      </div>
                   </div>
                </div>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3 font-light">
                  {project.description}
                </p>
                
                {/* Technical Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-tight rounded-full transition-colors hover:border-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-3 py-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                      +{project.tags.length - 4} More
                    </span>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-700/50">
                  <div className="flex items-center space-x-4">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        title="Live Site"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.2em]">
                    Order Index {project.order}
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
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-4xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
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
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Project title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., E-commerce, Healthcare"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
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
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Display order"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                        Featured Project
                      </label>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-zinc-900 dark:text-white">Links</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.links.github}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          links: { ...formData.links, github: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Live URL
                      </label>
                      <input
                        type="url"
                        value={formData.links.live}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          links: { ...formData.links, live: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Demo URL
                      </label>
                      <input
                        type="url"
                        value={formData.links.demo}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          links: { ...formData.links, demo: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://demo.example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief project description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Long Description
                    </label>
                    <textarea
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed project description..."
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Technologies/Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Key Features
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-700 rounded-lg"
                      >
                        <span className="text-zinc-900 dark:text-white text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add a feature..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Project Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Users
                      </label>
                      <input
                        type="text"
                        value={formData.metrics.users}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          metrics: { ...formData.metrics, users: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 10K+"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Rating
                      </label>
                      <input
                        type="text"
                        value={formData.metrics.rating}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          metrics: { ...formData.metrics, rating: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 4.8"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Downloads
                      </label>
                      <input
                        type="text"
                        value={formData.metrics.downloads}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          metrics: { ...formData.metrics, downloads: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 50K+"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsManager;