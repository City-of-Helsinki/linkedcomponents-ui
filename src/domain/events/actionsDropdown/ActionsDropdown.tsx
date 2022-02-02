import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import styles from '../../../common/components/actionsDropdown/actionsDropdown.module.scss';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { EVENT_EDIT_ACTIONS } from '../../event/constants';
import useEventUpdateActions, {
  MODALS,
} from '../../event/hooks/useEventUpdateActions';
import ConfirmCancelModal from '../../event/modals/ConfirmCancelModal';
import ConfirmDeleteModal from '../../event/modals/ConfirmDeleteModal';
import ConfirmPostponeModal from '../../event/modals/ConfirmPostponeModal';
import {
  copyEventToSessionStorage,
  getEditButtonProps,
  getEventFields,
} from '../../event/utils';
import useEventsQueryStringWithReturnPath from '../../eventSearch/hooks/useEventsQueryStringWithReturnPath';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';

export interface ActionsDropdownProps {
  className?: string;
  event: EventFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, event }, ref) => {
    const { t } = useTranslation();
    const authenticated = useSelector(authenticatedSelector);
    const locale = useLocale();
    const history = useHistory();
    const { eventUrl } = getEventFields(event, locale);
    const queryStringWithReturnPath = useEventsQueryStringWithReturnPath();

    const {
      cancelEvent,
      closeModal,
      deleteEvent,
      saving,
      openModal,
      postponeEvent,
      setOpenModal,
    } = useEventUpdateActions({ event });
    const { organizationAncestors } = useOrganizationAncestors(
      event.publisher as string
    );
    const { user } = useUser();

    const onCancel = () => {
      cancelEvent();
    };

    const onDelete = () => {
      deleteEvent();
    };

    const onPostpone = () => {
      postponeEvent();
    };

    const goToEditEventPage = () => {
      const eventUrlWithReturnPath = `${eventUrl}${queryStringWithReturnPath}`;
      history.push(eventUrlWithReturnPath);
    };

    const copyEvent = async () => {
      await copyEventToSessionStorage(event);
      history.push(`/${locale}${ROUTES.CREATE_EVENT}`);
    };

    const getActionItemProps = ({
      action,
      onClick,
    }: {
      action: EVENT_EDIT_ACTIONS;
      onClick: () => void;
    }): MenuItemOptionProps | null => {
      return getEditButtonProps({
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
        action: EVENT_EDIT_ACTIONS.EDIT,
        onClick: goToEditEventPage,
      }),
      getActionItemProps({
        action: EVENT_EDIT_ACTIONS.COPY,
        onClick: copyEvent,
      }),
      getActionItemProps({
        action: EVENT_EDIT_ACTIONS.POSTPONE,
        onClick: () => setOpenModal(MODALS.POSTPONE),
      }),
      getActionItemProps({
        action: EVENT_EDIT_ACTIONS.CANCEL,
        onClick: () => setOpenModal(MODALS.CANCEL),
      }),
      getActionItemProps({
        action: EVENT_EDIT_ACTIONS.DELETE,
        onClick: () => setOpenModal(MODALS.DELETE),
      }),
    ].filter(skipFalsyType);

    return (
      <div className={className} ref={ref}>
        {openModal === MODALS.CANCEL && (
          <ConfirmCancelModal
            event={event}
            isOpen={openModal === MODALS.CANCEL}
            isSaving={saving === EVENT_EDIT_ACTIONS.CANCEL}
            onCancel={onCancel}
            onClose={closeModal}
          />
        )}
        {openModal === MODALS.DELETE && (
          <ConfirmDeleteModal
            event={event}
            isOpen={openModal === MODALS.DELETE}
            isSaving={saving === EVENT_EDIT_ACTIONS.DELETE}
            onClose={closeModal}
            onDelete={onDelete}
          />
        )}
        {openModal === MODALS.POSTPONE && (
          <ConfirmPostponeModal
            event={event}
            isOpen={openModal === MODALS.POSTPONE}
            isSaving={saving === EVENT_EDIT_ACTIONS.POSTPONE}
            onClose={closeModal}
            onPostpone={onPostpone}
          />
        )}

        <MenuDropdown
          button={
            <button className={styles.toggleButton}>
              <IconMenuDots aria-hidden={true} />
            </button>
          }
          buttonLabel={t('common.buttonActions')}
          closeOnItemClick={true}
          fixedPosition={true}
          items={actionItems}
        />
      </div>
    );
  }
);

export default ActionsDropdown;
