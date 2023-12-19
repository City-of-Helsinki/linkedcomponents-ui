import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import { ActionButtonProps } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import getValue from '../../../utils/getValue';
import {
  openMailtoLink,
  parseEmailFromCreatedBy,
} from '../../../utils/openMailtoLinkUtils';
import skipFalsyType from '../../../utils/skipFalsyType';
import useAuth from '../../auth/hooks/useAuth';
import { EventsLocationState } from '../../events/types';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import { copyEventToSessionStorage, getEventButtonProps } from '../utils';

export interface EditButtonPanelProps {
  event: EventFieldsFragment;
  onCancel: () => void;
  onDelete: () => void;
  onPostpone: () => void;
  onUpdate: (publicationStatus: PublicationStatus) => void;
  saving: EVENT_ACTIONS | null;
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
  const { authenticated } = useAuth();
  const locale = useLocale();
  const navigate = useNavigate();

  const { organizationAncestors } = useOrganizationAncestors(
    getValue(event.publisher, '')
  );
  const { user } = useUser();

  const goBack = useGoBack<EventsLocationState>({
    defaultReturnPath: ROUTES.SEARCH,
    state: { eventId: event.id },
  });

  const copyEvent = async () => {
    await copyEventToSessionStorage(event, user);
    navigate(`/${locale}${ROUTES.CREATE_EVENT}`);
  };
  const sendEmail = () => {
    const targetEmail = parseEmailFromCreatedBy(event.createdBy);
    openMailtoLink(targetEmail, getLocalisedString(event.name, locale));
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

  const getActionButtonProps = ({
    action,
    onClick,
    variant,
  }: {
    action: EVENT_ACTIONS;
    onClick: () => void;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps | null => {
    const buttonProps = getActionItemProps({ action, onClick });

    return buttonProps
      ? { ...buttonProps, isSaving: saving === action, variant }
      : null;
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: EVENT_ACTIONS.COPY,
      onClick: copyEvent,
    }),
    /* Actions for all event */
    getActionItemProps({
      action: EVENT_ACTIONS.POSTPONE,
      onClick: onPostpone,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.CANCEL,
      onClick: onCancel,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.DELETE,
      onClick: onDelete,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.SEND_EMAIL,
      onClick: sendEmail,
    }),
  ].filter(skipFalsyType);

  const actionButtons: ActionButtonProps[] = [
    /* Actions for draft event */
    getActionButtonProps({
      action: EVENT_ACTIONS.UPDATE_DRAFT,
      onClick: () => onUpdate(PublicationStatus.Draft),
      variant: 'secondary',
    }),
    getActionButtonProps({
      action: EVENT_ACTIONS.ACCEPT_AND_PUBLISH,
      onClick: () => onUpdate(PublicationStatus.Public),
      variant: 'primary',
    }),
    /* Actions for public event */
    getActionButtonProps({
      action: EVENT_ACTIONS.UPDATE_PUBLIC,
      onClick: () => onUpdate(PublicationStatus.Public),
      variant: 'primary',
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      actionItems={actionItems}
      onBack={goBack}
      submitButtons={actionButtons.map(
        ({ icon, disabled, label, isSaving, variant, ...rest }) => (
          <LoadingButton
            key={label}
            {...rest}
            className={styles.mediumButton}
            disabled={disabled || Boolean(saving)}
            icon={icon}
            loading={isSaving}
            variant={variant}
          >
            {label}
          </LoadingButton>
        )
      )}
    />
  );
};

export default EditButtonPanel;
