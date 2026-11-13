import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  HelpCircle,
  Inbox,
  Layers,
  Mail,
  Phone,
  Trash2,
} from 'lucide-react';
import type { InquiryItem, SiteContent } from '../../data/siteContent';
import { ConfirmModal, SectionCard } from './AdminFormControls';

interface AdminOverviewSectionProps {
  draft: SiteContent;
  inquiries: InquiryItem[];
  loadingInquiries: boolean;
  onUpdateInquiryStatus: (id: string, status: InquiryItem['status']) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  onJumpSection: (section: string) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  draft,
  inquiries,
  loadingInquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onJumpSection,
}) => {
  const [filter, setFilter] = useState<'all' | InquiryItem['status']>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered =
    filter === 'all'
      ? inquiries
      : inquiries.filter((i) => i.status === filter);

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  const stats = [
    {
      label: 'Portfolio Projects',
      value: draft.projects.length,
      icon: Briefcase,
      section: 'works',
    },
    {
      label: 'Blog Articles',
      value: draft.blogPage.cards.length + draft.homeBlogPosts.length,
      icon: FileText,
      section: 'blog',
    },
    {
      label: 'Service Offerings',
      value: draft.servicesPage.cards.length + draft.homeServices.length,
      icon: Layers,
      section: 'services',
    },
    {
      label: 'Unread Inquiries',
      value: newCount,
      icon: Inbox,
      section: 'overview',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.label}
              type="button"
              onClick={() => onJumpSection(st.section)}
              className="flex items-center justify-between rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-5 text-left hover:border-[#00BC91]/60 transition-colors cursor-pointer"
            >
              <div>
                <div className="text-[12px] text-[#8C8C8C]">{st.label}</div>
                <div className="mt-2 text-[28px] font-bold text-white tabular-nums">
                  {st.value}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#121212] text-[#00BC91]">
                <Icon className="h-5 w-5" />
              </div>
            </button>
          );
        })}
      </div>

      <SectionCard
        title="Client Inquiries Inbox"
        description="Messages submitted from the Home and Contact Us project forms."
        action={
          <div className="inline-flex items-center rounded-lg border border-[#1f1f1f] bg-[#080808] p-1">
            {(['all', 'new', 'read', 'replied'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-[#F20101] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        {loadingInquiries ? (
          <div className="py-10 text-center text-[13px] text-[#8C8C8C]">
            Loading inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#202020] py-12 text-center">
            <Inbox className="mx-auto h-7 w-7 text-white/30" />
            <p className="mt-2 text-[13px] text-[#8C8C8C]">
              No inquiries in this view yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inq) => (
              <div
                key={inq.id}
                className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[15px] font-semibold text-white">
                        {inq.firstName} {inq.lastName || ''}
                      </span>
                      <span className="rounded-md border border-[#242424] bg-[#121212] px-2 py-0.5 text-[11px] text-[#00BC91]">
                        {inq.service || 'General Inquiry'}
                      </span>
                      <span className="text-[11px] uppercase text-[#8C8C8C]">
                        via {inq.source}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-white/50" />
                        {inq.email}
                      </span>
                      {inq.phone && (
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                          <Phone className="h-3.5 w-3.5 text-white/50" />
                          {inq.phone}
                        </span>
                      )}
                      <span className="text-[#71717A]">
                        {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        void onUpdateInquiryStatus(
                          inq.id,
                          e.target.value as InquiryItem['status']
                        )
                      }
                      className="rounded-md border border-[#222222] bg-[#111111] px-2.5 py-1.5 text-[12px] font-medium text-white focus:border-[#00BC91] focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(inq.id)}
                      aria-label="Delete inquiry"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-white/60 hover:border-[#F20101] hover:text-[#F20101] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 rounded-md border border-[#161616] bg-[#0c0c0c] p-3 text-[13px] leading-relaxed text-[#CCCCCC]">
                  {inq.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Quick Navigation"
        description="Jump straight to any public page section to edit copy, images, or lists."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onJumpSection('home')}
            className="flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#080808] p-4 text-left hover:border-[#F20101] cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-[#00BC91]" />
            <div>
              <div className="text-[13px] font-semibold text-white">Home &amp; Branding</div>
              <div className="text-[11px] text-[#8C8C8C]">Hero, Marquee, About, CV</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onJumpSection('works')}
            className="flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#080808] p-4 text-left hover:border-[#F20101] cursor-pointer"
          >
            <Briefcase className="h-4 w-4 text-[#F20101]" />
            <div>
              <div className="text-[13px] font-semibold text-white">Portfolios &amp; Details</div>
              <div className="text-[11px] text-[#8C8C8C]">Projects &amp; case studies</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onJumpSection('services')}
            className="flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#080808] p-4 text-left hover:border-[#F20101] cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-[#00BC91]" />
            <div>
              <div className="text-[13px] font-semibold text-white">Services, Pricing &amp; FAQ</div>
              <div className="text-[11px] text-[#8C8C8C]">Plans, deliverables, Q&amp;A</div>
            </div>
          </button>
        </div>
      </SectionCard>

      <ConfirmModal
        open={deleteTargetId !== null}
        title="Delete Inquiry"
        description="Are you sure you want to delete this client message? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            void onDeleteInquiry(deleteTargetId);
          }
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};
