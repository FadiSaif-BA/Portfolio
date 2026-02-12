import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, FlaskConical, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { portfolioData, type Project, getProjectThumbnail, getProjectPreview } from '@/data/portfolio-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
  onSelect: (project: Project) => void;
}

function ProjectCard({ project, index, isVisible, onSelect }: ProjectCardProps) {
  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => onSelect(project)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getProjectThumbnail(project)}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white border-0">
              Featured
            </Badge>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-slate-900 transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = portfolioData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            My Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Data Science and Analytics projects showcasing my expertise in
            machine learning, ETL pipelines, and business intelligence solutions.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Featured Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-600" />
              More Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index + featuredProjects.length}
                  isVisible={isVisible}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
                <img
                  src={getProjectPreview(selectedProject)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* Methodology */}
              {selectedProject.methodology && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    Methodology
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {selectedProject.methodology}
                  </p>
                </div>
              )}

              {/* Results */}
              {selectedProject.results && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Results
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-green-50 p-4 rounded-xl border border-green-100">
                    {selectedProject.results}
                  </p>
                </div>
              )}

              {/* Technologies */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                )}
                {selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
