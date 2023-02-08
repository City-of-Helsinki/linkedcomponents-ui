import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { EventFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';
import styles from '../../eventPage.module.scss';
import { getEventFields } from '../../utils';

interface Props {
  event: EventFieldsFragment;
}

const LinksToEventsSection: React.FC<Props> = ({ event }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();

  const { id, superEventType } = getEventFields(event, locale);

  const EventName = useCallback(
    (event: EventFieldsFragment) => {
      const { eventUrl, id: itemId, name } = getEventFields(event, locale);
      if (id === itemId) return <>{name}</>;

      return (
        <Link
          className={styles.hierarchyLink}
          to={{ pathname: eventUrl, search: location.search }}
        >
          {name}
        </Link>
      );
    },
    [id, locale, location.search]
  );

  const showLinks = Boolean(superEventType || event.superEvent?.superEventType);

  if (!showLinks) {
    return <p>{t('event.form.textNoLinksToEvents')}</p>;
  }

  return (
    <EventHierarchy
      event={event}
      eventNameRenderer={EventName}
      showSuperEvent={true}
    />
  );
};

export default LinksToEventsSection;
