import React from 'react';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t } = useTranslation();

  return <div>{t('appName')}</div>;
};

export default App;
