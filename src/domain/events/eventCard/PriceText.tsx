import React from 'react';
import { useTranslation } from 'react-i18next';

import { Offer } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';

export interface PriceTextProps {
  freeEvent: boolean;
  offers: Offer[];
}

const PriceText: React.FC<PriceTextProps> = ({ freeEvent, offers }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getText = () => {
    return freeEvent
      ? t('event.freeEvent')
      : offers
          .map((offer) => getLocalisedString(offer.price, locale))
          .filter((t) => t)
          .join(', ') || '-';
  };
  return <>{getText()}</>;
};

export default PriceText;
