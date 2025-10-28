import React from 'react';
import { Calendar, Award, Users, Code2 } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    {
      icon: <Calendar className="h-8 w-8" />,
      label: 'Years Experience',
      value: '3.5+',
      color: 'bg-blue-500'
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      label: 'Projects Completed',
      value: '50+',
      color: 'bg-green-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      label: 'Happy Clients',
      value: '25+',
      color: 'bg-purple-500'
    },
    {
      icon: <Award className="h-8 w-8" />,
      label: 'Apps Published',
      value: '15+',
      color: 'bg-orange-500'
    }
  ];

  const experience = [
    {
      company: 'TechCorp Solutions',
      position: 'Senior Flutter Developer',
      period: '2022 - Present',
      description: 'Leading mobile app development projects, mentoring junior developers, and implementing best practices for Flutter development.'
    },
    {
      company: 'InnovateMobile',
      position: 'Flutter Developer',
      period: '2021 - 2022',
      description: 'Developed cross-platform mobile applications for various clients, focusing on performance optimization and user experience.'
    },
    {
      company: 'StartupXYZ',
      position: 'Junior Mobile Developer',
      period: '2020 - 2021',
      description: 'Built mobile applications using Flutter, integrated with REST APIs, and collaborated with design teams for UI/UX implementation.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Passionate about creating exceptional mobile experiences through clean code and innovative solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              My Journey
            </h3>
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I'm a passionate Flutter Developer with over 3.5 years of experience building 
                high-quality mobile applications. My journey began with a fascination for 
                mobile technology and has evolved into a career focused on creating exceptional 
                user experiences.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I specialize in cross-platform development using Flutter, with expertise in 
                Firebase integration, state management, and performance optimization. I believe 
                in writing clean, maintainable code and following best practices to deliver 
                scalable solutions.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing 
                to open-source projects, or mentoring aspiring developers. I'm always excited 
                to take on new challenges and collaborate with innovative teams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.color} text-white mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 text-center">
            Professional Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={exp.company}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                      {exp.position}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium mt-2 md:mt-0">
                    {exp.period}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;