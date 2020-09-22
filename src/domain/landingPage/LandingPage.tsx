import React from 'react';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return <div>{t('appName')}</div>;
};

export default LandingPage;
