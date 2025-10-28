import React from 'react';
import { motion } from 'framer-motion';

export const SkillCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
);

export const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <div className="animate-pulse">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-700"></div>
      <div className="p-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
        <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-4">
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export const SkillsLoadingGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <SkillCardSkeleton />
      </motion.div>
    ))}
  </div>
);

export const ProjectsLoadingGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <ProjectCardSkeleton />
      </motion.div>
    ))}
  </div>
);

export const ErrorState: React.FC<{ 
  message: string; 
  onRetry: () => void;
  type?: 'skills' | 'projects';
}> = ({ message, onRetry, type = 'skills' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16"
  >
    <div className="w-24 h-24 mx-auto mb-6 text-red-500">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
      Failed to load {type}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
      {message}
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
    >
      Try Again
    </button>
  </motion.div>
);