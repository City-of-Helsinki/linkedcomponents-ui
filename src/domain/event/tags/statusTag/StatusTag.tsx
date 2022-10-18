import { ClassNames } from '@emotion/react';
import { IconArrowRedo, IconCheck, IconCross, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import upperCaseFirstLetter from '../../../../utils/upperCaseFirstLetter';
import { useTheme } from '../../../app/theme/Theme';
import styles from './statusTag.module.scss';

const eventStatusWhiteList = [
  EventStatus.EventCancelled,
  EventStatus.EventPostponed,
];

const eventStatusIconMap = {
  [EventStatus.EventCancelled]: <IconCross aria-hidden={true} />,
  [EventStatus.EventPostponed]: <IconArrowRedo aria-hidden={true} />,
  [EventStatus.EventRescheduled]: null,
  [EventStatus.EventScheduled]: null,
};

const publicationStatusIconMap = {
  [PublicationStatus.Draft]: <IconPen aria-hidden={true} />,
  [PublicationStatus.Public]: <IconCheck aria-hidden={true} />,
};

interface Props {
  eventStatus: EventStatus;
  publicationStatus: PublicationStatus;
  size?: 's' | 'm';
}

const StatusTag: React.FC<Props> = ({
  eventStatus,
  publicationStatus,
  size = 's',
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const showEventStatus = eventStatusWhiteList.includes(eventStatus);

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(
            styles.statusTag,
            css(theme.statusTag),
            styles[`size${upperCaseFirstLetter(size)}`],
            styles[
              `status${upperCaseFirstLetter(
                showEventStatus ? eventStatus : publicationStatus
              )}`
            ]
          )}
        >
          {/* Icon */}
          {showEventStatus
            ? eventStatusIconMap[eventStatus]
            : publicationStatusIconMap[publicationStatus]}
          {/* Text */}
          {showEventStatus
            ? t(`event.eventStatus.${lowerCaseFirstLetter(eventStatus)}`)
            : t(
                `event.publicationStatus.${lowerCaseFirstLetter(
                  publicationStatus
                )}`
              )}
        </div>
      )}
    </ClassNames>
  );
};

export default StatusTag;
