import React from 'react';

import { DATETIME_FORMAT } from '../../../constants';
import { Registration, useEventQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import getPathBuilder from '../../../utils/getPathBuilder';
import { EVENT_INCLUDES } from '../../event/constants';
import { eventPathBuilder, getEventFields } from '../../event/utils';
import { getRegistrationFields } from '../../registrations/utils';
import CreatorBadge from './CreatorBadge';
import styles from './registrationInfo.module.scss';

interface Props {
  registration: Registration;
}

const RegistrationInfo: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const {
    createdBy,
    event: eventId,
    lastModifiedAt,
  } = getRegistrationFields(registration, locale);

  const { data: eventData } = useEventQuery({
    skip: !eventId,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: eventId,
      include: EVENT_INCLUDES,
    },
  });

  const { name } = eventData?.event
    ? getEventFields(eventData?.event, locale)
    : { name: '' };

  return (
    <div className={styles.registrationInfo}>
      <div className={styles.heading}>
        <h1>{name}</h1>
      </div>

      <p className={styles.editingInfo}>
        <span>{formatDate(lastModifiedAt, DATETIME_FORMAT)}</span>
        {createdBy && (
          <>
            <CreatorBadge createdBy={createdBy} />
            <span>{createdBy}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default RegistrationInfo;
