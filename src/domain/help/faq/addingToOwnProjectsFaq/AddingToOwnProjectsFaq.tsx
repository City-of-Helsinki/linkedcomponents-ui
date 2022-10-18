import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';

const AddingToOwnProjectsFaq: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getLocalePath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleAddingToOwnProjects')}>
      <p
        dangerouslySetInnerHTML={{
          __html: t('helpPage.faq.textAddingToOwnProjects', {
            termsOfServiceUrl: getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE),
          }),
        }}
      ></p>
    </Accordion>
  );
};

export default AddingToOwnProjectsFaq;
