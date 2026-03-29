import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { ProjectsLoadingGrid } from './LoadingStates';
import { useProjects, Project } from '../hooks/useFirebaseData';
import { getTagColorClasses } from '../utils/colors';
import ProjectModal from './ProjectModal';

const categories = ["All", "Mobile App", "Security", "Education"];

const Projects = () => {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="projects" className="py-32 bg-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Headline Area */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-text-muted text-sm tracking-widest uppercase mb-6"
            >
              Selected Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary leading-[1.15] max-w-2xl"
            >
              Building digital products with{' '}
              <span className="italic text-text-muted" style={{ fontStyle: 'italic' }}>meaning</span> and{' '}
              <span className="italic text-text-muted" style={{ fontStyle: 'italic' }}>impact</span>.
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-x-8 gap-y-4"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all pb-2 border-b-2 ${
                  filter === cat 
                    ? 'border-indigo-500/50 text-indigo-400' 
                    : 'border-transparent text-text-faint hover:text-text-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <ProjectsLoadingGrid />
        ) : (
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="group flex flex-col h-full bg-surface/30 backdrop-blur-sm rounded-2xl border border-border hover:border-border-hover transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-bg flex items-center justify-center p-6 border-b border-border transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-surface to-bg opacity-50 z-0" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="relative z-10 w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 lg:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-text-primary tracking-tight group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex space-x-4">
                        <a 
                          href={project.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-text-faint hover:text-text-primary transition-colors p-1"
                          title="View Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a 
                          href={project.links.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-text-faint hover:text-text-primary transition-colors p-1"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary text-sm leading-relaxed mb-6 font-light line-clamp-3">
                      {project.title === 'Linkup' ? 'Engineered a low-latency P2P mesh network using Bluetooth connectivity and SQLite for offline persistence, enabling communication in zero-coverage environments.' :
                       project.title === 'Qudwa' ? 'Integrated LLM-based chatbots and encrypted Firebase real-time sync to provide a secure, AI-driven educational experience for 5k+ active users.' :
                       project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-2 mb-8 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-medium px-2 py-1 border rounded uppercase tracking-wider transition-colors ${getTagColorClasses(tag)}`}>
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                       <span className="text-[10px] font-bold text-text-faint uppercase tracking-widest">{project.category}</span>
                       <span className="flex items-center text-[10px] font-bold text-blue-400/90 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                         View Details <ArrowUpRight className="ml-1 w-3 h-3" />
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={selectedProject !== null} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};

export default Projects;