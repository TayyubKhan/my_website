import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardStats } from '../../hooks/useFirebaseData';
import { useCountAnimation } from '../../hooks/useCountAnimation';
import SkillsManager from './SkillsManager';
import ProjectsManager from './ProjectsManager';
import TestimonialsManager from './TestimonialsManager';
import ExperienceManager from './ExperienceManager';

type TabType = 'overview' | 'skills' | 'projects' | 'testimonials' | 'experience' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user, logout } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
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
    {
      label: 'Total Skills',
      value: skillsCount.count,
      change: '+2',
      changeType: 'positive',
      icon: Code,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Projects',
      value: projectsCount.count,
      change: '+1',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'bg-green-500'
    },
    {
      label: 'Testimonials',
      value: testimonialsCount.count,
      change: '+3',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      label: 'Experience',
      value: experienceCount.count,
      change: '+1',
      changeType: 'positive',
      icon: Award,
      color: 'bg-orange-500'
    },
    {
      label: 'Portfolio Views',
      value: viewsCount.count.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-indigo-500'
    },
    {
      label: 'Active Sessions',
      value: sessionsCount.count,
      change: '+5',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-pink-500'
    },
    {
      label: 'Featured Projects',
      value: featuredCount.count,
      change: '+1',
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      label: 'Average Rating',
      value: ratingCount.count.toFixed(1),
      change: '+0.2',
      changeType: 'positive',
      icon: UserCheck,
      color: 'bg-emerald-500'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 dark:to-slate-700/20"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className={`p-3 rounded-lg ${stat.color} text-white`}
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <stat.icon className="h-6 w-6" />
                      </motion.div>
                      <motion.span 
                        className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {stat.change}
                      </motion.span>
                    </div>
                    <motion.h3 
                      className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Add New Skill', tab: 'skills', color: 'blue', icon: Code },
                  { label: 'Add New Project', tab: 'projects', color: 'green', icon: FolderOpen },
                  { label: 'Add Testimonial', tab: 'testimonials', color: 'purple', icon: MessageSquare },
                  { label: 'Add Experience', tab: 'experience', color: 'orange', icon: Award }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(action.tab as TabType)}
                    className={`flex items-center p-4 bg-${action.color}-50 dark:bg-${action.color}-900/20 border border-${action.color}-200 dark:border-${action.color}-800 rounded-lg hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-all duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <action.icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400 mr-3`} />
                    <span className={`text-${action.color}-700 dark:text-${action.color}-300 font-medium text-sm`}>
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { action: 'Added new skill', item: 'React Native', time: '2 hours ago', type: 'skill' },
                  { action: 'Updated project', item: 'E-commerce App', time: '1 day ago', type: 'project' },
                  { action: 'New testimonial', item: 'From Sarah Johnson', time: '2 days ago', type: 'testimonial' },
                  { action: 'Added experience', item: 'Senior Developer Role', time: '3 days ago', type: 'experience' },
                ].map((activity, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`p-2 rounded-lg mr-4 ${
                      activity.type === 'skill' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'project' ? 'bg-green-100 dark:bg-green-900/30' :
                      activity.type === 'testimonial' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      {activity.type === 'skill' && <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'project' && <FolderOpen className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      {activity.type === 'testimonial' && <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                      {activity.type === 'experience' && <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-medium">
                        {activity.action}: <span className="text-blue-600 dark:text-blue-400">{activity.item}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      case 'skills':
        return <SkillsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'settings':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Settings
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Settings panel coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Welcome, {user?.email}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="space-y-2">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;