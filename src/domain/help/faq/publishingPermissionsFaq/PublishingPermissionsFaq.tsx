import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';

const PublishingPermissionsFaq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titlePublishingPermission')}>
      <p>{t('helpPage.faq.textPublishingPermission')}</p>
    </Accordion>
  );
};

export default PublishingPermissionsFaq;
