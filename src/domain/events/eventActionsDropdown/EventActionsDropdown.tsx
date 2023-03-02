import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import { EVENT_ACTIONS, EVENT_MODALS } from '../../event/constants';
import useEventActions from '../../event/hooks/useEventActions';
import ConfirmCancelEventModal from '../../event/modals/confirmCancelEventModal/ConfirmCancelEventModal';
import ConfirmDeleteEventModal from '../../event/modals/confirmDeleteEventModal/ConfirmDeleteEventModal';
import ConfirmPostponeEventModal from '../../event/modals/confirmPostponeEventModal/ConfirmPostponeEventModal';
import {
  copyEventToSessionStorage,
  getEventButtonProps,
  getEventFields,
} from '../../event/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';

export interface EventActionsDropdownProps {
  className?: string;
  event: EventFieldsFragment;
}

const EventActionsDropdown: React.FC<EventActionsDropdownProps> = ({
  className,
  event,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const locale = useLocale();
  const navigate = useNavigate();
  const { eventUrl } = getEventFields(event, locale);
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const {
    cancelEvent,
    closeModal,
    deleteEvent,
    saving,
    openModal,
    postponeEvent,
    setOpenModal,
  } = useEventActions(event);
  const { organizationAncestors } = useOrganizationAncestors(
    getValue(event.publisher, '')
  );
  const { user } = useUser();

  const goToEditEventPage = () => {
    const eventUrlWithReturnPath = `${eventUrl}${queryStringWithReturnPath}`;
    navigate(eventUrlWithReturnPath);
  };

  const copyEvent = async () => {
    await copyEventToSessionStorage(event, user);
    navigate(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: EVENT_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEventButtonProps({
      action,
      authenticated,
      event,
      onClick,
      organizationAncestors,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: EVENT_ACTIONS.EDIT,
      onClick: goToEditEventPage,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.COPY,
      onClick: copyEvent,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.POSTPONE,
      onClick: () => setOpenModal(EVENT_MODALS.POSTPONE),
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.CANCEL,
      onClick: () => setOpenModal(EVENT_MODALS.CANCEL),
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.DELETE,
      onClick: () => setOpenModal(EVENT_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <div className={className}>
      {openModal === EVENT_MODALS.CANCEL && (
        <ConfirmCancelEventModal
          event={event}
          isOpen={openModal === EVENT_MODALS.CANCEL}
          isSaving={saving === EVENT_ACTIONS.CANCEL}
          onClose={closeModal}
          onConfirm={cancelEvent}
        />
      )}
      {openModal === EVENT_MODALS.DELETE && (
        <ConfirmDeleteEventModal
          event={event}
          isOpen={openModal === EVENT_MODALS.DELETE}
          isSaving={saving === EVENT_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={deleteEvent}
        />
      )}
      {openModal === EVENT_MODALS.POSTPONE && (
        <ConfirmPostponeEventModal
          event={event}
          isOpen={openModal === EVENT_MODALS.POSTPONE}
          isSaving={saving === EVENT_ACTIONS.POSTPONE}
          onClose={closeModal}
          onConfirm={postponeEvent}
        />
      )}

      <ActionsDropdown items={actionItems} />
    </div>
  );
};

export default EventActionsDropdown;
