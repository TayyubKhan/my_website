import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import TestimonialForm from './components/TestimonialForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useScrollspy } from './hooks/useScrollspy';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';

const PortfolioApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  
  useScrollspy({
    sectionIds: ['home', 'about', 'projects', 'testimonials', 'testimonial-form', 'contact'],
    onActiveChange: setActiveSection,
  });

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <Header activeSection={activeSection} />
      <main>
        {/* 1. Hero: The hook */}
        <Hero />
        {/* 2. About: Value proposition */}
        <div className="section-divider" />
        <About />
        {/* 3. Projects: Proof of work */}
        <div className="section-divider" />
        <Projects />
        {/* 4. Testimonials: Social proof */}
        <div className="section-divider" />
        <Testimonials />
        {/* 5. Contact: CTA */}
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <CustomCursor />
            <ScrollProgress />
            <Routes>
              <Route path="/" element={<PortfolioApp />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/feedback" element={<TestimonialForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;