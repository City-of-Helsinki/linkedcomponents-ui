import { useField } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../../constants';
import PriceInstructions from '../priceInstructions/PriceInstructions';

type PriceNotificationProps = {
  className?: string;
};

const PriceNotification: FC<PriceNotificationProps> = ({ className }) => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <Notification
      className={className}
      label={t(`event.form.notificationTitleOffers`)}
      type="info"
    >
      <PriceInstructions eventType={type} />
    </Notification>
  );
};

export default PriceNotification;
