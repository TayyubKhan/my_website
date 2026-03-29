import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Users, Star, Download, ChevronRight } from 'lucide-react';
import { Project } from '../hooks/useFirebaseData';
import { getTagColorClasses } from '../utils/colors';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-surface rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-border"
          >
            {/* Close Button (Mobile Floating) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Area */}
            <div className="md:w-1/2 relative bg-bg flex items-center justify-center p-6 md:p-12 border-b md:border-b-0 md:border-r border-border min-h-[30vh] md:min-h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-surface to-bg z-0" />
              <img
                src={project.image}
                alt={project.title}
                className="relative z-10 w-full max-h-full object-contain filter drop-shadow-2xl rounded-xl"
              />
            </div>

            {/* Right Column: Details Area */}
            <div className="md:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar bg-surface/50">
              <div className="p-6 md:p-10 flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">
                      {project.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-medium text-text-primary tracking-tight mb-4">
                      {project.title}
                    </h2>
                  </div>
                  {/* Close Button (Desktop) */}
                  <button
                    onClick={onClose}
                    className="hidden md:flex p-2 text-text-muted hover:text-text-primary hover:bg-border rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Metrics */}
                {project.metrics && (project.metrics.users || project.metrics.rating || project.metrics.downloads) && (
                  <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl glass-card bg-surface/30">
                    {project.metrics.users && (
                      <div className="flex items-center text-sm font-medium text-text-secondary">
                        <Users className="w-4 h-4 mr-2 text-indigo-400" />
                        {project.metrics.users} Users
                      </div>
                    )}
                    {project.metrics.rating && (
                      <div className="flex items-center text-sm font-medium text-text-secondary">
                        <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                        {project.metrics.rating} Rating
                      </div>
                    )}
                    {project.metrics.downloads && (
                      <div className="flex items-center text-sm font-medium text-text-secondary">
                        <Download className="w-4 h-4 mr-2 text-emerald-400" />
                        {project.metrics.downloads}+
                      </div>
                    )}
                  </div>
                )}

                {/* Long Description */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">Overview</h3>
                  <p className="text-text-secondary leading-relaxed font-light">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-text-secondary text-sm leading-relaxed">
                          <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-2.5 py-1 border rounded uppercase tracking-wider ${getTagColorClasses(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 md:p-10 border-t border-border bg-bg/50 flex flex-wrap gap-4 sticky bottom-0">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-text-primary text-bg font-medium rounded-xl hover:bg-text-secondary transition-colors"
                  >
                    View Live <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 border border-border text-text-primary font-medium rounded-xl hover:bg-surface transition-colors"
                  >
                    Source Code <Github className="ml-2 w-4 h-4" />
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 border border-border text-text-primary font-medium rounded-xl hover:bg-surface transition-colors"
                  >
                    Video Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
