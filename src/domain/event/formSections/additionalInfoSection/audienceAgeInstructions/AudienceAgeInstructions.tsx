import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type AudienceAgeInstructionsProps = {
  eventType: string;
};

const AudienceAgeInstructions: FC<AudienceAgeInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextAudienceAge.${eventType}`)}</p>;
};

export default AudienceAgeInstructions;
