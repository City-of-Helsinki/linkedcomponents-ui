import { FC, useEffect, useRef } from 'react';

import Notification from '../../../common/components/notification/Notification';
import styles from './successNotification.module.scss';

type Props = {
  label: string;
  text: string;
};
const SuccessNotification: FC<Props> = ({ label, text }) => {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    labelRef.current?.focus();
  }, []);

  return (
    <Notification
      className={styles.successNotification}
      label={
        <div tabIndex={-1} ref={labelRef}>
          {label}
        </div>
      }
      type="success"
    >
      {text}
    </Notification>
  );
};

export default SuccessNotification;
