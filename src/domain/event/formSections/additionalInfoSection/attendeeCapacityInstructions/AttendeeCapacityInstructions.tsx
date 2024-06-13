import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type AttendeeCapacityInstructionsProps = {
  eventType: string;
};

const AttendeeCapacityInstructions: FC<AttendeeCapacityInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t('event.form.infoTextAttendeeCapacity1')}</p>
      <p>{t(`event.form.infoTextAttendeeCapacity2.${eventType}`)}</p>
      <p>{t('event.form.infoTextAttendeeCapacity3')}</p>
      <p>{t(`event.form.infoTextAttendeeCapacity4.${eventType}`)}</p>
    </>
  );
};

export default AttendeeCapacityInstructions;
