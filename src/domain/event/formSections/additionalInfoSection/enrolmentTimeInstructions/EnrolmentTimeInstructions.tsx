import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type EnrolmentTimeInstructionsProps = {
  eventType: string;
};

const EnrolmentTimeInstructions: FC<EnrolmentTimeInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextEnrolmentTime.${eventType}`)}</p>;
};

export default EnrolmentTimeInstructions;
