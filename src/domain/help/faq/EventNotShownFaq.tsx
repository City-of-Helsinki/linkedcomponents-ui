import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../common/components/accordion/Accordion';

const EventNotShownFaq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleEventNotShown')}>
      <p>{t('helpPage.faq.textEventNotShown')}</p>
    </Accordion>
  );
};

export default EventNotShownFaq;
