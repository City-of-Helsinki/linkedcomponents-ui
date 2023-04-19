import React from 'react';
import { Link } from 'react-router-dom';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import { getRegistrationFields } from '../utils';
import styles from './eventLink.module.scss';

interface Props {
  registration: RegistrationFieldsFragment;
}

const EventLink: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { event } = getRegistrationFields(registration, locale);
  const eventUrlWithReturnPath = `${event?.eventUrl}${queryStringWithReturnPath}`;

  return (
    <Link className={styles.eventLink} to={eventUrlWithReturnPath}>
      {event?.name}
    </Link>
  );
};

export default EventLink;
