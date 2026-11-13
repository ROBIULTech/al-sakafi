import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageSquare,
  PhoneCall,
  Plus,
  Minus,
  Star,
} from 'lucide-react';
import { ActionPillButton } from './ActionPillButton';
import { PageRoute } from './Layout';
import { useSiteContent } from '../context/SiteContentContext';

interface ProjectContactCardProps {
  preselectedService?: string;
}

export const ProjectContactCard: React.FC<ProjectContactCardProps> = ({
  preselectedService = '',
}) => {
  const { content, submitInquiry } = useSiteContent();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: preselectedService,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const serviceOptions = Array.from(
    new Set([
      ...content.servicesPage.cards.map((c) =>
        c.title
          .toLowerCase()
          .replace(/\b\w/g, (ch) => ch.toUpperCase())
      ),
      content.servicesDetails.title,
    ])
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      source: 'contact',
    });
    setSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#F20101]/55 via-[#2a1111] to-[#1d1d1d] p-[1px]">
      <div className="rounded-2xl bg-[#090909] p-8 sm:p-12 lg:p-16">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {content.contact.tag}
          </p>
          <h2 className="mt-2.5 text-[30px] font-bold tracking-[-0.02em] text-white sm:text-[40px]">
            {content.contact.title}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left 3 Red-Accented Info Boxes */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-xl border border-[#1d1d1d] border-l-[#F20101]/35 border-b-[#F20101]/35 bg-[#0e0e0e] p-6">
              <div className="flex items-start gap-4">
                <PhoneCall className="mt-1 h-7 w-7 shrink-0 text-white/75 stroke-[1.35]" />
                <div>
                  <div className="text-[16px] font-bold text-white">Phone</div>
                  <div className="mt-1 text-[13px] text-[#A1A1AA] tabular-nums">
                    {content.contact.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#1d1d1d] border-r-[#F20101]/70 border-b-[#F20101]/70 bg-[#0e0e0e] p-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="mt-1 h-7 w-7 shrink-0 text-[#F20101] stroke-[1.5]" />
                <div>
                  <div className="text-[16px] font-bold text-white">Email</div>
                  <div className="mt-1 text-[13px] text-[#A1A1AA]">
                    {content.contact.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#1d1d1d] border-l-[#F20101]/35 border-b-[#F20101]/35 bg-[#0e0e0e] p-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-7 w-7 shrink-0 text-white/75 stroke-[1.35]" />
                <div>
                  <div className="text-[16px] font-bold text-white">Address</div>
                  <div className="mt-1 text-[13px] text-[#A1A1AA]">
                    {content.contact.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Box */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  className="w-full rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[#F20101] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="w-full rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[#F20101] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email Address"
                  className="w-full rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[#F20101] focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone Number"
                  className="w-full rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[#F20101] focus:outline-none"
                />
              </div>

              <div className="relative">
                <select
                  required
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full appearance-none rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 pr-10 text-[13px] text-white/80 focus:border-[#F20101] focus:outline-none"
                >
                  <option value="" className="bg-[#101010]">
                    Choose Service
                  </option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#101010]">
                      {opt}
                    </option>
                  ))}
                  {formData.service && !serviceOptions.includes(formData.service) && (
                    <option value={formData.service} className="bg-[#101010]">
                      {formData.service}
                    </option>
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              </div>

              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Message"
                className="w-full resize-none rounded-lg border border-[#1c1c1c] bg-[#101010] px-4 py-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[#F20101] focus:outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-full bg-[#F20101] py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#d60000] cursor-pointer"
              >
                SEND MESSAGE
              </button>

              {submitted && (
                <div className="flex items-center gap-2 pt-1 text-xs font-medium text-[#00BC91]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Message sent successfully! We will respond shortly.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FaqSection: React.FC<{ onNavigate: (route: PageRoute) => void }> = ({
  onNavigate,
}) => {
  const { content } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number>(2);

  return (
    <section className="mx-auto max-w-[1296px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Title + Mini Testimonial + Contact CTA */}
        <div className="lg:col-span-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {content.faq.tag}
          </p>
          <h2 className="mt-2.5 text-[34px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {content.faq.title}
          </h2>
          <p className="mt-2.5 max-w-[330px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {content.faq.desc}
          </p>

          <div className="mt-8 rounded-xl border border-[#1d1d1d] bg-[#0d0d0d] p-6">
            <div className="flex items-center gap-3.5">
              <img
                src={content.faq.featuredAvatar}
                alt={content.faq.featuredName}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <div className="text-[15px] font-semibold text-white">
                  {content.faq.featuredName}
                </div>
                <div className="text-[12px] text-[#8C8C8C]">
                  {content.faq.featuredRole}
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.65] text-[#A1A1AA]">
              {content.faq.featuredQuote}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <svg
                width="26"
                height="20"
                viewBox="0 0 32 26"
                fill="currentColor"
                className="text-white/15"
              >
                <path d="M0 15.2C0 6.8 5.2 1.6 13.2 0l1.4 3.4C9.4 4.8 6.8 8 6.4 12.2H13V26H0V15.2zm18.4 0C18.4 6.8 23.6 1.6 31.6 0L33 3.4c-5.2 1.4-7.8 4.6-8.2 8.8h6.6V26H18.4V15.2z" />
              </svg>
            </div>
          </div>

          <div className="mt-7">
            <ActionPillButton
              label="CONTACT ME"
              onClick={() => onNavigate('/contact')}
            />
          </div>
        </div>

        {/* Right Accordion */}
        <div className="space-y-3.5 lg:col-span-7">
          {content.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id || item.q}
                className="rounded-lg border border-[#1a1a1a] bg-[#0b0b0b] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-[15px] font-medium text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-white/75" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-white/75" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-[13px] leading-[1.65] text-[#8C8C8C]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const TestimonialsTrack: React.FC<{ title?: string }> = ({ title }) => {
  const { content } = useSiteContent();
  const defaultFeatured =
    content.testimonials.find((t) => t.featured)?.id ||
    content.testimonials[0]?.id ||
    't-3';
  const [activeTestimonialId, setActiveTestimonialId] =
    useState<string>(defaultFeatured);

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-[1296px] px-4 text-center sm:px-6 lg:px-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
          {content.home.testimonialsTag}
        </p>
        <h2 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
          {title || content.home.testimonialsTitle}
        </h2>
        <p className="mt-2 text-[14px] text-[#A1A1AA]">
          {content.home.testimonialsDesc}
        </p>
      </div>

      <div className="mt-16 flex items-start gap-6 overflow-x-auto px-4 pt-5 pb-4 lg:overflow-visible lg:justify-center xl:-mx-32">
        {content.testimonials.map((t) => {
          const isActive = activeTestimonialId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setActiveTestimonialId(t.id)}
              className={`w-[320px] sm:w-[420px] lg:w-[450px] shrink-0 cursor-pointer transition-transform duration-200 ${
                isActive ? '-translate-y-4' : 'hover:-translate-y-1'
              }`}
            >
              <div
                className={`rounded-xl p-8 transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#F20101] text-white shadow-2xl'
                    : 'border border-[#1c1c1c] bg-[#0b0b0b] text-white/85'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-4 w-4 ${
                          isActive
                            ? 'fill-white text-white'
                            : 'fill-[#F59E0B] text-[#F59E0B]'
                        }`}
                      />
                    ))}
                  </div>

                  <svg
                    width="32"
                    height="26"
                    viewBox="0 0 32 26"
                    fill="currentColor"
                    aria-hidden="true"
                    className={isActive ? 'text-white' : 'text-white/15'}
                  >
                    <path d="M0 15.2C0 6.8 5.2 1.6 13.2 0l1.4 3.4C9.4 4.8 6.8 8 6.4 12.2H13V26H0V15.2zm18.4 0C18.4 6.8 23.6 1.6 31.6 0L33 3.4c-5.2 1.4-7.8 4.6-8.2 8.8h6.6V26H18.4V15.2z" />
                  </svg>
                </div>

                <p
                  className={`mt-6 text-[16px] leading-[1.65] ${
                    isActive ? 'text-white font-medium' : 'text-[#A1A1AA]'
                  }`}
                >
                  {t.quote}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3.5 px-1">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="h-[48px] w-[48px] rounded-full object-cover"
                />
                <div>
                  <div className="text-[15px] font-semibold text-white">{t.name}</div>
                  <div className="text-[12px] text-[#8C8C8C]">{t.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

