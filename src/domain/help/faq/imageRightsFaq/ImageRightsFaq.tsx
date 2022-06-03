import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../../common/components/accordion/Accordion';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';

const ImageRightsFaq: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getLocalePath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <Accordion toggleButtonLabel={t('helpPage.faq.titleImageRights')}>
      <p
        dangerouslySetInnerHTML={{
          __html: t('helpPage.faq.textImageRights', {
            controlPanelUrl: getLocalePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL),
          }),
        }}
      ></p>
    </Accordion>
  );
};

export default ImageRightsFaq;
