import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type TimeInstructionsProps = {
  eventType: string;
};
const TimeInstructions: FC<TimeInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t(`event.form.infoTextEventTimes1.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes2.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes3.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes4.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes5`)}</p>
    </>
  );
};

export default TimeInstructions;
