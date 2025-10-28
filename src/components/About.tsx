import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Award, Users, Code2, TrendingUp } from 'lucide-react';
import { useExperience, useDashboardStats } from '../hooks/useFirebaseData';
import { useCountAnimation } from '../hooks/useCountAnimation';

const About: React.FC = () => {
  const { experience, loading: expLoading } = useExperience();
  const { stats, loading: statsLoading } = useDashboardStats();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Animated counters
  const yearsCount = useCountAnimation({ end: 3.5, duration: 2000, decimals: 1 });
  const projectsCount = useCountAnimation({ end: stats.totalProjects || 50, duration: 2200 });
  const clientsCount = useCountAnimation({ end: 25, duration: 1800 });
  const appsCount = useCountAnimation({ end: 15, duration: 2000 });

  React.useEffect(() => {
    if (inView && !statsLoading) {
      setTimeout(() => yearsCount.startAnimation(), 200);
      setTimeout(() => projectsCount.startAnimation(), 400);
      setTimeout(() => clientsCount.startAnimation(), 600);
      setTimeout(() => appsCount.startAnimation(), 800);
    }
  }, [inView, statsLoading]);

  const statsData = [
    {
      icon: <Calendar className="h-8 w-8" />,
      label: 'Years Experience',
      value: yearsCount.count.toFixed(1) + '+',
      color: 'bg-blue-500'
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      label: 'Projects Completed',
      value: projectsCount.count + '+',
      color: 'bg-green-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      label: 'Happy Clients',
      value: clientsCount.count + '+',
      color: 'bg-purple-500'
    },
    {
      icon: <Award className="h-8 w-8" />,
      label: 'Apps Published',
      value: appsCount.count + '+',
      color: 'bg-orange-500'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            About Me
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Passionate about creating exceptional mobile experiences through clean code and innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              My Journey
            </h3>
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I'm a passionate Flutter Developer with over 3.5 years of experience building 
                high-quality mobile applications. My journey began with a fascination for 
                mobile technology and has evolved into a career focused on creating exceptional 
                user experiences.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I specialize in cross-platform development using Flutter, with expertise in 
                Firebase integration, state management, and performance optimization. I believe 
                in writing clean, maintainable code and following best practices to deliver 
                scalable solutions.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing 
                to open-source projects, or mentoring aspiring developers. I'm always excited 
                to take on new challenges and collaborate with innovative teams.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  delay: 0.6 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/50 dark:to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.color} text-white mb-4 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Section */}
        {!expLoading && experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 text-center">
              Professional Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    x: 10,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Current indicator */}
                  {exp.current && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        Current
                      </div>
                    </div>
                  )}

                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                          {exp.position}
                        </h4>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 font-medium mt-2 md:mt-0">
                        {exp.period}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {exp.description}
                    </p>
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