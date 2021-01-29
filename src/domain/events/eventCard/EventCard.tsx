import classNames from 'classnames';
import { css } from 'emotion';
import {
  IconAngleDown,
  IconAngleUp,
  IconClock,
  IconEye,
  IconLocation,
  IconTicket,
  IconUser,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
import SubEventCards from './SubEventCards';
import TextWithIcon from './TextWithIcon';

export const testIds = {
  image: 'event-card-image',
};

interface Props {
  event: EventFieldsFragment;
  level?: number;
}

const EventCard: React.FC<Props> = ({ event, level = 0 }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);

  const {
    addressLocality,
    audienceMaxAge,
    audienceMinAge,
    endTime,
    eventStatus,
    eventUrl,
    freeEvent,
    id,
    imageUrl,
    inLanguage,
    locationName,
    name,
    offers,
    publisher,
    publicationStatus,
    startTime,
    streetAddress,
    subEventAtIds,
    superEventType,
  } = getEventFields(event, locale);

  const inLanguageText = inLanguage.join(', ') || '-';

  const locationText =
    [locationName, streetAddress, addressLocality]
      .filter((e) => e)
      .join(', ') || '-';

  const toggle = () => {
    setOpen(!open);
  };
  return (
    <>
      <div
        className={styles.eventCardWrapper}
        style={{
          marginLeft: `calc(${level} * var(--spacing-l))`,
          marginRight: `calc(0px - ${level} * var(--spacing-l))`,
        }}
      >
        <Link
          className={classNames(styles.eventCard, css(theme.eventCard))}
          to={eventUrl}
        >
          <div
            data-testid={testIds.image}
            className={styles.imageWrapper}
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            }}
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
                  icon={
                    <IconClock aria-hidden={true} className={styles.icon} />
                  }
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
                      <IconLocation
                        aria-hidden={true}
                        className={styles.icon}
                      />
                    }
                    text={locationText}
                  />
                </div>
              </div>
              <div className={styles.ticketColumn}>
                <div>
                  <TextWithIcon
                    icon={
                      <IconTicket aria-hidden={true} className={styles.icon} />
                    }
                    text={<PriceText freeEvent={freeEvent} offers={offers} />}
                  />
                </div>
                <div>
                  <TextWithIcon
                    icon={
                      <IconUser aria-hidden={true} className={styles.icon} />
                    }
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
                    icon={
                      <IconEye aria-hidden={true} className={styles.icon} />
                    }
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
        {!!subEventAtIds.length && (
          <button className={styles.toggleButton} onClick={toggle}>
            {open ? (
              <IconAngleUp aria-hidden={true} size="s" />
            ) : (
              <IconAngleDown aria-hidden={true} size="s" />
            )}
            <span>
              {open
                ? t('eventsPage.eventCard.hideSubEvents')
                : t('eventsPage.eventCard.showSubEvents', {
                    count: subEventAtIds.length,
                  })}
            </span>
          </button>
        )}
      </div>
      {!!subEventAtIds.length && open && (
        <SubEventCards eventId={id} level={level + 1} />
      )}
    </>
  );
};

export default EventCard;
