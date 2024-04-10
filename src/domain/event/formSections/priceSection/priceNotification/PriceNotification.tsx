import { useField } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../../constants';

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
      <p>{t(`event.form.infoTextOffers1.${type}`)}</p>
      <p>{t(`event.form.infoTextOffers2.${type}`)}</p>
    </Notification>
  );
};

export default PriceNotification;
