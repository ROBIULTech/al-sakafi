import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Layout, PageRoute } from './components/Layout';
import {
  BlogModal,
  CvModal,
  ProjectModal,
  ServiceModal,
} from './components/PortfolioModals';
import { BlogPost, ProjectItem, ServiceItem } from './data/portfolioData';
import { AboutPage } from './pages/AboutPage';
import { BlogDetailsPage } from './pages/BlogDetailsPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ServicesDetailsPage } from './pages/ServicesDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorksDetailsPage } from './pages/WorksDetailsPage';
import { WorksPage } from './pages/WorksPage';

const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);

const VALID_ROUTES: PageRoute[] = [
  '/',
  '/about',
  '/services',
  '/services-details',
  '/works',
  '/works-details',
  '/blog',
  '/blog-details',
  '/contact',
];

const PAGE_TITLES: Record<PageRoute, string> = {
  '/': 'XFOLIO — Full Stack Web Developer Portfolio',
  '/about': 'About Us — XFOLIO Full Stack Web Developer',
  '/services': 'Services — XFOLIO Full Stack Web Developer',
  '/services-details': 'Services Details — XFOLIO Full Stack Web Developer',
  '/works': 'Portfolios — XFOLIO Full Stack Web Developer',
  '/works-details': 'Portfolios Details — XFOLIO Full Stack Web Developer',
  '/blog': 'Blog — XFOLIO Full Stack Web Developer',
  '/blog-details': 'Blog Details — XFOLIO Full Stack Web Developer',
  '/contact': 'Contact Us — XFOLIO Full Stack Web Developer',
};

function cleanPathname(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  return cleaned.toLowerCase();
}

function isPublicRoute(pathname: string): pathname is PageRoute {
  return VALID_ROUTES.includes(cleanPathname(pathname) as PageRoute);
}

function normalizePublicPath(pathname: string): PageRoute {
  const cleaned = cleanPathname(pathname);
  if (VALID_ROUTES.includes(cleaned as PageRoute)) {
    return cleaned as PageRoute;
  }
  return '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    normalizePublicPath(window.location.pathname)
  );
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [resolvingRoute, setResolvingRoute] = useState(
    () => !isPublicRoute(window.location.pathname)
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeWorkDetail, setActiveWorkDetail] = useState<ProjectItem | null>(null);
  const [activeBlogTitle, setActiveBlogTitle] = useState<string>('');
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  const resolveCurrentLocation = useCallback(async (pathname: string) => {
    const cleaned = cleanPathname(pathname);
    if (isPublicRoute(cleaned)) {
      setIsAdminRoute(false);
      setCurrentRoute(cleaned);
      setResolvingRoute(false);
      return;
    }

    setResolvingRoute(true);
    try {
      const res = await fetch('/api/auth/resolve-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname: cleaned }),
      });
      if (res.ok) {
        const data = (await res.json()) as { isAdminRoute?: boolean };
        if (data.isAdminRoute) {
          setIsAdminRoute(true);
          setResolvingRoute(false);
          return;
        }
      }
    } catch {
      // Fall through to home route if resolution fails
    }

    setIsAdminRoute(false);
    setCurrentRoute('/');
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
    setResolvingRoute(false);
  }, []);

  const navigate = useCallback((route: PageRoute) => {
    setIsAdminRoute(false);
    setResolvingRoute(false);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isPublicRoute(window.location.pathname)) {
      void resolveCurrentLocation(window.location.pathname);
    }
    const handlePopState = () => {
      void resolveCurrentLocation(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveCurrentLocation]);

  useEffect(() => {
    if (isAdminRoute) {
      document.title = 'Admin Panel — XFOLIO CMS';
    } else {
      document.title = PAGE_TITLES[currentRoute];
    }
  }, [currentRoute, isAdminRoute]);

  const handleBookServiceOrPlan = (label: string) => {
    setPreselectedService(label);
    navigate('/contact');
  };

  if (resolvingRoute) {
    return <div className="min-h-screen bg-[#060606]" />;
  }

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#060606]" />}>
        <AdminPage
          onNavigate={navigate}
          onAdminPathUpdated={(nextPath) => {
            if (window.location.pathname !== nextPath) {
              window.history.replaceState({}, '', nextPath);
            }
          }}
        />
      </Suspense>
    );
  }

  return (
    <Layout currentRoute={currentRoute} onNavigate={navigate}>
      {currentRoute === '/' && (
        <HomePage
          onNavigate={navigate}
          onSelectProject={(proj) => {
            setActiveWorkDetail(proj);
            navigate('/works-details');
          }}
          onSelectBlog={(post) => {
            setActiveBlogTitle(post.title);
            navigate('/blog-details');
          }}
          onSelectService={() => navigate('/services-details')}
          onOpenCv={() => setCvModalOpen(true)}
          onSelectPlan={handleBookServiceOrPlan}
        />
      )}

      {currentRoute === '/about' && (
        <AboutPage
          onNavigate={navigate}
          onSelectPlan={handleBookServiceOrPlan}
        />
      )}

      {currentRoute === '/services' && (
        <ServicesPage
          onNavigate={navigate}
          onSelectPlan={handleBookServiceOrPlan}
        />
      )}

      {currentRoute === '/services-details' && (
        <ServicesDetailsPage onNavigate={navigate} />
      )}

      {currentRoute === '/works' && (
        <WorksPage
          onNavigate={navigate}
          onSelectProject={(proj) => setActiveWorkDetail(proj)}
        />
      )}

      {currentRoute === '/works-details' && (
        <WorksDetailsPage
          project={activeWorkDetail}
          onNavigate={navigate}
        />
      )}

      {currentRoute === '/blog' && (
        <BlogPage
          onNavigate={navigate}
          onOpenBlogDetails={(title) => {
            setActiveBlogTitle(title);
            navigate('/blog-details');
          }}
        />
      )}

      {currentRoute === '/blog-details' && (
        <BlogDetailsPage
          articleTitle={activeBlogTitle}
          onNavigate={navigate}
        />
      )}

      {currentRoute === '/contact' && (
        <ContactPage
          preselectedService={preselectedService}
          onNavigate={navigate}
        />
      )}

      {/* Shared Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={handleBookServiceOrPlan}
      />
      <BlogModal post={selectedBlog} onClose={() => setSelectedBlog(null)} />
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelectService={handleBookServiceOrPlan}
      />
      <CvModal open={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </Layout>
  );
}

