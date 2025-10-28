import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Skill {
  id: string;
  title: string;
  level: number;
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
  current: boolean;
  order: number;
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
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const skillsRef = collection(db, 'skills');
        const q = query(skillsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const skillsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        
        setSkills(skillsData);
      } catch (err) {
        setError('Failed to fetch skills data');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error, refetch: () => window.location.reload() };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Project[];
        
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to fetch projects data');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: () => window.location.reload() };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const testimonialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Testimonial[];
        
        setTestimonials(testimonialsData);
      } catch (err) {
        setError('Failed to fetch testimonials data');
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error, refetch: () => window.location.reload() };
};

export const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const experienceRef = collection(db, 'experience');
        const q = query(experienceRef, orderBy('order', 'desc'));
        const querySnapshot = await getDocs(q);
        const experienceData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Experience[];
        
        setExperience(experienceData);
      } catch (err) {
        setError('Failed to fetch experience data');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return { experience, loading, error, refetch: () => window.location.reload() };
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
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all collections
        const [skillsSnapshot, projectsSnapshot, testimonialsSnapshot, experienceSnapshot] = await Promise.all([
          getDocs(collection(db, 'skills')),
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'testimonials')),
          getDocs(collection(db, 'experience'))
        ]);

        const projects = projectsSnapshot.docs.map(doc => doc.data());
        const testimonials = testimonialsSnapshot.docs.map(doc => doc.data());

        const featuredProjects = projects.filter(p => p.featured).length;
        const totalRatings = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
        const averageRating = testimonials.length > 0 ? totalRatings / testimonials.length : 0;

        // Simulate some dynamic stats
        const portfolioViews = Math.floor(Math.random() * 5000) + 1000;
        const activeSessions = Math.floor(Math.random() * 50) + 10;

        setStats({
          totalSkills: skillsSnapshot.size,
          totalProjects: projectsSnapshot.size,
          totalTestimonials: testimonialsSnapshot.size,
          totalExperience: experienceSnapshot.size,
          portfolioViews,
          activeSessions,
          featuredProjects,
          averageRating: Math.round(averageRating * 10) / 10
        });
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => window.location.reload() };
};