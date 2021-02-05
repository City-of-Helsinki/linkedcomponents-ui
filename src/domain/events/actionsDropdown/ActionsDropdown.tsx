import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { authenticatedSelector } from '../../auth/selectors';
import { EVENT_ACTION_BUTTONS } from '../../event/constants';
import useEventUpdateActions, {
  MODALS,
} from '../../event/hooks/useEventUpdateActions';
import ConfirmCancelModal from '../../event/modals/ConfirmCancelModal';
import ConfirmDeleteModal from '../../event/modals/ConfirmDeleteModal';
import ConfirmPostponeModal from '../../event/modals/ConfirmPostponeModal';
import { getActionButtonProps, getEventFields } from '../../event/utils';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  event: EventFieldsFragment;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  className,
  event,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory();
  const { id } = getEventFields(event, locale);

  const {
    cancelEvent,
    closeModal,
    deleteEvent,
    saving,
    openModal,
    postponeEvent,
    setOpenModal,
  } = useEventUpdateActions({ event });

  const onCancel = async () => {
    cancelEvent({});
  };

  const onDelete = async () => {
    deleteEvent({});
  };

  const onPostpone = async () => {
    postponeEvent({});
  };

  const goToEditEventPage = () => {
    history.push(`/${locale}${ROUTES.EDIT_EVENT.replace(':id', id)}`);
  };

  const getActionItemProps = ({
    button,
    onClick,
  }: {
    button: EVENT_ACTION_BUTTONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getActionButtonProps({
      authenticated,
      button,
      event,
      onClick,
      t,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.EDIT,
      onClick: goToEditEventPage,
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.POSTPONE,
      onClick: () => setOpenModal(MODALS.POSTPONE),
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.CANCEL,
      onClick: () => setOpenModal(MODALS.CANCEL),
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.DELETE,
      onClick: () => setOpenModal(MODALS.DELETE),
    }),
  ].filter((i) => i) as MenuItemOptionProps[];

  return (
    <>
      <ConfirmCancelModal
        event={event}
        isOpen={openModal === MODALS.CANCEL}
        isSaving={saving === MODALS.CANCEL}
        onCancel={onCancel}
        onClose={closeModal}
      />
      <ConfirmDeleteModal
        event={event}
        isOpen={openModal === MODALS.DELETE}
        isSaving={saving === MODALS.DELETE}
        onClose={closeModal}
        onDelete={onDelete}
      />
      <ConfirmPostponeModal
        event={event}
        isOpen={openModal === MODALS.POSTPONE}
        isSaving={saving === MODALS.POSTPONE}
        onClose={closeModal}
        onPostpone={onPostpone}
      />
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
    </>
  );
};

export default ActionsDropdown;
