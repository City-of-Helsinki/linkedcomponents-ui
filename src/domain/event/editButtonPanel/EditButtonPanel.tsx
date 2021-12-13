import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { EventsLocationState } from '../../eventSearch/types';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import useEventOrganizationAncestors from '../hooks/useEventOrganizationAncestors';
import { copyEventToSessionStorage, getEditButtonProps } from '../utils';

type ActionButtonProps = {
  isSaving: boolean;
  variant: Exclude<ButtonVariant, 'supplementary'>;
} & MenuItemOptionProps;

export interface EditButtonPanelProps {
  event: EventFieldsFragment;
  onCancel: () => void;
  onDelete: () => void;
  onPostpone: () => void;
  onUpdate: (publicationStatus: PublicationStatus) => void;
  saving: EVENT_EDIT_ACTIONS | false;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  event,
  onCancel,
  onDelete,
  onPostpone,
  onUpdate,
  saving,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory<EventsLocationState>();

  const { organizationAncestors } = useEventOrganizationAncestors(event);
  const { user } = useUser();

  const goBack = useGoBack<EventsLocationState>({
    defaultReturnPath: ROUTES.SEARCH,
    state: { eventId: event.id },
  });

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

  const getActionButtonProps = ({
    action,
    onClick,
    variant,
  }: {
    action: EVENT_EDIT_ACTIONS;
    onClick: () => void;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps | null => {
    const buttonProps = getEditButtonProps({
      action,
      authenticated,
      event,
      onClick,
      organizationAncestors,
      t,
      user,
    });
    return buttonProps
      ? { ...buttonProps, isSaving: saving === action, variant }
      : null;
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: EVENT_EDIT_ACTIONS.COPY,
      onClick: copyEvent,
    }),
    /* Actions for all event */
    getActionItemProps({
      action: EVENT_EDIT_ACTIONS.POSTPONE,
      onClick: onPostpone,
    }),
    getActionItemProps({
      action: EVENT_EDIT_ACTIONS.CANCEL,
      onClick: onCancel,
    }),
    getActionItemProps({
      action: EVENT_EDIT_ACTIONS.DELETE,
      onClick: onDelete,
    }),
  ].filter(skipFalsyType);

  const actionButtons: ActionButtonProps[] = [
    /* Actions for draft event */
    getActionButtonProps({
      action: EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      onClick: () => onUpdate(PublicationStatus.Draft),
      variant: 'secondary',
    }),
    getActionButtonProps({
      action: EVENT_EDIT_ACTIONS.PUBLISH,
      onClick: () => onUpdate(PublicationStatus.Public),
      variant: 'primary',
    }),
    /* Actions for public event */
    getActionButtonProps({
      action: EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
      onClick: () => onUpdate(PublicationStatus.Public),
      variant: 'primary',
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      actionItems={actionItems}
      onBack={goBack}
      submitButtons={actionButtons.map(
        ({ icon, disabled, label, isSaving, variant, ...rest }, index) => (
          <LoadingButton
            key={index}
            {...rest}
            className={styles.mediumButton}
            disabled={disabled || Boolean(saving)}
            icon={icon}
            loading={isSaving}
            variant={variant as Exclude<ButtonVariant, 'supplementary'>}
          >
            {label}
          </LoadingButton>
        )
      )}
    />
  );
};

export default EditButtonPanel;
