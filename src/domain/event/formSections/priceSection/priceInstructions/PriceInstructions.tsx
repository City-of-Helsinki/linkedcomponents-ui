import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { featureFlagUtils } from '../../../../../utils/featureFlags';

export type PriceInstructionsProps = {
  eventType: string;
};

const PriceInstructions: FC<PriceInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t(`event.form.infoTextOffers1.${eventType}`)}</p>
      <p>{t(`event.form.infoTextOffers2.${eventType}`)}</p>
      {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') && (
        <p>{t(`event.form.infoTextOffers3.${eventType}`)}</p>
      )}
    </>
  );
};

export default PriceInstructions;
