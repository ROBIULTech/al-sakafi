import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { SubpageBanner } from '../components/SubpageBanner';
import { useSiteContent } from '../context/SiteContentContext';

interface BlogPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenBlogDetails: (title: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onNavigate,
  onOpenBlogDetails,
}) => {
  const { content } = useSiteContent();
  const [page, setPage] = useState<number>(1);

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Blog"
        breadcrumbLabel="Blog"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {content.blogPage.cards.map((card) => (
            <article
              key={card.id}
              onClick={() => onOpenBlogDetails(card.title)}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg bg-[#111111]">
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="aspect-[416/215] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* Overlapping Dark Caption Card */}
              <div className="relative z-10 mx-4 -mt-7 rounded-md border border-[#1a1a1a] bg-[#090909] px-6 py-7 text-center transition-colors group-hover:border-[#F20101]/40">
                <div className="text-[12px] text-[#A1A1AA]">{card.date}</div>
                <h2 className="mt-2.5 text-[18px] font-bold leading-[1.35] text-white group-hover:text-[#F20101] transition-colors">
                  {card.title}
                </h2>

                <div className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-white/90">
                  <span>Read More</span>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                      card.featuredLink
                        ? 'bg-[#38BDF8] text-white'
                        : 'bg-[#1c1c1c] text-white/75 group-hover:bg-[#F20101] group-hover:text-white'
                    }`}
                  >
                    <ChevronsRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
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
