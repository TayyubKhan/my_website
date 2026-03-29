export const getTagColorClasses = (tag: string): string => {
  const normalized = tag.toLowerCase().trim();
  
  // Frontend & Mobile (Blue)
  const frontend = ['flutter', 'react', 'react native', 'vue', 'ui', 'ux', 'swift', 'kotlin', 'dart', 'javascript', 'typescript', 'html', 'css', 'tailwind'];
  
  // Backend & Architecture (Indigo)
  const backend = ['node', 'node.js', 'firebase', 'clean architecture', 'mvvm', 'riverpod', 'rest', 'graphql', 'api', 'sql', 'nosql', 'mongodb', 'postgresql', 'architecture', 'sqlite', 'mesh network', 'p2p'];
  
  // DevOps, Tools & Performance (Emerald)
  const devops = ['fastlane', 'ci/cd', 'git', 'github', 'docker', 'aws', 'gcp', 'linux', 'performance', 'offline-first', 'security', 'caching'];
  
  // AI, Data & Other (Amber/Violet)
  const ai = ['ai', 'llm', 'machine learning', 'chatbot', 'python', 'data'];
  
  if (frontend.some(t => normalized.includes(t))) {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300';
  }
  
  if (backend.some(t => normalized.includes(t))) {
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-300';
  }
  
  if (devops.some(t => normalized.includes(t))) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300';
  }
  
  if (ai.some(t => normalized.includes(t))) {
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-400';
  }
  
  // Default fallback (Zinc/Gray - neutral)
  return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20 hover:text-zinc-300';
};
