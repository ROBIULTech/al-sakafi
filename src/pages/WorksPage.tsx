import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { SubpageBanner } from '../components/SubpageBanner';
import { ProjectItem } from '../data/portfolioData';
import { useSiteContent } from '../context/SiteContentContext';

interface WorksPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const WorksPage: React.FC<WorksPageProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const { content } = useSiteContent();
  const [page, setPage] = useState<number>(1);

  const handleOpenProject = (project: ProjectItem) => {
    onSelectProject(project);
    onNavigate('/works-details');
  };

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Portfolios"
        breadcrumbLabel="Portfolios"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
          {content.projects.map((project) => (
            <article
              key={project.id}
              onClick={() => handleOpenProject(project)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#111111]">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="aspect-[636/580] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {!project.featured && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[#F20101] text-center text-[11px] font-bold uppercase tracking-wider text-white shadow-xl">
                      VIEW DETAILS
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <h2
                  className={`text-[24px] font-bold tracking-tight transition-colors ${
                    project.featured
                      ? 'text-[#F20101] underline decoration-[#F20101] decoration-2 underline-offset-[6px]'
                      : 'text-white group-hover:text-[#F20101]'
                  }`}
                >
                  {project.title}
                </h2>

                <span className="rounded-full border border-white/25 px-5 py-2 text-[12px] font-medium text-white/90 whitespace-nowrap shrink-0">
                  {project.category}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Bar */}
        <div className="mt-16 flex items-center justify-center gap-5 text-[14px]">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors tabular-nums cursor-pointer ${
                page === num
                  ? 'bg-[#F20101] text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}

          <span className="text-white/50">...</span>

          <button
            type="button"
            onClick={() => setPage(15)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors tabular-nums cursor-pointer ${
              page === 15 ? 'bg-[#F20101] text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            15
          </button>

          <button
            type="button"
            onClick={() => setPage((p) => (p >= 15 ? 1 : p + 1))}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
