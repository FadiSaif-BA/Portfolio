import { useEffect, useRef, useState } from 'react';
import { getSkillsByCategory } from '@/data/portfolio-data';

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

  const categoryGradients: Record<string, string> = {
    'Data & Analytics': 'from-blue-500 to-cyan-500',
    'Business Intelligence': 'from-violet-500 to-purple-500',
    'MEL Systems': 'from-orange-500 to-amber-500',
    'Programming': 'from-green-500 to-emerald-500',
  };

  const categoryChipStyles: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
    'Data & Analytics': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hoverBg: 'hover:bg-blue-100 hover:border-blue-300 hover:shadow-blue-100',
    },
    'Business Intelligence': {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      hoverBg: 'hover:bg-violet-100 hover:border-violet-300 hover:shadow-violet-100',
    },
    'MEL Systems': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hoverBg: 'hover:bg-orange-100 hover:border-orange-300 hover:shadow-orange-100',
    },
    'Programming': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      hoverBg: 'hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100',
    },
  };

  const categoryIcons: Record<string, string> = {
    'Data & Analytics': '📊',
    'Business Intelligence': '📈',
    'MEL Systems': '🎯',
    'Programming': '💻',
  };

  const defaultChipStyle = {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    hoverBg: 'hover:bg-slate-100 hover:border-slate-300 hover:shadow-slate-100',
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
          {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => {
            const chipStyle = categoryChipStyles[category] || defaultChipStyle;

            return (
              <div
                key={category}
                className={`bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 transition-all duration-700 hover:shadow-lg hover:border-slate-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${categoryIndex * 150}ms` }}
              >
                {/* Category header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryGradients[category] || 'from-blue-500 to-violet-500'} flex items-center justify-center text-2xl shadow-lg`}>
                    {categoryIcons[category] || '•'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{category}</h3>
                    <p className="text-sm text-slate-500">{skills.length} technologies</p>
                  </div>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, skillIndex) => (
                    <span
                      key={skill.name}
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 cursor-default shadow-sm ${chipStyle.bg} ${chipStyle.text} ${chipStyle.border} ${chipStyle.hoverBg} hover:shadow-md hover:-translate-y-0.5 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                      style={{
                        transitionDelay: `${categoryIndex * 150 + skillIndex * 60}ms`,
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
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
