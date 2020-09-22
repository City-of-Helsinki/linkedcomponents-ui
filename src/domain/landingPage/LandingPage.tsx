import React from 'react';
import { useTranslation } from 'react-i18next';

import PageWrapper from '../app/layout/PageWrapper';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return <PageWrapper>{t('appName')}</PageWrapper>;
};

export default LandingPage;
