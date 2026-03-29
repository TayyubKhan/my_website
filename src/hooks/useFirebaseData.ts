import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Skill {
  id: string;
  title: string;
  level: number;
  yearsOfExperience: string;
  specialties: string[];
  description: string;
  icon: string;
  color: string;
  category: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  features: string[];
  metrics: {
    users: string;
    rating: string;
    downloads: string;
  };
  links: {
    github: string;
    live: string;
    demo?: string;
  };
  category: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  tech?: string[];
  current: boolean;
  order: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalSkills: number;
  totalProjects: number;
  totalTestimonials: number;
  totalExperience: number;
  portfolioViews: number;
  activeSessions: number;
  featuredProjects: number;
  averageRating: number;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing public Skills listener...');
    const skillsRef = collection(db, 'skills');
    const q = query(skillsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        
        console.log(`[Firebase] Public Skills sync: ${skillsData.length} items.`);
        setSkills(skillsData);
        setLoading(false);
      },
      (err) => {
        console.error('[Firebase] Public Skills sync error:', err);
        setError('Failed to fetch skills data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { skills, loading, error };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing public Projects listener...');
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Project[];
        
        console.log(`[Firebase] Public Projects sync: ${projectsData.length} items.`);
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        console.error('[Firebase] Public Projects sync error:', err);
        setError('Failed to fetch projects data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { projects, loading, error };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing public Testimonials listener...');
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Testimonial[];
        
        console.log(`[Firebase] Public Testimonials sync: ${testimonialsData.length} items.`);
        setTestimonials(testimonialsData);
        setLoading(false);
      },
      (err) => {
        console.error('[Firebase] Public Testimonials sync error:', err);
        setError('Failed to fetch testimonials data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { testimonials, loading, error };
};

export const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing public Experience listener...');
    const experienceRef = collection(db, 'experience');
    const q = query(experienceRef, orderBy('order', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const experienceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Experience[];
        
        console.log(`[Firebase] Public Experience sync: ${experienceData.length} items.`);
        setExperience(experienceData);
        setLoading(false);
      },
      (err) => {
        console.error('[Firebase] Public Experience sync error:', err);
        setError('Failed to fetch experience data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { experience, loading, error };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSkills: 0,
    totalProjects: 0,
    totalTestimonials: 0,
    totalExperience: 0,
    portfolioViews: 0,
    activeSessions: 0,
    featuredProjects: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing Dashboard Stats sync...');
    const collections = ['skills', 'projects', 'testimonials', 'experience'];
    const unsubscribes: (() => void)[] = [];
    
    // Internal state to track counts
    let currentStats = { ...stats };

    collections.forEach(colName => {
      const unsub = onSnapshot(collection(db, colName), (snapshot) => {
        const size = snapshot.size;
        
        if (colName === 'skills') currentStats.totalSkills = size;
        if (colName === 'projects') {
          currentStats.totalProjects = size;
          currentStats.featuredProjects = snapshot.docs.filter(d => d.data().featured).length;
        }
        if (colName === 'testimonials') {
          currentStats.totalTestimonials = size;
          const totalRatings = snapshot.docs.reduce((sum, d) => sum + (d.data().rating || 0), 0);
          currentStats.averageRating = size > 0 ? Math.round((totalRatings / size) * 10) / 10 : 0;
        }
        if (colName === 'experience') currentStats.totalExperience = size;

        // Simulate views/sessions
        currentStats.portfolioViews = currentStats.portfolioViews || Math.floor(Math.random() * 5000) + 1000;
        currentStats.activeSessions = currentStats.activeSessions || Math.floor(Math.random() * 50) + 10;

        console.log(`[Firebase] Stats updated from ${colName}:`, currentStats);
        setStats({ ...currentStats });
        setLoading(false);
      }, (err) => {
        console.error(`[Firebase] Stats sync error for ${colName}:`, err);
        setError(`Failed to sync ${colName} stats`);
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  return { stats, loading, error };
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Firebase] Initializing global Messages listener...');
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Message[];
        
        console.log(`[Firebase] Messages sync: ${messagesData.length} items.`);
        setMessages(messagesData);
        setLoading(false);
      },
      (err) => {
        console.error('[Firebase] Messages sync error:', err);
        setError('Failed to fetch messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { messages, loading, error };
};