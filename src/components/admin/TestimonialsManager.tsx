import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Star,
  User,
  Calendar,
} from 'lucide-react';
import { useTestimonialsAdmin } from '../../hooks/useFirebaseAdmin';
import { Testimonial } from '../../hooks/useFirebaseData';

const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonialsAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    image: '',
    rating: 5,
    text: '',
    featured: false,
    order: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      image: '',
      rating: 5,
      text: '',
      featured: false,
      order: 0
    });
    setEditingTestimonial(null);
    setIsFormOpen(false);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      image: testimonial.image,
      rating: testimonial.rating,
      text: testimonial.text,
      featured: testimonial.featured,
      order: testimonial.order
    });
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const testimonialData = {
        ...formData,
        createdAt: editingTestimonial?.createdAt || new Date()
      };
      
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
      } else {
        await addTestimonial(testimonialData as Omit<Testimonial, 'id'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[UI] Triggering testimonial deletion for:', id);
      await deleteTestimonial(id);
      setDeletingId(null);
    } catch (error) {
      console.error('[UI] Testimonial deletion failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Testimonials Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Testimonial
        </motion.button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-zinc-800/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700/50 hover:shadow-xl transition-all relative group overflow-hidden"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                     testimonial.featured 
                       ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' 
                       : 'bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                   }`}>
                     {testimonial.featured ? 'Featured' : 'Standard'}
                   </div>
                   {/* We can add a "Pending" status if we add that field to the model, 
                       for now let's assume all in DB are approved but some are featured */}
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('[UI] Testimonial trash icon clicked for:', testimonial.id);
                      setDeletingId(testimonial.id);
                    }}
                    className={`p-2 transition-colors ${deletingId === testimonial.id ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {deletingId === testimonial.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl"
                  >
                    <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">
                      Delete Testimonial?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="flex-1 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="flex-1 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Client Profile */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 overflow-hidden p-1">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                       <User className="h-8 w-8 text-zinc-400" />
                    </div>
                  )}
                </div>
                <div>
                   <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                     {testimonial.name}
                   </h3>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                     {testimonial.position} @ <span className="text-zinc-900 dark:text-white">{testimonial.company}</span>
                   </p>
                </div>
              </div>

              {/* Interaction Controls */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                 <button 
                   onClick={() => updateTestimonial(testimonial.id, { featured: !testimonial.featured })}
                   className={`flex items-center justify-center py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                     testimonial.featured 
                       ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' 
                       : 'bg-zinc-50 dark:bg-zinc-700/30 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                   }`}
                 >
                   <Star className={`w-3 h-3 mr-2 ${testimonial.featured ? 'fill-current' : ''}`} />
                   {testimonial.featured ? 'Featured' : 'Feature'}
                 </button>
                 <div className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-700/30 rounded-2xl p-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-zinc-200 dark:text-zinc-600'
                        }`}
                      />
                    ))}
                 </div>
              </div>

              {/* Testimonial Message */}
              <blockquote className="relative mb-8">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed italic line-clamp-4">
                  "{testimonial.text}"
                </p>
              </blockquote>

              {/* Bottom Metadata */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-700/50">
                <div className="flex items-center text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {testimonial.createdAt.getFullYear()}
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                  Slot #{testimonial.order}
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
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                  {/* Client Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Client name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Job title"
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
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Profile Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Rating *
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                rating <= formData.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-zinc-300 dark:text-zinc-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {formData.rating}/5
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Display order"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-zinc-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                        Featured Testimonial
                      </label>
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Testimonial Text *
                  </label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="What did the client say about your work..."
                  />
                </div>

                <div className="flex space-x-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
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

export default TestimonialsManager;