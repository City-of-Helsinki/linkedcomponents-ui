import { Notification } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { getRegistrationWarning } from '../../registration/utils';
import styles from './registrationWarning.module.scss';

type Props = {
  registration: RegistrationFieldsFragment;
};

const RegistrationWarning: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const registrationWarning = getRegistrationWarning(registration, t);

  return registrationWarning ? (
    <Notification className={styles.warning}>
      {registrationWarning}
    </Notification>
  ) : null;
};

export default RegistrationWarning;
