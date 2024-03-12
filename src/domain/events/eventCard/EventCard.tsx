import { ClassNames } from '@emotion/react';
import {
  Button,
  Card,
  IconAngleDown,
  IconAngleUp,
  IconClock,
  IconLocation,
  IconPhoto,
  IconTicket,
  IconUser,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import TextWithIcon from '../../../common/components/textWithIcon/TextWithIcon';
import { testIds } from '../../../constants';
import { EventFieldsFragment } from '../../../generated/graphql';
import useIsMobile from '../../../hooks/useIsMobile';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import IconFlag from '../../../icons/IconFlag';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { usePageSettings } from '../../app/hooks/usePageSettings';
import { useTheme } from '../../app/theme/Theme';
import useEventLocation from '../../event/hooks/useEventLocation';
import StatusTag from '../../event/tags/statusTag/StatusTag';
import SuperEventTypeTag from '../../event/tags/superEventTypeTag/SuperEventTypeTag';
import { getEventFields } from '../../event/utils';
import OrganizationName from '../../organization/organizationName/OrganizationName';
import { getPlaceFields } from '../../place/utils';
import EventActionsDropdown from '../eventActionsDropdown/EventActionsDropdown';
import { getEventItemId } from '../utils';
import AudienceAgeText from './audienceAgeText/AudienceAgeText';
import DateText from './dateText/DateText';
import styles from './eventCard.module.scss';
import PriceText from './priceText/PriceText';
import SubEventCards from './subEventCards/SubEventCards';

interface Props {
  event: EventFieldsFragment;
  level?: number;
}

const EventCard: React.FC<Props> = ({ event, level = 0 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const locale = useLocale();
  const isMobile = useIsMobile();
  const {
    events: { addExpandedEvent, expandedEvents, removeExpandedEvent },
  } = usePageSettings();

  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const { location } = useEventLocation(event);

  const {
    audienceMaxAge,
    audienceMinAge,
    endTime,
    eventStatus,
    eventUrl,
    freeEvent,
    id,
    imageUrl,
    inLanguage,
    name,
    publisher,
    publicationStatus,
    startTime,
    subEventAtIds,
    superEventType,
  } = getEventFields(event, locale);
  const {
    addressLocality,
    name: locationName,
    streetAddress,
  } = location
    ? getPlaceFields(location, locale)
    : { addressLocality: '', name: '', streetAddress: '' };

  const eventUrlWithReturnPath = `${eventUrl}${queryStringWithReturnPath}`;

  const open = expandedEvents.includes(id);

  const inLanguageText = getValue(inLanguage.join(', '), '-');

  const locationText = getValue(
    [locationName, streetAddress, addressLocality]
      .filter(skipFalsyType)
      .join(', '),
    '-'
  );

  const toggle = () => {
    if (open) {
      removeExpandedEvent(id);
    } else {
      addExpandedEvent(id);
    }
  };

  return (
    <ClassNames>
      {({ css, cx }) => (
        <>
          <Card
            className={styles.eventCardWrapper}
            id={getEventItemId(id)}
            data-testid={event.id}
            style={{
              marginLeft: `calc(${level} * var(--spacing-l))`,
              marginRight: `calc(0px - ${level} * var(--spacing-l))`,
            }}
          >
            <div className={cx(styles.eventCard, css(theme.eventCard))}>
              <div className={styles.imageWrapper}>
                {/* Placeholder image */}
                <div className={styles.placeholderImage}>
                  <IconPhoto size={isMobile ? 'xl' : 'l'} />
                </div>
                {/* Event image is hiding placeholder image when it's loaded */}
                <div
                  data-testid={testIds.eventCard.image}
                  className={styles.image}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                  }}
                />
                {/* Super event type tag is the topmost element at image wrapper */}
                <SuperEventTypeTag
                  className={styles.tag}
                  superEventType={superEventType}
                />
              </div>
              <div className={styles.eventInfoWrapper}>
                <div className={styles.nameRow}>
                  <h2>{name}</h2>
                </div>
                <div className={cx(styles.row, styles.publisherRow)}>
                  <div className={styles.publisherColumn}>
                    <OrganizationName id={publisher} withIcon={true} />
                  </div>
                  <div className={styles.statusTagColumn}>
                    <StatusTag
                      eventStatus={eventStatus}
                      publicationStatus={publicationStatus}
                    />
                  </div>
                  <div className={styles.dateDesktopColumn}>
                    <TextWithIcon
                      icon={
                        <IconClock aria-hidden={true} className={styles.icon} />
                      }
                      text={
                        <DateText endTime={endTime} startTime={startTime} />
                      }
                    />
                  </div>
                  <div className={styles.locationDesktopColumn}>
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
                <div className={cx(styles.row, styles.dateRow)}>
                  <div className={styles.dateColumn}>
                    <TextWithIcon
                      icon={
                        <IconClock aria-hidden={true} className={styles.icon} />
                      }
                      text={
                        <DateText endTime={endTime} startTime={startTime} />
                      }
                    />
                  </div>
                  <div className={styles.locationColumn}>
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
                <EventActionsDropdown
                  className={styles.actionButtons}
                  event={event}
                />
                <div className={cx(styles.row, styles.priceRow)}>
                  <div className={styles.priceColumn}>
                    <TextWithIcon
                      icon={
                        <IconTicket
                          aria-hidden={true}
                          className={styles.icon}
                        />
                      }
                      text={
                        <PriceText
                          freeEvent={freeEvent}
                          offers={event.offers.filter(skipFalsyType)}
                        />
                      }
                    />
                  </div>
                  <div className={styles.audienceColumn}>
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
                  <div className={styles.languageColumn}>
                    <TextWithIcon
                      icon={
                        <IconFlag aria-hidden={true} className={styles.icon} />
                      }
                      text={inLanguageText}
                    />
                  </div>
                  <div className={styles.statusTagDesktopColumn}>
                    <StatusTag
                      eventStatus={eventStatus}
                      publicationStatus={publicationStatus}
                    />
                  </div>
                </div>
                <div className={cx(styles.row, styles.ctaRow)}>
                  <Button
                    fullWidth
                    className={styles.cta}
                    role="link"
                    aria-label={t(
                      'eventsPage.eventCard.goToEventPageAriaLabel',
                      { name }
                    )}
                    onClick={(e?: React.MouseEvent) => {
                      e?.preventDefault();

                      navigate(eventUrlWithReturnPath);
                    }}
                  >
                    {t('eventsPage.eventCard.goToEventPage')}
                  </Button>
                </div>
              </div>
            </div>
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
          </Card>
          {!!subEventAtIds.length && open && (
            <SubEventCards eventId={id} level={level + 1} />
          )}
        </>
      )}
    </ClassNames>
  );
};

export default EventCard;
