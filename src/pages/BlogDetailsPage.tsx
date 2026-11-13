import React, { useState } from 'react';
import { ArrowUpRight, Calendar, Search } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { SubpageBanner } from '../components/SubpageBanner';
import { useSiteContent } from '../context/SiteContentContext';

interface BlogDetailsPageProps {
  articleTitle?: string;
  onNavigate: (route: PageRoute) => void;
}

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({
  articleTitle,
  onNavigate,
}) => {
  const { content, submitReview } = useSiteContent();
  const bd = content.blogDetails;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    bd.categories.find((c) => c.active)?.name || bd.categories[0]?.name || ''
  );
  const [activeTag, setActiveTag] = useState(bd.popularTags[1] || bd.popularTags[0] || '');
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '' });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    await submitReview(reviewForm.name, reviewForm.comment);
    setReviewForm({ name: '', email: '', comment: '' });
  };

  const displayTitle =
    articleTitle && articleTitle.length > 0 ? articleTitle : bd.defaultTitle;

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Blog Details"
        breadcrumbLabel="Blog"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* ======================== MAIN ARTICLE COLUMN ======================== */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-[#111111]">
              <img
                src={bd.heroImage}
                alt={displayTitle}
                referrerPolicy="no-referrer"
                className="w-full max-h-[420px] object-cover"
              />
            </div>

            <h2 className="mt-8 text-[30px] font-bold leading-[1.22] tracking-tight text-white sm:text-[38px]">
              {displayTitle}
            </h2>

            <div className="mt-4 space-y-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
              <p>{bd.intro1}</p>
              <p>{bd.intro2}</p>
            </div>

            {/* 2 Side-by-side Photos */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-12">
              <div className="overflow-hidden rounded-xl bg-[#111111] sm:col-span-7">
                <img
                  src={bd.midImage1}
                  alt="Creative collaboration"
                  referrerPolicy="no-referrer"
                  className="h-[320px] w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-xl bg-[#111111] sm:col-span-5">
                <img
                  src={bd.midImage2}
                  alt="Design workspace"
                  referrerPolicy="no-referrer"
                  className="h-[320px] w-full object-cover"
                />
              </div>
            </div>

            {/* Subheading */}
            <h3 className="mt-10 text-[30px] font-bold tracking-tight text-white sm:text-[36px]">
              {bd.subheading}
            </h3>
            <p className="mt-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
              {bd.subheadingText}
            </p>

            {/* Bright Red Callout Box */}
            <div className="my-8 rounded-md bg-[#F20101] px-8 py-9 text-center text-[15px] font-medium leading-[1.7] text-white">
              {bd.calloutQuote}
            </div>

            <p className="text-[14px] leading-[1.75] text-[#A1A1AA]">
              {bd.closingText}
            </p>

            {/* Tags & Follow Us Bar */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-[#1a1a1a] py-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[14px] font-semibold text-white">Tags:</span>
                {bd.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] text-[#A1A1AA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-semibold text-white mr-1">
                  Follow Us :
                </span>
                {['f', 'ig', 'tw', 'in'].map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold cursor-pointer transition-colors ${
                      idx === 1
                        ? 'border-[#F20101] bg-[#F20101] text-white'
                        : 'border-white/20 text-white/75 hover:border-[#F20101]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10">
              <h3 className="text-[22px] font-bold text-white">
                ({String(bd.reviews.length).padStart(2, '0')}) Reviews
              </h3>

              <div className="mt-7 space-y-8">
                {bd.reviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="flex items-start gap-4">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] text-[#8C8C8C]">{rev.date}</div>
                          <div className="mt-0.5 text-[15px] font-semibold text-white">
                            {rev.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setReviewForm((f) => ({
                              ...f,
                              comment: `@${rev.name} `,
                            }))
                          }
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#F20101] hover:underline cursor-pointer"
                        >
                          Reply <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-3 text-[13px] leading-[1.65] text-[#A1A1AA]">
                        {rev.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Your Reviews Form */}
              <div className="mt-12">
                <h4 className="text-[19px] font-bold text-white">
                  Submit Your Reviews
                </h4>
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13px] font-medium text-white">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="mt-2.5 w-full rounded-full border border-[#1d1d1d] bg-[#121212] px-5 py-3 text-[13px] text-white placeholder:text-white/35 focus:border-[#F20101] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-white">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        required
                        value={reviewForm.email}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, email: e.target.value })
                        }
                        placeholder="Enter email address"
                        className="mt-2.5 w-full rounded-full border border-[#1d1d1d] bg-[#121212] px-5 py-3 text-[13px] text-white placeholder:text-white/35 focus:border-[#F20101] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-white">
                      Write Your Comment *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, comment: e.target.value })
                      }
                      placeholder="Write your comment"
                      className="mt-2.5 w-full resize-none rounded-xl border border-[#1d1d1d] bg-[#121212] p-5 text-[13px] text-white placeholder:text-white/35 focus:border-[#F20101] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#F20101] py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d80000] cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ======================== SIDEBAR ======================== */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Search Box */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-6">
              <div className="flex items-center overflow-hidden rounded-lg border border-[#1e1e1e] bg-[#121212]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent px-4 py-3 text-[13px] text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Search articles"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#F20101] text-white cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Top Category */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-6">
              <h3 className="border-l-2 border-[#F20101] pl-3 text-[16px] font-bold text-white">
                Top Category
              </h3>
              <div className="mt-5 space-y-2.5">
                {bd.categories.map((cat) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-[13px] transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#F20101] bg-[#F20101] text-white font-medium'
                          : 'border-[#1d1d1d] bg-[#101010] text-[#A1A1AA] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="tabular-nums">({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-6">
              <h3 className="border-l-2 border-[#F20101] pl-3 text-[16px] font-bold text-white">
                Recent Posts
              </h3>
              <div className="mt-5 space-y-4">
                {bd.recentPosts
                  .filter((p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((post, idx) => (
                    <button
                      key={`${post.title}-${idx}`}
                      type="button"
                      onClick={() => onNavigate('/blog')}
                      className="group flex w-full items-center gap-4 text-left cursor-pointer"
                    >
                      <img
                        src={post.img}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="h-[68px] w-[62px] shrink-0 rounded-md object-cover"
                      />
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#8C8C8C]">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="mt-1 text-[14px] font-semibold leading-snug text-white group-hover:text-[#F20101] transition-colors">
                          {post.title}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Popular Tag */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-6">
              <h3 className="border-l-2 border-[#F20101] pl-3 text-[16px] font-bold text-white">
                Popular Tag
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {bd.popularTags.map((tag) => {
                  const active = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`rounded-md border px-4 py-2 text-[12px] transition-colors cursor-pointer ${
                        active
                          ? 'border-[#F20101] bg-[#F20101] text-white font-medium'
                          : 'border-[#1d1d1d] bg-[#121212] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ======================== RELATED ARTICLE ======================== */}
        <div className="mt-24">
          <h2 className="text-[32px] font-bold text-white sm:text-[38px]">
            Related Article
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {bd.relatedArticles.map((art, idx) => (
              <article
                key={`${art.title}-${idx}`}
                onClick={() => onNavigate('/blog')}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg bg-[#111111]">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="aspect-[416/215] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative z-10 mx-4 -mt-7 rounded-md border border-[#1a1a1a] bg-[#090909] px-6 py-6 text-center">
                  <div className="text-[12px] text-[#A1A1AA]">{art.date}</div>
                  <h3 className="mt-2 text-[17px] font-bold leading-snug text-white group-hover:text-[#F20101] transition-colors">
                    {art.title}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-white/90">
                    <span>Read More</span>
                    <span className="text-[#A1A1AA]">»</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
