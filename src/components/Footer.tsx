import React from 'react';
import { Github, Linkedin, MessageSquare, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: <Github className="h-5 w-5" />, 
      href: 'https://github.com/TayyubKhan', 
      label: 'GitHub' 
    },
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      href: 'https://www.linkedin.com/in/tayyub-khan/', 
      label: 'LinkedIn' 
    },
    { 
      icon: <MessageSquare className="h-5 w-5" />, 
      href: 'https://wa.me/923214965066?text=Hi%20Tayyub,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.', 
      label: 'WhatsApp' 
    },
    { 
      icon: <Mail className="h-5 w-5" />, 
      href: 'mailto:tayyubshafiquek@gmail.com', 
      label: 'Email' 
    }
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Tayyub Khan
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Flutter Developer & Mobile App Specialist
            </p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
  <div className="flex flex-col md:flex-row justify-between items-center">
    <p className="text-slate-600 dark:text-slate-400 text-sm">
      © {currentYear} Tayyub Khan. All rights reserved.
    </p>
    <a
      href="https://www.linkedin.com/in/muneeba-shafiq-925b49259/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-600 dark:text-slate-400 text-sm mt-2 md:mt-0 hover:underline"
    >
      Developed by Muneeba Shafiq
    </a>
  </div>
</div>

      </div>
    </footer>
  );
};

export default Footer;