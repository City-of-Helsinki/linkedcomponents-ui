import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';

const AddingEventsFaq: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getLocalePath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleAddingEvents')}>
      <p>{t('helpPage.faq.textAddingEvents1')}</p>
      <ul>
        <li>{t('authenticationMethod.yle')}</li>
        <li>{t('authenticationMethod.helsinki')}</li>
        <li>{t('authenticationMethod.helsinkiEmployee')}</li>
        <li>{t('authenticationMethod.espooEmployee')}</li>
        <li>{t('authenticationMethod.some')}</li>
      </ul>
      <p
        dangerouslySetInnerHTML={{
          __html: t('helpPage.faq.textAddingEvents2', {
            contactUrl: getLocalePath(ROUTES.SUPPORT_CONTACT),
            eventsInstructionsUrl: getLocalePath(ROUTES.INSTRUCTIONS_EVENTS),
          }),
        }}
      />
    </Accordion>
  );
};

export default AddingEventsFaq;
