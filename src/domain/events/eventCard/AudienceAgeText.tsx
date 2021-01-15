import React from 'react';
import { useTranslation } from 'react-i18next';

export interface AudienceAgeTextProps {
  maxAge: number | null;
  minAge: number | null;
}

const AudienceAgeText: React.FC<AudienceAgeTextProps> = ({
  maxAge,
  minAge,
}) => {
  const { t } = useTranslation();
  const getText = () => {
    if (maxAge && minAge) {
      return t('event.audienceAge.between', { max: maxAge, min: minAge });
    } else if (maxAge) {
      return t('event.audienceAge.under', { max: maxAge });
    } else if (minAge) {
      return t('event.audienceAge.over', { min: minAge });
    }
    return '-';
  };
  return <>{getText()}</>;
};

export default AudienceAgeText;
