import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type InfoLanguagesInstructionsProps = {
  eventType: string;
};

const InfoLanguagesInstructions: FC<InfoLanguagesInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: t(`event.form.infoTextInfoLanguages.${eventType}`),
      }}
    />
  );
};

export default InfoLanguagesInstructions;
