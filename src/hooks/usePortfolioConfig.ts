import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PortfolioConfig {
  yearsExperience: number;
  totalProjects: number;
  happyClients: number;
  publishedApps: number;
  heroTagline?: string;
  heroDescription?: string;
}

const DEFAULT_CONFIG: PortfolioConfig = {
  yearsExperience: 4,
  totalProjects: 50,
  happyClients: 25,
  publishedApps: 15,
};

export const usePortfolioConfig = () => {
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const configRef = doc(db, 'settings', 'portfolio_config');
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as PortfolioConfig);
      } else {
        // If document doesn't exist, create it with defaults
        setDoc(configRef, DEFAULT_CONFIG).catch(err => {
          console.error('Error creating default config:', err);
        });
      }
      setLoading(false);
    }, (err) => {
      console.error('Error fetching portfolio config:', err);
      setError('Failed to fetch portfolio configuration');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: Partial<PortfolioConfig>) => {
    try {
      const configRef = doc(db, 'settings', 'portfolio_config');
      await setDoc(configRef, { ...config, ...newConfig }, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Error updating portfolio config:', err);
      return { success: false, error: err };
    }
  };

  return { config, loading, error, updateConfig };
};
