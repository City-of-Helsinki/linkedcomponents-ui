import { useField } from 'formik';
import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { PublicationStatus } from '../../../generated/graphql';
import { ActionButtonProps } from '../../../types';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS, EVENT_FIELDS, EVENT_TYPE } from '../constants';
import { getEventButtonProps } from '../utils';

interface Props {
  onSubmit: (publicationStatus: PublicationStatus) => void;
  publisher: string;
  saving: EVENT_ACTIONS | null;
}

const CreateButtonPanel: React.FC<Props> = ({
  onSubmit,
  publisher,
  saving,
}) => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [{ value: eventType }] = useField<EVENT_TYPE>({
    name: EVENT_FIELDS.TYPE,
  });
  const { isAuthenticated: authenticated } = useAuth();

  const getActionButtonProps = ({
    action,
    onClick,
    variant,
  }: {
    action: EVENT_ACTIONS;
    onClick: () => void;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps | null => {
    const buttonProps = getEventButtonProps({
      action,
      authenticated,
      eventType,
      onClick,
      organizationAncestors: [],
      publisher,
      t,
      user,
    });
    return buttonProps
      ? { ...buttonProps, isSaving: saving === action, type: 'button', variant }
      : null;
  };

  const actionButtons: ActionButtonProps[] = [
    getActionButtonProps({
      action: EVENT_ACTIONS.CREATE_DRAFT,
      onClick: () => onSubmit(PublicationStatus.Draft),
      variant: 'secondary',
    }),
    getActionButtonProps({
      action: EVENT_ACTIONS.PUBLISH,
      onClick: () => onSubmit(PublicationStatus.Public),
      variant: 'primary',
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      submitButtons={actionButtons.map(
        ({ disabled, label, isSaving, ...rest }, index) => (
          <LoadingButton
            key={index}
            {...rest}
            disabled={disabled || Boolean(saving)}
            loading={isSaving}
          >
            {label}
          </LoadingButton>
        )
      )}
    />
  );
};

export default CreateButtonPanel;
