import {
  IconCalendarClock,
  IconCalendarCross,
  IconCogwheel,
  IconCross,
  IconMenuDots,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { authenticatedSelector } from '../../auth/selectors';
import { getEventFields } from '../../event/utils';
import styles from './actionsButton.module.scss';

export enum BUTTONS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  EDIT = 'edit',
  POSTPONE = 'postpone',
}

export interface ActionsDropdownProps {
  className?: string;
  event: EventFieldsFragment;
  onCancel: () => void;
  onDelete: () => void;
  onPostpone: () => void;
}

const NOT_ALLOWED_WHEN_CANCELLED = [BUTTONS.CANCEL, BUTTONS.POSTPONE];

const iconMap = {
  [BUTTONS.CANCEL]: <IconCalendarCross />,
  [BUTTONS.DELETE]: <IconCross />,
  [BUTTONS.EDIT]: <IconCogwheel />,
  [BUTTONS.POSTPONE]: <IconCalendarClock />,
};

const labelKeyMap = {
  [BUTTONS.CANCEL]: 'event.form.buttonCancel',
  [BUTTONS.DELETE]: 'event.form.buttonDelete',
  [BUTTONS.EDIT]: 'event.form.buttonEdit',
  [BUTTONS.POSTPONE]: 'event.form.buttonPostpone',
};

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  className,
  event,
  onCancel,
  onDelete,
  onPostpone,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory();
  const { eventStatus, id, publicationStatus } = getEventFields(event, locale);
  const isCancelled = eventStatus === EventStatus.EventCancelled;
  const isPublic = publicationStatus === PublicationStatus.Public;

  const getIsButtonVisible = (button: BUTTONS) => {
    switch (button) {
      case BUTTONS.CANCEL:
        return true;
      case BUTTONS.DELETE:
        return true;
      case BUTTONS.EDIT:
        return true;
      case BUTTONS.POSTPONE:
        return isPublic;
    }
  };

  const goToEditEventPage = () => {
    history.push(`/${locale}${ROUTES.EDIT_EVENT.replace(':id', id)}`);
  };

  const getDisabled = (button: BUTTONS): boolean => {
    if (button === BUTTONS.EDIT) {
      return false;
    } else if (
      !authenticated ||
      (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(button))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getButtonTitle = (button: BUTTONS): string => {
    if (button === BUTTONS.EDIT) {
      return '';
    } else if (!authenticated) {
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
    getActionItemProps({
      button: BUTTONS.EDIT,
      onClick: goToEditEventPage,
    }),
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
    <MenuDropdown
      button={
        <button className={styles.toggleButton}>
          <IconMenuDots aria-hidden={true} />
        </button>
      }
      className={className}
      items={actionItems}
      buttonLabel={t('event.form.buttonActions')}
    />
  );
};

export default ActionsDropdown;
