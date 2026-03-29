import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, CheckCircle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

const TestimonialForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    image: '',
    rating: 5,
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'testimonials'), {
        ...formData,
        featured: false,
        order: 0,
        status: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      toast.success('Thank you! Your testimonial has been submitted for review.');
      setIsSubmitted(true);
      
      setTimeout(() => {
        setFormData({ name: '', position: '', company: '', email: '', image: '', rating: 5, text: '' });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const inputClasses = "w-full px-0 py-4 bg-transparent border-b border-surface text-text-primary placeholder:text-text-faint focus:border-text-secondary focus:outline-none transition-colors text-sm";

  if (isSubmitted) {
    return (
      <section id="testimonial-form" className="py-32 bg-surface transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 border border-border rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="h-8 w-8 text-text-primary" />
            </motion.div>
            <h2 className="text-3xl font-display font-medium text-text-primary mb-4">
              Thank You.
            </h2>
            <p className="text-text-muted mb-6">
              Your testimonial has been submitted. I'll review it and it will appear on the site soon.
            </p>
            <div className="text-text-faint text-sm">
              Redirecting back in a few seconds...
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonial-form" className="py-32 bg-surface transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-text-primary mb-4">
            Leave a Testimonial.
          </h2>
          <p className="text-text-muted text-sm tracking-widest uppercase mb-6">Share Your Experience</p>
          <p className="text-text-muted max-w-lg mx-auto">
            Worked with me? Your feedback helps me grow and helps others understand the value I provide.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Your Name *" />
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="Email *" />
              <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} required className={inputClasses} placeholder="Your Position *" />
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={inputClasses} placeholder="Company" />
            </div>

            <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} className={inputClasses} placeholder="Profile Image URL (Optional)" />

            {/* Rating */}
            <div className="py-6">
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= formData.rating
                          ? 'text-text-primary fill-current'
                          : 'text-surface-alt'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-sm text-text-muted">
                  {formData.rating}/5
                </span>
              </div>
            </div>

            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputClasses} resize-none`}
              placeholder="Share your experience working with me..."
            />

            {/* Privacy */}
            <div className="py-6">
              <p className="text-text-faint text-xs">
                <strong className="text-text-muted">Privacy:</strong> Your testimonial will be reviewed before publishing. Your email will not be displayed publicly.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className="w-full bg-accent text-bg font-medium py-4 px-6 text-sm tracking-wide hover:bg-accent-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-3" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialForm;