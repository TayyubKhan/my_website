import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Layers, 
  Zap, 
  Cloud, 
  Globe, 
  Code, 
  Terminal, 
  Settings, 
  Shield, 
  Database,
  Smartphone
} from 'lucide-react';
import { SkillsLoadingGrid } from './LoadingStates';
import { useSkills } from '../hooks/useFirebaseData';
import { Skill } from '../hooks/useFirebaseData';

const iconMap: Record<string, any> = {
  'Layers': Layers,
  'Zap': Zap,
  'Cloud': Cloud,
  'Globe': Globe,
  'Terminal': Terminal,
  'Settings': Settings,
  'Shield': Shield,
  'Database': Database,
  'Code': Code,
  'Smartphone': Smartphone
};

const getSeniorityBadge = (level: number) => {
  if (level >= 95) return 'Architect';
  if (level >= 90) return 'Lead Engineer';
  if (level >= 80) return 'Expert';
  return 'Advanced';
};

const SkillCard = ({ skill, index }: { skill: Skill, index: number }) => {
  const Icon = iconMap[skill.icon] || Code;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-1 group h-full cursor-default"
    >
      <div className="accent-glow" style={{ '--accent-color': skill.color === 'bg-blue-500' ? '#3b82f6' : skill.color === 'bg-purple-500' ? '#a855f7' : '#ef4444' } as any} />
      
      <div className="relative z-10 p-8 flex flex-col h-full bg-surface/20 backdrop-blur-md rounded-[1.4rem]">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border group-hover:border-border-hover transition-all duration-500 bg-bg/50 shadow-inner">
            <Icon className="h-7 w-7 text-text-muted group-hover:text-text-primary transition-colors" />
          </div>
          <div className="px-4 py-1.5 rounded-full bg-accent border border-accent/20 shadow-lg shadow-accent/10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-text group-hover:bg-accent-muted transition-colors">
            {getSeniorityBadge(skill.level)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-display font-medium text-text-primary tracking-tight mb-2 group-hover:tracking-normal transition-all duration-500">
            {skill.title}
          </h3>
          <p className="text-text-muted text-xs font-bold uppercase tracking-[0.15em] mb-4">
            {skill.yearsOfExperience || '4+ Years Experience'}
          </p>
          <p className="text-text-secondary text-[13px] leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
            {skill.description}
          </p>
        </div>

        {/* Footer - Specialties */}
        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {(skill.specialties || []).map((specialty, i) => (
              <span 
                key={i}
                className="px-2.5 py-1 rounded bg-surface/50 border border-border text-[10px] font-medium text-text-secondary group-hover:border-text-muted group-hover:text-text-primary transition-colors"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { skills, loading } = useSkills();

  const categories = [
    { id: 'Architecture', label: 'Architecture & Design', icon: Layers },
    { id: 'State Management', label: 'State & Logic', icon: Zap },
    { id: 'Ecosystem', label: 'Platform & Ecosystem', icon: Globe },
    { id: 'DevOps', label: 'Delivery & DevOps', icon: Terminal },
  ];

  return (
    <section id="skills" className="py-32 bg-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Grids & Decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.02] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/[0.02] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Headline Area */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4 mb-8"
          >
            <div className="h-px w-12 bg-text-muted/30" />
            <span className="text-text-muted text-xs font-bold tracking-[0.4em] uppercase">
              Expertise
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-8xl font-display font-medium text-text-primary leading-[1] tracking-tighter"
          >
            Building <span className="italic text-text-muted/80">exceptional</span> mobile products with <span className="italic text-text-muted/80">technical</span> precision.
          </motion.h2>
        </div>

        {loading ? (
          <SkillsLoadingGrid />
        ) : (
          <div className="space-y-40">
            {categories.map((category) => {
              const categorySkills = skills.filter(s => s.category === category.id);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-end justify-between mb-16 border-b border-border/50 pb-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted">
                        <category.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-medium text-text-primary uppercase tracking-widest italic opacity-60">
                          {category.label}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categorySkills.map((skill, index) => (
                      <SkillCard key={skill.id} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Other Expertise */}
            {(() => {
              const otherSkills = skills.filter(s => !categories.find(c => c.id === s.category));
              if (otherSkills.length === 0) return null;

              return (
                <div>
                  <div className="flex items-end justify-between mb-16 border-b border-border/50 pb-8">
                     <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted">
                        <Code className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-display font-medium text-text-primary uppercase tracking-widest italic opacity-60">
                        Other Capabilities
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherSkills.map((skill, index) => (
                      <SkillCard key={skill.id} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;