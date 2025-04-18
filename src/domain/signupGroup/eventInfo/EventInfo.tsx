import { IconClock, IconLocation, IconTicket, IconUser, Tag } from 'hds-react';
import { t } from 'i18next';
import capitalize from 'lodash/capitalize';
import React from 'react';

import TextWithIcon from '../../../common/components/textWithIcon/TextWithIcon';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import useEventLocation from '../../event/hooks/useEventLocation';
import { getEventFields } from '../../event/utils';
import AudienceAgeText from '../../events/eventCard/audienceAgeText/AudienceAgeText';
import DateText from '../../events/eventCard/dateText/DateText';
import PriceText from '../../events/eventCard/priceText/PriceText';
import { getPlaceFields } from '../../place/utils';
import styles from './eventInfo.module.scss';
import EventTimes from './EventTimes';

type EventInfoProps = {
  event: EventFieldsFragment;
};

const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
  const locale = useLocale();
  const {
    audienceMaxAge,
    audienceMinAge,
    description,
    endTime,
    freeEvent,
    imageUrl,
    keywords,
    name,
    startTime,
  } = getEventFields(event, locale);

  const { location } = useEventLocation(event);
  const {
    addressLocality,
    name: locationName,
    streetAddress,
  } = location
    ? getPlaceFields(location, locale)
    : { addressLocality: '', name: '', streetAddress: '' };
  const locationText =
    [locationName, streetAddress, addressLocality]
      .filter(skipFalsyType)
      .join(', ') || '-';

  return (
    <div className={styles.eventInfo}>
      <div
        className={styles.image}
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : /* istanbul ignore next */ undefined,
        }}
      ></div>
      <div className={styles.eventInfoWrapper}>
        <div className={styles.nameRow}>
          <h1>{name}</h1>
        </div>
        <div className={styles.descriptionRow}>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
        <div className={styles.dateRow}>
          <TextWithIcon
            icon={<IconClock aria-hidden className={styles.icon} />}
            text={<DateText endTime={endTime} startTime={startTime} />}
          />
          <TextWithIcon
            icon={<IconLocation aria-hidden className={styles.icon} />}
            text={locationText}
          />
        </div>
        <div className={styles.ticketRow}>
          <TextWithIcon
            icon={<IconTicket aria-hidden className={styles.icon} />}
            text={
              <PriceText
                freeEvent={freeEvent}
                offers={event.offers.filter(skipFalsyType)}
              />
            }
          />
          <TextWithIcon
            icon={<IconUser aria-hidden className={styles.icon} />}
            text={
              <AudienceAgeText
                maxAge={audienceMaxAge}
                minAge={audienceMinAge}
              />
            }
          />
        </div>
        <div className={styles.keywordsRow}>
          {keywords.map((keyword) => (
            <Tag
              key={keyword.atId}
              id={getValue(keyword.id, '')}
              placeholder={t('keywords.keyword')}
            >
              {capitalize(getLocalisedString(keyword.name, locale))}
            </Tag>
          ))}
        </div>
        <div className={styles.eventTimesRow}>
          <EventTimes event={event} />
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
