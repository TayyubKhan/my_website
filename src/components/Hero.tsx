import { motion } from 'framer-motion';
import { Layers, Code2, Smartphone } from 'lucide-react';

const Hero = () => {

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Main Content */}
        <div className="lg:w-3/5 text-center lg:text-left z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-12"
          >
            Digital Craftsman / Flutter Specialist
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[1] tracking-tighter mb-10 text-text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tayyub Khan. <br />
            <span className="text-indigo-400/90 italic" style={{ fontStyle: 'italic' }}>Architecting</span> the <br className="hidden md:block" />
            future of <span className="text-blue-400/90 italic" style={{ fontStyle: 'italic' }}>mobile</span>.
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Engineering scalable mobile architectures with a focus on Clean Code and Offline-First reliability.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a href="#projects" className="text-text-primary text-sm font-medium border-b border-border-hover pb-1 hover:border-accent transition-all">
              Selected Works
            </a>
            <a href="#contact" className="text-text-muted text-sm font-medium hover:text-text-primary transition-colors">
              Contact
            </a>
          </motion.div>
        </div>

        {/* Floating Abstract iPhone Element */}
        <motion.div 
          className="hidden lg:flex lg:w-2/5 justify-center relative perspective-1000 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-[320px] h-[640px] glass-card rounded-[3rem] p-3 relative"
          >
             {/* Side buttons */}
             <div className="absolute left-[-2px] top-32 w-[3px] h-10 bg-surface-alt rounded-l-md"></div>
             <div className="absolute left-[-2px] top-48 w-[3px] h-16 bg-surface-alt rounded-l-md"></div>
             <div className="absolute left-[-2px] top-64 w-[3px] h-16 bg-surface-alt rounded-l-md"></div>
             <div className="absolute right-[-2px] top-56 w-[3px] h-24 bg-surface-alt rounded-r-md"></div>
             
            <div className="w-full h-full rounded-[2.5rem] bg-bg overflow-hidden relative border border-border">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30" />
              
              <div className="absolute inset-0 bg-surface/50 z-0" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[60px] z-0" />
              
              {/* Fake UI Elements */}
              <div className="relative z-10 p-6 pt-20 space-y-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-border-hover">
                    <span className="font-display font-bold text-text-primary text-sm">TK</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-text-faint" />
                    <div className="w-2 h-2 rounded-full bg-text-faint" />
                  </div>
                </div>
                
                <div className="w-full h-40 rounded-2xl bg-surface-alt/50 p-5 shadow-lg border border-border relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-xl group-hover:scale-150 transition-transform duration-700" />
                  <Layers className="text-indigo-400/80 mb-2 w-8 h-8" />
                  <div className="text-text-primary font-medium text-lg mt-4">UI Architecture</div>
                  <div className="text-text-secondary text-sm mt-1">Cross-platform fluid logic</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 glass-card rounded-2xl p-4 flex flex-col justify-end border-b border-b-border-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full filter blur-lg" />
                    <Code2 className="text-emerald-400/80 mb-auto w-6 h-6 z-10" />
                    <div className="h-2 w-3/4 bg-surface-alt rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-surface-alt rounded-full" />
                  </div>
                  <div className="h-32 glass-card rounded-2xl p-4 flex flex-col justify-end border-b border-b-border-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full filter blur-lg" />
                    <Smartphone className="text-blue-400/80 mb-auto w-6 h-6 z-10" />
                    <div className="h-2 w-full bg-surface-alt rounded-full mb-2" />
                    <div className="h-2 w-2/3 bg-surface-alt rounded-full" />
                  </div>
                </div>
                
                <div className="mt-auto h-16 glass-card rounded-2xl flex items-center justify-around px-4">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                     <div className="w-4 h-4 rounded-full bg-accent" />
                   </div>
                   <div className="w-8 h-8 rounded-full bg-surface-alt" />
                   <div className="w-8 h-8 rounded-full bg-surface-alt" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;