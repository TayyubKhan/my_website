import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star } from 'lucide-react';
import { useTestimonials } from '../hooks/useFirebaseData';

const Testimonials: React.FC = () => {
  const { testimonials, loading } = useTestimonials();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-32 bg-bg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-surface rounded w-8 mb-8"></div>
                <div className="space-y-3 mb-10">
                  <div className="h-4 bg-surface rounded"></div>
                  <div className="h-4 bg-surface rounded"></div>
                  <div className="h-4 bg-surface rounded w-2/3"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-surface rounded-full mr-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface rounded w-24"></div>
                    <div className="h-2 bg-surface rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-32 bg-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Headline Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-text-muted text-sm tracking-widest uppercase mb-6"
              >
                Social Proof
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary leading-[1.15] max-w-2xl"
              >
                Collaborations that define{' '}
                <span className="italic text-text-muted">excellence</span> and build{' '}
                <span className="italic text-text-muted">lasting value</span>.
              </motion.h2>
            </div>
            
            <motion.a
              href="/feedback"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center px-6 py-4 bg-surface border border-border rounded-xl text-sm font-bold tracking-widest uppercase text-text-primary hover:bg-border transition-colors hover:scale-[1.02] active:scale-95 shrink-0"
            >
              Add Your Testimonial
            </motion.a>
          </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="glass-card p-1 group h-full flex flex-col cursor-default"
            >
              <div className="relative z-10 p-8 flex flex-col h-full bg-surface/20 backdrop-blur-md rounded-[1.4rem] overflow-hidden">
                <div className="accent-glow" style={{ '--accent-color': '#3b82f6', zIndex: -1 } as any} />
                
                {/* Header: Quote Icon & Stars */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-border group-hover:border-border-hover transition-all duration-500 bg-bg/50 shadow-inner">
                    <Quote className="h-5 w-5 text-text-muted group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex space-x-1 bg-bg/40 px-3 py-1.5 rounded-full border border-border shadow-inner mt-1">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500 opacity-90" />
                    ))}
                  </div>
                </div>

                {/* Body: Testimonial Text */}
                <div className="flex-1 mb-8">
                  <p className="text-text-secondary text-[15px] leading-[1.8] font-light group-hover:text-text-primary/90 transition-colors duration-500">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Footer: User Info */}
                <div className="mt-auto pt-6 border-t border-border/40">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name}&background=18181b&color=fff&bold=true`}
                        alt={testimonial.name}
                        className="w-11 h-11 rounded-full object-cover mr-4 ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary tracking-tight">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                          {testimonial.position}
                        </p>
                        {testimonial.company && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border mx-2"></span>
                            <p className="text-text-faint text-[10px] font-bold uppercase tracking-widest">
                              {testimonial.company}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;