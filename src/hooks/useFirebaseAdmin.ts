import { useState, useEffect } from 'react';
import { 
  collection, 
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
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const skillsRef = collection(db, 'skills');
      const q = query(skillsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const skillsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      setSkills(skillsData);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: Omit<Skill, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'skills'), {
        ...skillData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Skill added successfully!');
      fetchSkills();
      return docRef.id;
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
      throw error;
    }
  };

  const updateSkill = async (id: string, skillData: Partial<Skill>) => {
    try {
      const skillRef = doc(db, 'skills', id);
      await updateDoc(skillRef, {
        ...skillData,
        updatedAt: serverTimestamp()
      });
      toast.success('Skill updated successfully!');
      fetchSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted successfully!');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
      throw error;
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills
  };
};

export const useProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Project added successfully!');
      fetchProjects();
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
      toast.success('Project updated successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};

export const useTestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Testimonial[];
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonialData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Testimonial added successfully!');
      fetchTestimonials();
      return docRef.id;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
      throw error;
    }
  };

  const updateTestimonial = async (id: string, testimonialData: Partial<Testimonial>) => {
    try {
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, {
        ...testimonialData,
        updatedAt: serverTimestamp()
      });
      toast.success('Testimonial updated successfully!');
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
      throw error;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials
  };
};

export const useExperienceAdmin = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const experienceRef = collection(db, 'experience');
      const q = query(experienceRef, orderBy('order', 'desc'));
      const querySnapshot = await getDocs(q);
      const experienceData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Experience[];
      setExperience(experienceData);
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast.error('Failed to fetch experience');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experienceData: Omit<Experience, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'experience'), {
        ...experienceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Experience added successfully!');
      fetchExperience();
      return docRef.id;
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
      throw error;
    }
  };

  const updateExperience = async (id: string, experienceData: Partial<Experience>) => {
    try {
      const experienceRef = doc(db, 'experience', id);
      await updateDoc(experienceRef, {
        ...experienceData,
        updatedAt: serverTimestamp()
      });
      toast.success('Experience updated successfully!');
      fetchExperience();
    } catch (error) {
      console.error('Error updating experience:', error);
      toast.error('Failed to update experience');
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experience', id));
      toast.success('Experience deleted successfully!');
      fetchExperience();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
      throw error;
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return {
    experience,
    loading,
    addExperience,
    updateExperience,
    deleteExperience,
    refetch: fetchExperience
  };
};