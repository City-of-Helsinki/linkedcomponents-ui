import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';

const EventFormNotWorkingFaq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleEventFormNotWorking')}>
      <p>{t('helpPage.faq.textEventFormNotWorking')}</p>
    </Accordion>
  );
};

export default EventFormNotWorkingFaq;
