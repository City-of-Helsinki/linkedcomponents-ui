import {
  IconArrowLeft,
  IconCalendarClock,
  IconCalendarCross,
  IconCheck,
  IconCross,
  IconPen,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Button from '../../../common/components/button/Button';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { PAGE_HEADER_ID, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useWindowSize from '../../../hooks/useWindowSize';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import { getEventFields } from '../utils';
import styles from './editButtonPanel.module.scss';

export enum BUTTONS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  PUBLISH = 'publish',
  UPDATE_DRAFT = 'updateDraft',
  UPDATE_PUBLIC = 'updatePublic',
}

export interface EditButtonPanelProps {
  event: EventFieldsFragment;
  onCancel: () => void;
  onDelete: () => void;
  onPostpone: () => void;
  onUpdate: (publicationStatus: PublicationStatus) => void;
}

const getTop = (): number => {
  const pageHeader = document.getElementById(PAGE_HEADER_ID);
  return pageHeader?.clientHeight ? pageHeader.clientHeight - 2 : 0;
};

const NOT_ALLOWED_WHEN_CANCELLED = [
  BUTTONS.CANCEL,
  BUTTONS.POSTPONE,
  BUTTONS.PUBLISH,
  BUTTONS.UPDATE_DRAFT,
  BUTTONS.UPDATE_PUBLIC,
];

const iconMap = {
  [BUTTONS.CANCEL]: <IconCalendarCross />,
  [BUTTONS.DELETE]: <IconCross />,
  [BUTTONS.POSTPONE]: <IconCalendarClock />,
  [BUTTONS.PUBLISH]: <IconCheck />,
  [BUTTONS.UPDATE_DRAFT]: <IconPen />,
  [BUTTONS.UPDATE_PUBLIC]: <IconPen />,
};

const labelKeyMap = {
  [BUTTONS.CANCEL]: 'event.form.buttonCancel',
  [BUTTONS.DELETE]: 'event.form.buttonDelete',
  [BUTTONS.POSTPONE]: 'event.form.buttonPostpone',
  [BUTTONS.PUBLISH]: 'event.form.buttonAcceptAndPublish',
  [BUTTONS.UPDATE_DRAFT]: 'event.form.buttonUpdateDraft',
  [BUTTONS.UPDATE_PUBLIC]: 'event.form.buttonUpdatePublic',
};

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  event,
  onCancel,
  onDelete,
  onPostpone,
  onUpdate,
}) => {
  const [top, setTop] = React.useState(getTop());
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory();
  const windowSize = useWindowSize();
  const { eventStatus, publicationStatus } = getEventFields(event, locale);
  const isCancelled = eventStatus === EventStatus.EventCancelled;
  const isDraft = publicationStatus === PublicationStatus.Draft;
  const isPublic = publicationStatus === PublicationStatus.Public;

  const getIsButtonVisible = (button: BUTTONS) => {
    switch (button) {
      case BUTTONS.CANCEL:
        return true;
      case BUTTONS.DELETE:
        return true;
      case BUTTONS.POSTPONE:
        return isPublic;
      case BUTTONS.PUBLISH:
        return isDraft;
      case BUTTONS.UPDATE_DRAFT:
        return isDraft;
      case BUTTONS.UPDATE_PUBLIC:
        return isPublic;
    }
  };

  const goToEventsPage = () => {
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  React.useEffect(() => {
    setTop(getTop());
  }, [windowSize]);

  const getDisabled = (button: BUTTONS): boolean => {
    if (
      !authenticated ||
      (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(button))
    ) {
      return true;
    }

    return false;
  };

  const getButtonTitle = (button: BUTTONS): string => {
    if (!authenticated) {
      return t('authentication.noRightsUpdateEvent');
    } else if (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(button)) {
      return t('event.form.editButtonPanel.tooltipCancelledEvent');
    } else {
      return '';
    }
  };

  const getActionItemProps = ({
    button,
    onClick,
  }: {
    button: BUTTONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getIsButtonVisible(button)
      ? {
          disabled: getDisabled(button),
          icon: iconMap[button],
          label: t(labelKeyMap[button]),
          onClick,
          title: getButtonTitle(button),
        }
      : null;
  };

  const actionItems: MenuItemOptionProps[] = [
    /* Actions for draft event */
    getActionItemProps({
      button: BUTTONS.UPDATE_DRAFT,
      onClick: () => onUpdate(PublicationStatus.Draft),
    }),
    getActionItemProps({
      button: BUTTONS.PUBLISH,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for public event */
    getActionItemProps({
      button: BUTTONS.UPDATE_PUBLIC,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for all event */
    getActionItemProps({
      button: BUTTONS.POSTPONE,
      onClick: onPostpone,
    }),
    getActionItemProps({
      button: BUTTONS.CANCEL,
      onClick: onCancel,
    }),
    getActionItemProps({
      button: BUTTONS.DELETE,
      onClick: onDelete,
    }),
  ].filter((i) => i) as MenuItemOptionProps[];
  return (
    <div className={styles.editButtonPanel} style={{ top }}>
      <Container>
        <div className={styles.buttonsRow}>
          <div className={styles.backButtonWrapper}>
            <Button
              className={styles.backButton}
              iconLeft={<IconArrowLeft />}
              fullWidth={true}
              onClick={goToEventsPage}
              type="button"
              variant="supplementary"
            >
              {t('event.form.buttonBack')}
            </Button>
          </div>
          <div className={styles.editButtonWrapper}>
            <MenuDropdown
              items={actionItems}
              buttonLabel={t('event.form.buttonActions')}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
