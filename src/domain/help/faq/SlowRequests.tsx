import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../common/components/accordion/Accordion';

const SlowRequestsFaq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleSlowRequests')}>
      <p>{t('helpPage.faq.textSlowRequests')}</p>
    </Accordion>
  );
};

export default SlowRequestsFaq;
