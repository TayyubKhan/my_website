import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot,
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Skill, Project, Testimonial, Experience } from './useFirebaseData';
import toast from 'react-hot-toast';

export const useSkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase] Initializing Skills listener...');
    const skillsRef = collection(db, 'skills');
    const q = query(skillsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        
        console.log(`[Firebase] Skills sync: ${skillsData.length} items loaded.`);
        setSkills(skillsData);
        setLoading(false);
      },
      (error) => {
        console.error('[Firebase] Skills sync error:', error);
        toast.error('Failed to sync skills');
        setLoading(false);
      }
    );

    return () => {
      console.log('[Firebase] Cleaning up Skills listener...');
      unsubscribe();
    };
  }, []);

  const addSkill = async (skillData: Omit<Skill, 'id'>) => {
    try {
      console.log('[Firebase] Adding skill:', skillData.title);
      const docRef = await addDoc(collection(db, 'skills'), {
        ...skillData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Skill added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('[Firebase] Error adding skill:', error);
      toast.error('Failed to add skill');
      throw error;
    }
  };

  const updateSkill = async (id: string, skillData: Partial<Skill>) => {
    try {
      console.log('[Firebase] Updating skill:', id);
      const skillRef = doc(db, 'skills', id);
      await updateDoc(skillRef, {
        ...skillData,
        updatedAt: serverTimestamp()
      });
      toast.success('Skill updated successfully!');
    } catch (error) {
      console.error('[Firebase] Error updating skill:', error);
      toast.error('Failed to update skill');
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      console.log('[Firebase] Deleting skill:', id);
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted successfully!');
    } catch (error) {
      console.error('[Firebase] Error deleting skill:', error);
      toast.error('Failed to delete skill');
      throw error;
    }
  };

  const clearSkills = async () => {
    try {
      setLoading(true);
      console.log('[Firebase] Clearing all skills...');
      // Note: In onSnapshot, we don't need to manually clear the state
      // but we still need to delete them from Firestore
      const skillsRef = collection(db, 'skills');
      const querySnapshot = await getDocs(skillsRef);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      toast.success('All skills cleared.');
    } catch (error) {
      console.error('[Firebase] Error clearing skills:', error);
      toast.error('Failed to clear skills');
    } finally {
      setLoading(false);
    }
  };

  const seedSeniorSkills = async () => {
    const seniorSkills = [
      // Architecture
      { title: 'Clean Architecture', category: 'Architecture', level: 95, yearsOfExperience: '4+ Years', specialties: ['SOLID', 'TDD', 'MVVM'], description: 'Structuring scalable, testable, and maintainable applications.', icon: 'Layers', color: 'bg-blue-500', order: 1 },
      { title: 'MVVM', category: 'Architecture', level: 98, yearsOfExperience: '5+ Years', specialties: ['Reactive', 'View Models', 'Separation of Concerns'], description: 'Separating business logic from UI with robust view models.', icon: 'Layers', color: 'bg-blue-500', order: 2 },
      { title: 'SOLID Principles', category: 'Architecture', level: 90, yearsOfExperience: '4+ Years', specialties: ['OOP', 'Design Patterns'], description: 'Core principles for clean and extensible object-oriented design.', icon: 'Layers', color: 'bg-blue-500', order: 3 },
      { title: 'Offline-First', category: 'Architecture', level: 92, yearsOfExperience: '3+ Years', specialties: ['SQLite', 'Hive', 'Data Sync'], description: 'Engineering reliable data sync and local persistence strategies.', icon: 'Layers', color: 'bg-blue-500', order: 4 },
      // State Management
      { title: 'Riverpod', category: 'State Management', level: 98, yearsOfExperience: '3+ Years', specialties: ['Reactive State', 'Safe DI'], description: 'Reactive state management with compile-time safety.', icon: 'Zap', color: 'bg-purple-500', order: 5 },
      { title: 'BLoC', category: 'State Management', level: 90, yearsOfExperience: '4+ Years', specialties: ['Streams', 'Events'], description: 'Predictable state management using event-based streams.', icon: 'Zap', color: 'bg-purple-500', order: 6 },
      { title: 'Provider', category: 'State Management', level: 95, yearsOfExperience: '5+ Years', specialties: ['InheritedWidgets', 'Context'], description: 'Efficient dependency injection and state propagation.', icon: 'Zap', color: 'bg-purple-500', order: 7 },
      // Ecosystem
      { title: 'Firebase Suite', category: 'Ecosystem', level: 95, yearsOfExperience: '4+ Years', specialties: ['Firestore', 'Functions', 'Auth'], description: 'Cloud Firestore, Auth, Storage, and Cloud Functions.', icon: 'Cloud', color: 'bg-orange-500', order: 8 },
      { title: 'REST / GraphQL', category: 'Ecosystem', level: 92, yearsOfExperience: '5+ Years', specialties: ['JSON', 'Queries', 'Mutations'], description: 'Integrating complex backends with robust API consumption.', icon: 'Settings', color: 'bg-orange-500', order: 9 },
      { title: 'Google Maps API', category: 'Ecosystem', level: 88, yearsOfExperience: '2+ Years', specialties: ['Geofencing', 'Markers'], description: 'Location-based services and custom map integrations.', icon: 'Globe', color: 'bg-orange-500', order: 10 },
      // DevOps
      { title: 'Fastlane', category: 'DevOps', level: 90, yearsOfExperience: '3+ Years', specialties: ['Automation', 'App Store'], description: 'Automating beta deployments and app store releases.', icon: 'Code', color: 'bg-green-500', order: 11 },
      { title: 'GitHub Actions', category: 'DevOps', level: 85, yearsOfExperience: '2+ Years', specialties: ['CI/CD', 'Docker'], description: 'Continuous integration and automated testing pipelines.', icon: 'Code', color: 'bg-green-500', order: 12 },
      { title: 'Automated Testing', category: 'DevOps', level: 88, yearsOfExperience: '4+ Years', specialties: ['Unit Testing', 'Widget Testing'], description: 'Unit, widget, and integration testing for reliability.', icon: 'Code', color: 'bg-green-500', order: 13 },
    ];

    try {
      setLoading(true);
      console.log('[Firebase] Seeding senior skills...');
      const skillsRef = collection(db, 'skills');
      const addPromises = seniorSkills.map(skill => addDoc(skillsRef, {
        ...skill,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }));
      await Promise.all(addPromises);
      toast.success('Senior stack seeded successfully!');
    } catch (error) {
      console.error('[Firebase] Error seeding skills:', error);
      toast.error('Failed to seed skills');
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    deleteSkill,
    clearSkills,
    seedSeniorSkills
  };
};

export const useProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase] Initializing Projects listener...');
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Project[];
        
        console.log(`[Firebase] Projects sync: ${projectsData.length} items loaded.`);
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error('[Firebase] Projects sync error:', error);
        toast.error('Failed to sync projects');
        setLoading(false);
      }
    );

    return () => {
      console.log('[Firebase] Cleaning up Projects listener...');
      unsubscribe();
    };
  }, []);

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      console.log('[Firebase] Adding project:', projectData.title);
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Project added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('[Firebase] Error adding project:', error);
      toast.error('Failed to add project');
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      console.log('[Firebase] Updating project:', id);
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
      toast.success('Project updated successfully!');
    } catch (error) {
      console.error('[Firebase] Error updating project:', error);
      toast.error('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      console.log('[Firebase] Deleting project:', id);
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('[Firebase] Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject
  };
};

export const useTestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase] Initializing Testimonials listener...');
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Testimonial[];
        
        console.log(`[Firebase] Testimonials sync: ${testimonialsData.length} items loaded.`);
        setTestimonials(testimonialsData);
        setLoading(false);
      },
      (error) => {
        console.error('[Firebase] Testimonials sync error:', error);
        toast.error('Failed to sync testimonials');
        setLoading(false);
      }
    );

    return () => {
      console.log('[Firebase] Cleaning up Testimonials listener...');
      unsubscribe();
    };
  }, []);

  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id'>) => {
    try {
      console.log('[Firebase] Adding testimonial:', testimonialData.name);
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonialData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Testimonial added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('[Firebase] Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
      throw error;
    }
  };

  const updateTestimonial = async (id: string, testimonialData: Partial<Testimonial>) => {
    try {
      console.log('[Firebase] Updating testimonial:', id);
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, {
        ...testimonialData,
        updatedAt: serverTimestamp()
      });
      toast.success('Testimonial updated successfully!');
    } catch (error) {
      console.error('[Firebase] Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      console.log('[Firebase] Deleting testimonial:', id);
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted successfully!');
    } catch (error) {
      console.error('[Firebase] Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
      throw error;
    }
  };

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
};

export const useExperienceAdmin = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase] Initializing Experience listener...');
    const experienceRef = collection(db, 'experience');
    const q = query(experienceRef, orderBy('order', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const experienceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Experience[];
        
        console.log(`[Firebase] Experience sync: ${experienceData.length} items loaded.`);
        setExperience(experienceData);
        setLoading(false);
      },
      (error) => {
        console.error('[Firebase] Experience sync error:', error);
        toast.error('Failed to sync experience');
        setLoading(false);
      }
    );

    return () => {
      console.log('[Firebase] Cleaning up Experience listener...');
      unsubscribe();
    };
  }, []);

  const addExperience = async (experienceData: Omit<Experience, 'id'>) => {
    try {
      console.log('[Firebase] Adding experience:', experienceData.company);
      const docRef = await addDoc(collection(db, 'experience'), {
        ...experienceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Experience added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('[Firebase] Error adding experience:', error);
      toast.error('Failed to add experience');
      throw error;
    }
  };

  const updateExperience = async (id: string, experienceData: Partial<Experience>) => {
    try {
      console.log('[Firebase] Updating experience:', id);
      const experienceRef = doc(db, 'experience', id);
      await updateDoc(experienceRef, {
        ...experienceData,
        updatedAt: serverTimestamp()
      });
      toast.success('Experience updated successfully!');
    } catch (error) {
      console.error('[Firebase] Error updating experience:', error);
      toast.error('Failed to update experience');
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      console.log('[Firebase] Deleting experience:', id);
      await deleteDoc(doc(db, 'experience', id));
      toast.success('Experience deleted successfully!');
    } catch (error) {
      console.error('[Firebase] Error deleting experience:', error);
      toast.error('Failed to delete experience');
      throw error;
    }
  };

  return {
    experience,
    loading,
    addExperience,
    updateExperience,
    deleteExperience
  };
};