import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';

const RegistrationForRecurringEventFaq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Accordion
      toggleButtonLabel={t('helpPage.faq.titleRegistrationForRecurringEvent')}
    >
      <p>{t('helpPage.faq.textRegistrationForRecurringEvent')}</p>
    </Accordion>
  );
};

export default RegistrationForRecurringEventFaq;
