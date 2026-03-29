import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Plus,
  Code,
  Briefcase,
  TrendingUp,
  Activity,
  MessageSquare,
  Award,
  Star,
  Eye,
  UserCheck,
  Layers,
  Globe,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardStats } from '../../hooks/useFirebaseData';
import { useCountAnimation } from '../../hooks/useCountAnimation';
import SkillsManager from './SkillsManager';
import ProjectsManager from './ProjectsManager';
import ExperienceManager from './ExperienceManager';
import ConfigManager from './ConfigManager';
import MessagesManager from './MessagesManager';

type TabType = 'overview' | 'messages' | 'skills' | 'projects' | 'testimonials' | 'experience' | 'config';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user, logout } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'messages', label: 'Inbox', icon: Inbox },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'config', label: 'General', icon: Settings },
  ];

  // Animated counters
  const skillsCount = useCountAnimation({ end: stats.totalSkills, duration: 1500 });
  const projectsCount = useCountAnimation({ end: stats.totalProjects, duration: 1800 });
  const testimonialsCount = useCountAnimation({ end: stats.totalTestimonials, duration: 1600 });
  const experienceCount = useCountAnimation({ end: stats.totalExperience, duration: 1400 });
  const viewsCount = useCountAnimation({ end: stats.portfolioViews, duration: 2200 });
  const sessionsCount = useCountAnimation({ end: stats.activeSessions, duration: 1700 });
  const featuredCount = useCountAnimation({ end: stats.featuredProjects, duration: 1500 });
  const ratingCount = useCountAnimation({ end: stats.averageRating, duration: 1900, decimals: 1 });

  React.useEffect(() => {
    if (!statsLoading && activeTab === 'overview') {
      // Start animations with delays
      setTimeout(() => skillsCount.startAnimation(), 200);
      setTimeout(() => projectsCount.startAnimation(), 400);
      setTimeout(() => testimonialsCount.startAnimation(), 600);
      setTimeout(() => experienceCount.startAnimation(), 800);
      setTimeout(() => viewsCount.startAnimation(), 1000);
      setTimeout(() => sessionsCount.startAnimation(), 1200);
      setTimeout(() => featuredCount.startAnimation(), 1400);
      setTimeout(() => ratingCount.startAnimation(), 1600);
    }
  }, [statsLoading, activeTab]);

  const statsData = [
    { label: 'Total Projects', value: projectsCount.count, change: '+1', changeType: 'positive', icon: FolderOpen, color: 'text-zinc-900 dark:text-white' },
    { label: 'Total Skills', value: skillsCount.count, change: '+2', changeType: 'positive', icon: Code, color: 'text-zinc-900 dark:text-white' },
    { label: 'Testimonials', value: testimonialsCount.count, change: '+3', changeType: 'positive', icon: MessageSquare, color: 'text-zinc-900 dark:text-white' },
    { label: 'Portfolio Views', value: viewsCount.count.toLocaleString(), change: '+12%', changeType: 'positive', icon: Eye, color: 'text-zinc-900 dark:text-white' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4 md:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    {stat.change && (
                       <span className="text-[10px] font-bold text-green-500 tracking-wider">
                         {stat.change}
                       </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* Left Column: Activity & Quick Actions */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                {/* Needs Attention */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="bg-zinc-900 dark:bg-zinc-800 p-8 rounded-3xl border border-zinc-800 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Activity className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Systems Online.</h2>
                    <p className="text-zinc-400 text-sm mb-8 font-light max-w-sm">
                      Your portfolio is healthy. You have {testimonialsCount.count > 0 ? 'active' : 'no'} testimonials and {featuredCount.count} featured projects.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setActiveTab('testimonials')}
                        className="px-6 py-3 bg-white text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Review Testimonials
                      </button>
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="px-6 py-3 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors"
                      >
                        Update Projects
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Activity Feed */}
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700/50">
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Recent Activity</h3>
                      <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors">View All</button>
                   </div>
                   <div className="space-y-6">
                      {[
                        { action: 'Technical Update', item: 'Modified Skill Model', time: 'Just now', icon: Zap, color: 'text-yellow-500' },
                        { action: 'Review Pending', item: 'Testimonial Moderation Enabled', time: '2 hours ago', icon: MessageSquare, color: 'text-zinc-400' },
                        { action: 'System Sync', item: 'Config Engine Updated', time: '1 day ago', icon: Briefcase, color: 'text-zinc-400' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start space-x-6">
                           <div className={`mt-1 ${activity.color}`}>
                              <activity.icon className="w-4 h-4" />
                           </div>
                           <div className="flex-1 pb-6 border-b border-zinc-100 dark:border-zinc-700/50 last:border-0 last:pb-0">
                              <p className="text-sm text-zinc-900 dark:text-white font-medium mb-1">
                                {activity.action}: <span className="font-light text-zinc-500">{activity.item}</span>
                              </p>
                              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">{activity.time}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Right Column: Tools & Quick Stats */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700/50">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-8">Quick Management</h3>
                    <div className="space-y-4">
                       {[
                         { label: 'Global Settings', tab: 'config', icon: Settings },
                         { label: 'Experience Hub', tab: 'experience', icon: Award },
                         { label: 'Technical Skills', tab: 'skills', icon: Code },
                       ].map((tool) => (
                         <button
                           key={tool.label}
                           onClick={() => setActiveTab(tool.tab as TabType)}
                           className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/30 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-600 transition-all group"
                         >
                           <div className="flex items-center space-x-4">
                              <tool.icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">{tool.label}</span>
                           </div>
                           <TrendingUp className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return <MessagesManager />;
      case 'skills':
        return <SkillsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'config':
        return <ConfigManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      {/* Integrated Minimal Sidebar + Main */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-border">
          <div className="p-10">
            <h1 className="text-xl font-bold text-text-primary tracking-tighter flex items-center">
              <Code className="mr-3 w-5 h-5 text-text-muted" /> Admin.
            </h1>
          </div>
          
          <nav className="flex-1 px-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 text-sm ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-zinc-500/10'
                    : 'text-text-muted hover:text-text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <tab.icon className={`h-4 w-4 mr-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`} />
                <span className="font-medium tracking-tight">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-8 border-t border-border mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center px-6 py-4 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 text-sm font-medium"
            >
              <LogOut className="h-4 w-4 mr-4 opacity-40" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto bg-bg custom-scrollbar">
          <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border h-24 flex items-center">
             <div className="w-full max-w-7xl mx-auto px-10 flex items-center justify-between">
                <div>
                   <h2 className="text-lg font-bold text-text-primary tracking-tight">
                     {tabs.find(t => t.id === activeTab)?.label}
                   </h2>
                   <p className="text-[10px] font-bold text-text-faint uppercase tracking-widest mt-1">Management Console</p>
                </div>
                
                <div className="flex items-center space-x-6">
                   <a 
                     href="/" 
                     target="_blank"
                     className="px-5 py-2.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary hover:border-text-muted transition-all flex items-center"
                   >
                     <Eye className="w-3 h-3 mr-2" /> View Site
                   </a>
                   <div className="hidden md:flex items-center space-x-4 pl-6 border-l border-border">
                      <div className="text-right">
                         <p className="text-xs font-bold text-text-primary">{user?.email?.split('@')[0]}</p>
                         <p className="text-[10px] text-text-faint font-medium">Administrator</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-surface border border-border overflow-hidden p-1">
                         <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500">
                            <span className="text-xs font-bold uppercase">{user?.email?.[0]}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </header>

          <div className="p-10 max-w-7xl mx-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
               >
                 {renderContent()}
               </motion.div>
             </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;