import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type InLanguagesInstructionsProps = {
  eventType: string;
};

const InLanguagesInstructions: FC<InLanguagesInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextInLanguages.${eventType}`)}</p>;
};

export default InLanguagesInstructions;
