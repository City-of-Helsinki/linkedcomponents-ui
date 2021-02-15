import React from 'react';

import PageWrapper from '../app/layout/PageWrapper';
import Hero from './hero/Hero';

const LandingPage: React.FC = () => {
  return (
    <PageWrapper>
      <Hero />
    </PageWrapper>
  );
};

export default LandingPage;
