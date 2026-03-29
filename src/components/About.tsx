import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useExperience, useDashboardStats } from '../hooks/useFirebaseData';
import { usePortfolioConfig } from '../hooks/usePortfolioConfig';
import { useCountAnimation } from '../hooks/useCountAnimation';
import { getTagColorClasses } from '../utils/colors';

const About: React.FC = () => {
  const { experience, loading: expLoading } = useExperience();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { config } = usePortfolioConfig();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const yearsCount = useCountAnimation({ end: config.yearsExperience || 4, duration: 2000, decimals: 0 });
  const projectsCount = useCountAnimation({ end: config.totalProjects || stats.totalProjects || 50, duration: 2200 });
  const clientsCount = useCountAnimation({ end: config.happyClients || 25, duration: 1800 });
  const appsCount = useCountAnimation({ end: config.publishedApps || 15, duration: 2000 });

  React.useEffect(() => {
    if (inView && !statsLoading) {
      setTimeout(() => yearsCount.startAnimation(), 200);
      setTimeout(() => projectsCount.startAnimation(), 400);
      setTimeout(() => clientsCount.startAnimation(), 600);
      setTimeout(() => appsCount.startAnimation(), 800);
    }
  }, [inView, statsLoading]);

  const statsData = [
    { label: 'Years of Experience', value: yearsCount.count + '+', colorClass: 'group-hover:bg-emerald-500/5 hover:border-emerald-500/20', bgClass: 'group-hover:bg-emerald-500/5' },
    { label: 'Enterprise Platforms', value: projectsCount.count + '+', colorClass: 'group-hover:bg-amber-500/5 hover:border-amber-500/20', bgClass: 'group-hover:bg-amber-500/5' },
    { label: 'Happy Clients', value: clientsCount.count + '+', colorClass: 'group-hover:bg-rose-500/5 hover:border-rose-500/20', bgClass: 'group-hover:bg-rose-500/5' },
    { label: 'Published Apps', value: appsCount.count + '+', colorClass: 'group-hover:bg-blue-500/5 hover:border-blue-500/20', bgClass: 'group-hover:bg-blue-500/5' },
  ];

  return (
    <section id="about" className="py-32 bg-surface transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Headline Area */}
        <div className="mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-muted text-sm tracking-widest uppercase mb-6"
          >
            About Me
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary leading-[1.15] max-w-4xl"
          >
            I build mobile experiences that are{' '}
            <span className="italic text-indigo-400/80" style={{ fontStyle: 'italic' }}>precise</span>,{' '}
            <span className="italic text-blue-400/80" style={{ fontStyle: 'italic' }}>performant</span>, and{' '}
            <span className="italic text-emerald-400/80" style={{ fontStyle: 'italic' }}>production-ready</span>.
          </motion.h2>
        </div>

        {/* Two Column Bio + Approach */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              With {config.yearsExperience || 4}+ years of focused Flutter development, I've architected and shipped
              applications across fintech, education, messaging, and e-commerce. Every project
              is an exercise in balancing elegant design with rock-solid engineering.
            </p>
            <p className="text-text-muted leading-relaxed">
              My stack centers on Flutter and Dart, with deep expertise in Firebase, 
              Riverpod state management, REST/GraphQL APIs, and automated CI/CD 
              with Fastlane. I build scalable, offline-first architectures 
              designed for long-term maintainability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-8">
              My Approach
            </h3>
            <div className="space-y-6">
              {['Clean Architecture & MVVM', 'Pixel-perfect UI implementation', 'Offline-first & performance obsession', 'Scalable, testable codebases'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center space-x-4 group"
                >
                  <ArrowRight className="w-4 h-4 text-text-faint group-hover:text-blue-400 transition-colors shrink-0 mt-[2px]" />
                  <span className="text-text-secondary font-medium leading-none">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border rounded-2xl overflow-hidden mb-32"
        >
          {statsData.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-8 md:p-10 text-center relative ${
                i < statsData.length - 1 ? 'border-r border-border' : ''
              } transition-colors duration-500 overflow-hidden group ${stat.colorClass}`}
            >
              <div className={`absolute inset-0 bg-transparent transition-colors duration-500 ${stat.bgClass}`} />
              <div className="text-4xl md:text-5xl font-display font-medium text-text-primary mb-3 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Experience Timeline */}
        {!expLoading && experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-12">
              Experience
            </h3>
            <div className="space-y-0">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-border hover:bg-bg/50 -mx-4 px-4 rounded-lg transition-colors"
                >
                  <div className="md:col-span-3 text-sm text-text-muted font-medium">
                    {exp.period}
                    {exp.current && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Now
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-9">
                    <h4 className="text-lg font-bold text-text-primary tracking-tight mb-1">
                      {exp.position}
                    </h4>
                    <p className="text-text-secondary text-sm mb-3 font-medium">{exp.company}</p>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {exp.company === 'ATIFIY' ? 'Architecting high-stakes mobile infrastructure with a focus on Clean Architecture, MVVM, and Riverpod. Optimized CI/CD pipelines using Fastlane to reduce deployment friction by 40%.' : 
                       exp.company === 'Freelance' ? 'Delivered 10+ cross-platform MVPs for international startups, managing the full lifecycle from requirements gathering to App Store deployment.' : 
                       exp.description}
                    </p>
                    {exp.tech && exp.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tech.map((tech) => (
                          <span 
                            key={tech} 
                            className={`inline-flex items-center px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${getTagColorClasses(tech)}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;