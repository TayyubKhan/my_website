import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/TayyubKhan", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/in/TayyubKhan", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/TayyubKhan", label: "Twitter" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@example.com", label: "Email" }
  ];

  return (
    <footer className="bg-surface py-12 border-t border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-surface">
             <span className="font-display font-bold text-text-primary text-sm">TK.</span>
          </div>
          <p className="text-text-secondary text-sm font-medium">
            Building native experiences.
          </p>
        </div>

        <div className="flex space-x-4 mb-6 md:mb-0">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-300"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center md:items-end text-sm">
          <p className="text-text-muted">
            © {currentYear} Tayyub Khan
          </p>
          <p className="text-text-faint mt-1">
            Developed with <span className="text-text-primary">♥</span> in Flutter & React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;