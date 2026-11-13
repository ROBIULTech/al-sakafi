import React from 'react';
import { PageRoute } from '../components/Layout';
import { ProjectContactCard } from '../components/SharedSections';
import { SubpageBanner } from '../components/SubpageBanner';

interface ContactPageProps {
  preselectedService: string;
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedService,
  onNavigate,
}) => {
  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Contact Us"
        breadcrumbLabel="Contact Us"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <ProjectContactCard preselectedService={preselectedService} />
      </section>
    </div>
  );
};
