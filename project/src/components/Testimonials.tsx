import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, Send, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useTestimonials, useProjects } from '../hooks/useFirebaseData';
import { TestimonialsLoadingGrid, ErrorState } from './LoadingStates';
import { Tooltip } from 'react-tooltip';

const Testimonials: React.FC = () => {
  const { userId, userName, userPhoto, handleGoogleSignIn, loading: authLoading } = useAuth();
  const { testimonials, loading, error, submitTestimonial, refetch } = useTestimonials();
  const { projects } = useProjects();
  const [newTestimonial, setNewTestimonial] = useState({ text: '', rating: 5, projectId: null as string | null, guestName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!loading && !error && testimonials.length === 0) {
      console.log('No testimonials found. Check Firestore collection "testimonials" and permissions.');
    }
    const initialLikes = { ...likes };
    testimonials.forEach((t) => {
      initialLikes[t.id] = Number(localStorage.getItem(`like_${t.id}`)) || 0;
    });
    setLikes(initialLikes);
  }, [loading, error, testimonials]);

  useEffect(() => {
    console.log('Auth State Updated:', { userId, userName, userPhoto });
  }, [userId, userName, userPhoto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewTestimonial({ ...newTestimonial, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating: number) => {
    setNewTestimonial({ ...newTestimonial, rating });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTestimonial({ ...newTestimonial, projectId: e.target.value || null });
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    console.log('Submitting with Auth:', { userId, userName, userPhoto, guestName: newTestimonial.guestName });

    if (!userId && !newTestimonial.guestName.trim()) {
      setSubmitMessage('Please provide a name or sign in to submit a testimonial.');
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      const result = await submitTestimonial(
        newTestimonial.text,
        newTestimonial.rating,
        newTestimonial.projectId,
        newTestimonial.guestName
      );
      setSubmitMessage(result.message);
      if (result.success) {
        setNewTestimonial({ text: '', rating: 5, projectId: null, guestName: '' });
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await handleGoogleSignIn();
      if (userId && userName && userPhoto) {
        const result = await submitTestimonial(newTestimonial.text, newTestimonial.rating, newTestimonial.projectId);
        setSubmitMessage(result.message);
        if (result.success) {
          setNewTestimonial({ text: '', rating: 5, projectId: null, guestName: '' });
        }
      } else {
        setSubmitMessage('Failed to fetch user profile. Please try signing in again.');
      }
    } catch (e: any) {
      setSubmitMessage(`Sign-in failed: ${e.message}`);
      console.error('Sign-in error:', e);
    }
    setIsSubmitting(false);
  };

  const handleLike = useCallback((id: string) => {
    const newLikes = { ...likes, [id]: (likes[id] || 0) + 1 };
    setLikes(newLikes);
    localStorage.setItem(`like_${id}`, String(newLikes[id]));
  }, [likes]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
    hover: { scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' },
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsLoadingGrid />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState message={error} onRetry={refetch} type="testimonials" />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 font-sans relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            What People Say About Me
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore heartfelt feedback from collaborators across my projects.
          </p>
        </div>

        <div className="space-y-20">
          {/* Testimonials Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Testimonials
            </h3>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {testimonials.map((testimonial, index) => {
                    const project = projects.find(p => p.id === testimonial.projectId);
                    const isExpanded = expandedId === testimonial.id;
                    const displayText = isExpanded ? testimonial.text : `${testimonial.text.slice(0, 100)}${testimonial.text.length > 100 ? '...' : ''}`;

                    return (
                      <motion.div
                        key={testimonial.id || index}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="max-w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100/70 dark:border-gray-800/70 relative overflow-hidden group"
                        role="article"
                        aria-label={`Testimonial by ${testimonial.name || 'Anonymous'}`}
                      >
                        <div className="absolute top-2 left-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center opacity-80">
                          <Quote className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center mb-3 sm:mb-4">
                          <img
                            src={testimonial.image || 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'}
                            alt={testimonial.name || 'Anonymous'}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800 mr-3 sm:mr-4 lazyload"
                            loading="lazy"
                          />
                          <div>
                            <h4 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                              {testimonial.name || 'Anonymous'}
                            </h4>
                            {project && (
                              <div className="flex items-center mt-1">
                                <img
                                  src={project.image || 'https://placehold.co/24x24/A0A0A0/FFFFFF?text=P'}
                                  alt={project.title}
                                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-1 sm:mr-2 object-cover"
                                />
                                <p
                                  className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors duration-200"
                                  data-tooltip-id={`project-${testimonial.id}`}
                                  data-tooltip-content={project.description || 'No description'}
                                >
                                  Worked on: {project.title}
                                </p>
                                <Tooltip id={`project-${testimonial.id}`} place="top" effect="solid" />
                              </div>
                            )}
                          </div>
                        </div>
                        <blockquote className="text-base sm:text-lg italic text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 border-l-4 border-gradient-to-r from-blue-500 to-purple-500 pl-2 sm:pl-3">
                          {displayText}
                          {testimonial.text.length > 100 && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : testimonial.id)}
                              className="text-blue-600 dark:text-blue-400 ml-1 sm:ml-2 hover:underline focus:outline-none"
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </blockquote>
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex space-x-1 sm:space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 sm:h-5 w-4 sm:w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                aria-label={`Rating star ${i + 1} of 5`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => handleLike(testimonial.id)}
                            className="flex items-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                            aria-label={`Like testimonial, currently ${likes[testimonial.id] || 0} likes`}
                          >
                            <ThumbsUp className="h-3 sm:h-4 w-3 sm:w-4 mr-0.5 sm:mr-1" />
                            {likes[testimonial.id] || 0}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-center text-2xl text-slate-600 dark:text-slate-400">
                No testimonials yet. Share your experience to get started!
              </p>
            )}
          </div>

          {/* Send Testimonial Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Send a Testimonial
            </h3>
            <form onSubmit={handleSubmitTestimonial} className="space-y-8">
              {!userId && (
                <div>
                  <label htmlFor="guestName" className="block text-xl font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Your Name
                  </label>
                  <input
                    id="guestName"
                    name="guestName"
                    type="text"
                    className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your name"
                    value={newTestimonial.guestName}
                    onChange={handleInputChange}
                    aria-label="Guest name input"
                  />
                </div>
              )}
              <div>
                <label htmlFor="testimonialText" className="block text-xl font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Your Message
                </label>
                <textarea
                  id="testimonialText"
                  name="text"
                  rows={6}
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Share your thoughts about working with me..."
                  value={newTestimonial.text}
                  onChange={handleInputChange}
                  required
                  aria-label="Testimonial message input"
                ></textarea>
              </div>

              <div>
                <label htmlFor="testimonialProject" className="block text-xl font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Project We Worked On
                </label>
                <select
                  id="testimonialProject"
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={newTestimonial.projectId || ''}
                  onChange={handleProjectChange}
                  aria-label="Select project we worked on"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="testimonialRating" className="block text-xl font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Rating
                </label>
                <div className="flex space-x-3" role="radiogroup" aria-label="Rating selection">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      className={`h-10 w-10 cursor-pointer transition-colors duration-200 ${
                        starValue <= newTestimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      onClick={() => handleRatingChange(starValue)}
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleRatingChange(starValue)}
                      aria-label={`Rate ${starValue} out of 5`}
                    />
                  ))}
                </div>
              </div>

              {submitMessage && (
                <p
                  className={`text-center text-lg ${
                    submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}
                  role="alert"
                >
                  {submitMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {!userId && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    disabled={authLoading}
                    aria-label="Sign in with Google"
                  >
                    Sign In with Google
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                  disabled={isSubmitting || !newTestimonial.text.trim() || (!userId && !newTestimonial.guestName.trim())}
                  aria-label="Submit testimonial"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-7 w-7 mr-3" />
                      Submit Testimonial
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;