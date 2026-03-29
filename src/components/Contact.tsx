import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowUpRight, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Sending message...');
    
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        read: false
      });
      
      toast.success('Message sent successfully! I will get back to you soon.', { id: loadingToast });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFocused(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or use direct email.', { id: loadingToast });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'tayyubshafiquek@gmail.com', href: 'mailto:tayyubshafiquek@gmail.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+92 321 4965066', href: 'tel:+923214965066' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'WhatsApp', value: '+92 321 4965066', href: 'https://wa.me/923214965066?text=Hi%20Tayyub,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Islamabad, Pakistan', href: 'https://maps.google.com/?q=Islamabad,Pakistan' },
  ];

  const inputClasses = (name: string) => `w-full px-6 py-4 bg-surface/30 backdrop-blur-sm border rounded-xl text-text-primary placeholder:text-text-faint focus:outline-none transition-all duration-300 text-sm ${
    focused === name 
      ? 'border-blue-500/50 bg-surface/50 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
      : 'border-border hover:border-border-hover hover:bg-surface/40'
  }`;

  return (
    <section id="contact" className="py-32 bg-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Big CTA Headline */}
        <div className="mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-muted text-sm tracking-widest uppercase mb-6"
          >
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary leading-[1.15] max-w-4xl"
          >
            Have a project in mind?{' '}
            <span className="italic text-text-secondary">Let's make it happen.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* Left: Contact Methods */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <p className="text-text-muted text-sm leading-relaxed mb-12">
              I'm always open to discussing new projects, creative ideas,
              or opportunities to be part of something meaningful. Pick the channel that works best for you.
            </p>

            <div className="space-y-0">
              {contactMethods.map((method, i) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between py-5 border-b border-border group hover:border-accent transition-all -mx-3 px-3 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-text-faint group-hover:text-text-primary transition-colors">
                      {method.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-text-faint uppercase tracking-widest mb-1">
                        {method.label}
                      </div>
                      <div className="text-text-primary text-sm font-medium">
                        {method.value}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-faint group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} required className={inputClasses('name')} placeholder="Your Name" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required className={inputClasses('email')} placeholder="Email Address" />
              </div>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)} required className={inputClasses('subject')} placeholder="Subject" />
              <textarea name="message" value={formData.message} onChange={handleChange} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} required rows={6} className={`${inputClasses('message')} resize-none`} placeholder="Tell me about your project..." />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-4 bg-text-primary text-bg font-medium py-5 px-6 text-sm tracking-wide hover:bg-text-secondary transition-all flex items-center justify-center rounded-xl group"
              >
                <Send className="h-4 w-4 mr-3 group-hover:translate-x-0.5 transition-transform" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;