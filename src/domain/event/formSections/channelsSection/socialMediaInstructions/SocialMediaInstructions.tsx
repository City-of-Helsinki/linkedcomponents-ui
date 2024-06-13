import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type SocialMediaInstructionsProps = {
  eventType: string;
};

const SocialMediaInstructions: FC<SocialMediaInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextSocialMedia.${eventType}`)}</p>;
};

export default SocialMediaInstructions;
