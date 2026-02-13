import { useEffect, useRef, useState } from 'react';
import { Code2, Briefcase, Award, TrendingUp } from 'lucide-react';
import { portfolioData } from '@/data/portfolio-data';

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  isNumeric?: boolean;
}

function StatItem({ icon, value, label, isNumeric = true }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const numericValue = isNumeric ? parseInt(value.toString().replace(/\D/g, '')) : 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current && isNumeric) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = numericValue / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericValue, isNumeric]);

  const displayValue = isNumeric ? `${count}+` : value;

  return (
    <div ref={ref} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">
          {displayValue}
        </div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const { about } = portfolioData;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Let me introduce myself
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-blue-100 rounded-2xl" />
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-violet-100 rounded-2xl" />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={about.profileImage}
                  alt="Profile"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                    {about.yearsOfExperience}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Years of</div>
                    <div className="text-sm text-slate-500">Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="space-y-4 mb-8">
              {about.bio.map((paragraph, index) => (
                <p key={index} className="text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-4">
              <StatItem
                icon={<Briefcase className="w-6 h-6" />}
                value={about.yearsOfExperience}
                label="Years Experience"
              />
              <StatItem
                icon={<Code2 className="w-6 h-6" />}
                value={about.completedProjects}
                label="Projects Completed"
              />
              <StatItem
                icon={<TrendingUp className="w-6 h-6" />}
                value={about.portfolioValue}
                label="Portfolio Supported"
                isNumeric={false}
              />
              <StatItem
                icon={<Award className="w-6 h-6" />}
                value={60}
                label="Million $ Secured"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
