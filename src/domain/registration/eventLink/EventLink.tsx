import React from 'react';
import { Link } from 'react-router-dom';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useEventsQueryStringWithReturnPath from '../../events/hooks/useEventsQueryStringWithReturnPath';
import useRegistrationName from '../hooks/useRegistrationName';
import { getRegistrationFields } from '../utils';
import styles from './eventLink.module.scss';

interface Props {
  registration: RegistrationFieldsFragment;
}

const EventLink: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const queryStringWithReturnPath = useEventsQueryStringWithReturnPath();
  const { eventUrl } = getRegistrationFields(registration, locale);
  const eventUrlWithReturnPath = `${eventUrl}${queryStringWithReturnPath}`;
  const name = useRegistrationName({ registration });

  return (
    <Link className={styles.eventLink} to={eventUrlWithReturnPath}>
      {name}
    </Link>
  );
};

export default EventLink;
