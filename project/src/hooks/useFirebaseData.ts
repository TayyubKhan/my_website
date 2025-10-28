import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

// Interfaces
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
  image: string;
  text: string;
  rating: number;
  projectId: string | null;
  userId: string | null;
  timestamp: any;
}

// useAuth Hook
export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Helper to update user data
  const updateUserData = async (user: User) => {
    try {
      await user.reload();
      const refreshedUser = auth.currentUser;
      if (refreshedUser) {
        const providerData = refreshedUser.providerData.find(p => p.providerId === 'google.com');
        setUserId(refreshedUser.uid);
        setUserName(providerData?.displayName || refreshedUser.displayName || 'Anonymous');
        setUserPhoto(providerData?.photoURL || refreshedUser.photoURL || 'https://placehold.co/50x50/A0A0A0/FFFFFF?text=User');
      } else {
        setUserId(null);
        setUserName(null);
        setUserPhoto(null);
      }
    } catch (e: any) {
      setError(`Failed to update user data: ${e.message}`);
      console.error('User data update error:', e);
    }
  };

  useEffect(() => {
    if (!auth) {
      setError('Firebase Auth not initialized.');
      setLoading(false);
      return;
    }

    const signIn = async () => {
      try {
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e: any) {
        setError(`Initial authentication failed: ${e.message}`);
      }
    };

    signIn();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateUserData(user);
      } else {
        setUserId(null);
        setUserName(null);
        setUserPhoto(null);
      }
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase Auth not initialized.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateUserData(auth.currentUser);
        setLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        await updateUserData(user);
      }
    } catch (e: any) {
      setError(`Google Sign-In failed: ${e.message}`);
      console.error('Sign-in error details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUserId(null);
      setUserName(null);
      setUserPhoto(null);
      setLoading(false);
    } catch (e: any) {
      setError(`Sign out failed: ${e.message}`);
      console.error('Sign-out error:', e);
    }
  };

  return {
    userId,
    userName,
    userPhoto,
    loading,
    error,
    handleGoogleSignIn,
    handleSignOut,
  };
};

// useSkills Hook
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    if (!db) {
      setError('Firestore not initialized.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const skillsRef = collection(db, 'skills');
      const q = query(skillsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Skill[];

      setSkills(skillsData);
    } catch (err) {
      setError('Failed to fetch skills data');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return { skills, loading, error, refetch: fetchSkills };
};

// useProjects Hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!db) {
      setError('Firestore not initialized.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Project[];

      setProjects(projectsData);
    } catch (err) {
      setError('Failed to fetch projects data');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};

// useTestimonials Hook
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, userName, userPhoto, handleGoogleSignIn } = useAuth();

  const fetchTestimonials = async () => {
    if (!db) {
      setError('Firestore not initialized.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];

      setTestimonials(testimonialsData);
    } catch (err) {
      setError('Failed to fetch testimonials data');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const submitTestimonial = async (
    text: string,
    rating: number,
    projectId: string | null,
    guestName: string | null = null
  ) => {
    if (!db) {
      return { success: false, message: 'Firestore not initialized.' };
    }
    if (!text.trim()) {
      return { success: false, message: 'Testimonial text is required.' };
    }
    if (!userId && !guestName?.trim()) {
      return { success: false, message: 'Please provide a name or sign in to submit a testimonial.' };
    }

    try {
      const name = userId && userName ? userName : (guestName?.trim() || 'Anonymous');
      const image = userId && userPhoto ? userPhoto : 'https://placehold.co/50x50/A0A0A0/FFFFFF?text=User';

      console.log('Submitting with:', { userId, name, image });
      const testimonialsRef = collection(db, 'testimonials');
      await addDoc(testimonialsRef, {
        name,
        image,
        text: text.trim(),
        rating,
        projectId,
        userId: userId || null,
        timestamp: serverTimestamp(),
      });
      await fetchTestimonials();
      return { success: true, message: 'Testimonial submitted successfully!' };
    } catch (e: any) {
      return { success: false, message: `Failed to submit testimonial: ${e.message}` };
    }
  };

  return {
    testimonials,
    loading,
    error,
    submitTestimonial,
    refetch: fetchTestimonials,
  };
};