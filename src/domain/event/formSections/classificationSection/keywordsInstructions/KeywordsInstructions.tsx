import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type KeywordsInstructionsProps = {
  eventType: string;
};

const KeywordsInstructions: FC<KeywordsInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextKeywords.${eventType}`)}</p>;
};

export default KeywordsInstructions;
