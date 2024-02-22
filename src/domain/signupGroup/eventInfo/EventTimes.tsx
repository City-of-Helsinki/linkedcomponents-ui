import orderBy from 'lodash/orderBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../../../common/components/accordion/Accordion';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { getEventFields } from '../../event/utils';
import { getEventTimeStr } from '../../events/utils';
import useEventWithSubEventsData from '../hooks/useEventWithSubEventsData';
import styles from './eventInfo.module.scss';

export type EventTimesProps = {
  event: EventFieldsFragment;
};

const EventTimes: FC<EventTimesProps> = ({ event }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { eventWithSubEvents, loading: isLoadingEvent } =
    useEventWithSubEventsData({
      id: event.id,
      superEventType: event.superEventType,
    });

  if (!event.superEventType) {
    return null;
  }

  return (
    <Accordion
      className={styles.eventTimesAccordion}
      toggleButtonLabel={t('signup.eventTimes')}
    >
      <LoadingSpinner isLoading={isLoadingEvent}>
        <ul>
          {orderBy(
            eventWithSubEvents?.subEvents.filter(skipFalsyType),
            ['startTime', 'endTime'],
            ['asc', 'asc']
          ).map((item) => {
            const { endTime, startTime } = getEventFields(
              item as EventFieldsFragment,
              locale
            );
            return (
              <li key={item.id}>
                {getEventTimeStr({ endTime, language: locale, startTime })}
              </li>
            );
          })}
        </ul>
      </LoadingSpinner>
    </Accordion>
  );
};

export default EventTimes;
