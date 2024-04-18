import { Notification } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { getRegistrationWarning } from '../../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../seatsReservation/utils';
import useUser from '../../user/hooks/useUser';
import styles from './registrationWarning.module.scss';

type Props = {
  registration: RegistrationFieldsFragment;
};

const RegistrationWarning: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const publisher = getValue(registration?.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const registrationWarning = getRegistrationWarning({
    organizationAncestors,
    registration,
    t,
    user,
  });

  const hasReservation = useMemo(() => {
    const data = getSeatsReservationData(registration.id as string);
    return Boolean(data && !isSeatsReservationExpired(data));
  }, [registration.id]);

  return registrationWarning && !hasReservation ? (
    <Notification className={styles.warning}>
      {registrationWarning}
    </Notification>
  ) : null;
};

export default RegistrationWarning;
