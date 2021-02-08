import classNames from 'classnames';
import { css } from 'emotion';
import {
  IconClock,
  IconEye,
  IconLocation,
  IconTicket,
  IconUser,
} from 'hds-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import IconFlag from '../../../icons/IconFlag';
import { useTheme } from '../../app/theme/Theme';
import StatusTag from '../../event/tags/StatusTag';
import SuperEventTypeTag from '../../event/tags/SuperEventTypeTag';
import { getEventFields } from '../../event/utils';
import AudienceAgeText from './AudienceAgeText';
import DateText from './DateText';
import styles from './eventCard.module.scss';
import PriceText from './PriceText';
import PublisherName from './PublisherName';
import TextWithIcon from './TextWithIcon';

export const testIds = {
  image: 'event-card-image',
};

interface Props {
  event: EventFieldsFragment;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const { theme } = useTheme();
  const locale = useLocale();

  const {
    addressLocality,
    audienceMaxAge,
    audienceMinAge,
    endTime,
    eventStatus,
    eventUrl,
    freeEvent,
    imageUrl,
    inLanguage,
    locationName,
    name,
    offers,
    publisher,
    publicationStatus,
    startTime,
    streetAddress,
    superEventType,
  } = getEventFields(event, locale);

  const inLanguageText = inLanguage.join(', ') || '-';

  const locationText =
    [locationName, streetAddress, addressLocality]
      .filter((e) => e)
      .join(', ') || '-';

  return (
    <Link
      className={classNames(styles.eventCard, css(theme.eventCard))}
      to={eventUrl}
    >
      <div
        data-testid={testIds.image}
        className={styles.imageWrapper}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
      >
        <SuperEventTypeTag superEventType={superEventType} />
      </div>
      <div className={styles.eventInfoWrapper}>
        <div className={styles.nameRow}>
          <h2>{name}</h2>
        </div>
        <div className={styles.dateRow}>
          <div>
            <TextWithIcon
              icon={<IconClock aria-hidden={true} className={styles.icon} />}
              text={<DateText endTime={endTime} startTime={startTime} />}
            />
          </div>
          <div>
            <TextWithIcon
              icon={<IconFlag aria-hidden={true} className={styles.icon} />}
              text={inLanguageText}
            />
          </div>
        </div>

        <div className={styles.publisherRow}>
          <div className={styles.publisherColumn}>
            <div>{publisher ? <PublisherName id={publisher} /> : '-'}</div>
            <div>
              <TextWithIcon
                icon={
                  <IconLocation aria-hidden={true} className={styles.icon} />
                }
                text={locationText}
              />
            </div>
          </div>
          <div className={styles.ticketColumn}>
            <div>
              <TextWithIcon
                icon={<IconTicket aria-hidden={true} className={styles.icon} />}
                text={<PriceText freeEvent={freeEvent} offers={offers} />}
              />
            </div>
            <div>
              <TextWithIcon
                icon={<IconUser aria-hidden={true} className={styles.icon} />}
                text={
                  <AudienceAgeText
                    maxAge={audienceMaxAge}
                    minAge={audienceMinAge}
                  />
                }
              />
            </div>
            <div>
              <TextWithIcon
                icon={<IconEye aria-hidden={true} className={styles.icon} />}
                text={
                  <div className={styles.eventStatusTagWrapper}>
                    <StatusTag
                      eventStatus={eventStatus}
                      publicationStatus={publicationStatus}
                    />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
