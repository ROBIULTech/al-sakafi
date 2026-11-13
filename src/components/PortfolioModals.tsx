import React, { useEffect } from 'react';
import { X, Calendar, User, ArrowUpRight, Download, CheckCircle2 } from 'lucide-react';
import { BlogPost, ProjectItem, ServiceItem } from '../data/portfolioData';
import { useSiteContent } from '../context/SiteContentContext';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onContactClick: (subject: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onContactClick,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white border border-white/20 hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-[16/10] w-full overflow-hidden bg-[#141414]">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#00BC91]">
                {project.client} · {project.year}
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white">{project.title}</h3>
            </div>
            <span className="rounded-full border border-white/25 px-4 py-1.5 text-xs text-white/90">
              {project.category}
            </span>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#A1A1AA]">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/75">
            {project.stack.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span>{tech}</span>
                {idx < project.stack.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#1e1e1e] pt-6">
            <button
              type="button"
              onClick={() => {
                const title = project.title;
                onClose();
                onContactClick(`Project Inquiry: ${title}`);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#F20101] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#d80000] transition-colors cursor-pointer"
            >
              Start Similar Project
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    if (!post) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#222222] bg-[#0c0c0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white border border-white/20 hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden bg-[#141414]">
          <img
            src={post.image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-5 text-xs text-[#A1A1AA]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight text-white">
            {post.title}
          </h3>

          <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-[#A1A1AA]">
            {post.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onSelectService,
}) => {
  useEffect(() => {
    if (!service) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [service, onClose]);

  if (!service) return null;
  const cleanTitle = service.title.replace(/\n/g, ' ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={cleanTitle}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#222222] bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service details"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#00BC91]">
          Service {service.number}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-white">{cleanTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">{service.description}</p>

        <div className="mt-6 rounded-xl border border-[#1f1f1f] bg-[#121212] p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            Included Deliverables
          </h4>
          <ul className="mt-3 space-y-2.5">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[#CCCCCC]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00BC91]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectService(cleanTitle);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#F20101] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#d80000] transition-colors cursor-pointer"
          >
            Book This Service
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CvModalProps {
  open: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ open, onClose }) => {
  const { content } = useSiteContent();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const { cvName, cvSubtitle, cvExperienceHighlights, cvTechnicalStack } = content.global;

  const handleDownloadTxt = () => {
    const cvText = [
      cvName.toUpperCase(),
      cvSubtitle,
      '------------------------------------------------------',
      'EXPERIENCE HIGHLIGHTS',
      cvExperienceHighlights,
      '',
      'TECHNICAL STACK',
      cvTechnicalStack,
      '',
      'SELECTED SERVICES',
      ...content.homeServices.map((s) => `- ${s.title.replace(/\n/g, ' ')}`),
    ].join('\n');

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'XFOLIO_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum Vitae"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-[#222222] bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close CV preview"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#00BC91]">
          CURRICULUM VITAE
        </span>
        <h3 className="mt-2 text-2xl font-bold text-white">{cvName}</h3>
        <p className="mt-1 text-xs text-[#A1A1AA]">{cvSubtitle}</p>

        <div className="mt-5 space-y-4 rounded-xl border border-[#1d1d1d] bg-[#111111] p-5 text-sm text-[#CCCCCC]">
          <div>
            <div className="font-semibold text-white">Experience Highlights</div>
            <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
              {cvExperienceHighlights}
            </p>
          </div>
          <div>
            <div className="font-semibold text-white">Technical Stack</div>
            <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
              {cvTechnicalStack}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-2 rounded-full bg-[#F20101] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#d80000] transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download CV File
          </button>
        </div>
      </div>
    </div>
  );
};

