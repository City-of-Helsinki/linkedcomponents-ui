import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type AudienceInstructionsProps = {
  eventType: string;
};

const AudienceInstructions: FC<AudienceInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextAudience.${eventType}`)}</p>;
};

export default AudienceInstructions;
