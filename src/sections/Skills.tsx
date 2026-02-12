import { useEffect, useRef, useState } from 'react';
import { getSkillsByCategory } from '@/data/portfolio-data';

interface SkillBarProps {
  name: string;
  level: number;
  index: number;
  isVisible: boolean;
}

function SkillBar({ name, level, index, isVisible }: SkillBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(level);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, level, index]);

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
          {name}
        </span>
        <span className="text-sm text-slate-500 font-medium">{level}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const skillsByCategory = getSkillsByCategory();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categoryColors: Record<string, string> = {
    'Data & Analytics': 'from-blue-500 to-cyan-500',
    'Business Intelligence': 'from-violet-500 to-purple-500',
    'MEL Systems': 'from-orange-500 to-amber-500',
    'Programming': 'from-green-500 to-emerald-500',
  };

  const categoryIcons: Record<string, string> = {
    'Data & Analytics': '📊',
    'Business Intelligence': '📈',
    'MEL Systems': '🎯',
    'Programming': '💻',
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            My Skills
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Technologies & Expertise
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A comprehensive toolkit for data science, analytics, and business intelligence.
            From data pipelines to machine learning models.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
            <div
              key={category}
              className={`bg-slate-50 rounded-2xl p-8 border border-slate-100 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${categoryIndex * 150}ms` }}
            >
              {/* Category header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[category] || 'from-blue-500 to-violet-500'} flex items-center justify-center text-2xl shadow-lg`}>
                  {categoryIcons[category] || '•'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{category}</h3>
                  <p className="text-sm text-slate-500">{skills.length} technologies</p>
                </div>
              </div>

              {/* Skills list */}
              <div className="space-y-5">
                {skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    index={categoryIndex * skills.length + skillIndex}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Always learning new technologies and methodologies
          </div>
        </div>
      </div>
    </section>
  );
}
