import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_SITE_CONTENT,
  type InquiryItem,
  type SiteContent,
} from '../data/siteContent';

const LOCAL_CACHE_KEY = 'xfolio_cms_cache_v1';

interface SiteContentContextValue {
  content: SiteContent;
  loaded: boolean;
  setContentLocal: (next: SiteContent) => void;
  refreshContent: () => Promise<void>;
  saveContent: (next: SiteContent, token: string) => Promise<void>;
  resetContent: (token: string) => Promise<SiteContent>;
  submitInquiry: (
    payload: Omit<InquiryItem, 'id' | 'status' | 'createdAt'>
  ) => Promise<void>;
  submitReview: (name: string, text: string) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function mergeContent(raw: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...raw,
    global: { ...DEFAULT_SITE_CONTENT.global, ...(raw.global || {}) },
    home: { ...DEFAULT_SITE_CONTENT.home, ...(raw.home || {}) },
    about: { ...DEFAULT_SITE_CONTENT.about, ...(raw.about || {}) },
    servicesPage: { ...DEFAULT_SITE_CONTENT.servicesPage, ...(raw.servicesPage || {}) },
    servicesDetails: { ...DEFAULT_SITE_CONTENT.servicesDetails, ...(raw.servicesDetails || {}) },
    worksDetails: { ...DEFAULT_SITE_CONTENT.worksDetails, ...(raw.worksDetails || {}) },
    blogPage: { ...DEFAULT_SITE_CONTENT.blogPage, ...(raw.blogPage || {}) },
    blogDetails: { ...DEFAULT_SITE_CONTENT.blogDetails, ...(raw.blogDetails || {}) },
    faq: { ...DEFAULT_SITE_CONTENT.faq, ...(raw.faq || {}) },
    contact: { ...DEFAULT_SITE_CONTENT.contact, ...(raw.contact || {}) },
  };
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        return mergeContent(JSON.parse(cached) as Partial<SiteContent>);
      }
    } catch {
      // Ignore cache read error
    }
    return DEFAULT_SITE_CONTENT;
  });
  const [loaded, setLoaded] = useState(false);

  const setContentLocal = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as Partial<SiteContent>;
        setContentLocal(mergeContent(data));
      }
    } catch {
      // Keep default/cached content on network error
    } finally {
      setLoaded(true);
    }
  }, [setContentLocal]);

  useEffect(() => {
    void refreshContent();
  }, [refreshContent]);

  const saveContent = useCallback(
    async (next: SiteContent, token: string) => {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'Failed to save changes.');
      }
      setContentLocal(next);
    },
    [setContentLocal]
  );

  const resetContent = useCallback(
    async (token: string) => {
      const res = await fetch('/api/cms/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'Failed to reset content.');
      }
      const data = (await res.json()) as { content: SiteContent };
      const merged = mergeContent(data.content);
      setContentLocal(merged);
      return merged;
    },
    [setContentLocal]
  );

  const submitInquiry = useCallback(
    async (payload: Omit<InquiryItem, 'id' | 'status' | 'createdAt'>) => {
      try {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Silent fallback on network error
      }
    },
    []
  );

  const submitReview = useCallback(
    async (name: string, text: string) => {
      const dateStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const optimisticRev = {
        id: `rev-${Date.now()}`,
        name: name.trim(),
        date: dateStr,
        avatar: '/assets/images/avatar-esther.png',
        text: text.trim().startsWith('“') ? text.trim() : `“${text.trim()}”`,
      };
      setContentLocal({
        ...content,
        blogDetails: {
          ...content.blogDetails,
          reviews: [...content.blogDetails.reviews, optimisticRev],
        },
      });
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, text }),
        });
      } catch {
        // Keep optimistic update
      }
    },
    [content, setContentLocal]
  );

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loaded,
        setContentLocal,
        refreshContent,
        saveContent,
        resetContent,
        submitInquiry,
        submitReview,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used inside SiteContentProvider');
  }
  return ctx;
}
