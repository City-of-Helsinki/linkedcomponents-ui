import { FastField, useField } from 'formik';
import { IconCrossCircle, IconEnvelope, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import MenuDropdown from '../../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../../common/components/menuDropdown/types';
import useIdWithPrefix from '../../../../../hooks/useIdWithPrefix';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import FieldWithButton from '../../../../event/layout/FieldWithButton';
import { REGISTRATION_USER_ACTIONS } from '../../../../registrationUser/constants';
import useRegistrationUserActions from '../../../../registrationUser/hooks/useRegistrationUserActions';
import { REGISTRATION_USER_FIELDS } from '../../../constants';
import styles from './registrationUser.module.scss';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  registrationUserPath: string;
};

const getFieldName = (registrationUserPath: string, field: string) =>
  `${registrationUserPath}.${field}`;

const RegistrationUser: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  registrationUserPath,
}) => {
  const { t } = useTranslation();

  const menuDropdownId = useIdWithPrefix({ prefix: 'menu-dropdown-' });

  const fieldNames = React.useMemo(
    () => ({
      email: getFieldName(registrationUserPath, REGISTRATION_USER_FIELDS.EMAIL),
      id: getFieldName(registrationUserPath, REGISTRATION_USER_FIELDS.ID),
    }),
    [registrationUserPath]
  );

  const [{ value: email }] = useField({ name: fieldNames.email });
  const [{ value: id }] = useField({ name: fieldNames.id });

  const { sendInvitation } = useRegistrationUserActions({ id });

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: REGISTRATION_USER_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps => {
    const icons = {
      delete: <IconCrossCircle aria-hidden={true} />,
      sendInvitation: <IconEnvelope aria-hidden={true} />,
    };
    const labels = {
      delete: t('common.delete'),
      sendInvitation: t('registration.form.sendInvitation'),
    };

    return {
      disabled: action === 'sendInvitation' && !id,
      icon: icons[action],
      label: labels[action],
      onClick,
    };
  };

  const actionItems = [
    getActionItemProps({
      action: REGISTRATION_USER_ACTIONS.SEND_INVITATION,
      onClick: () => {
        sendInvitation({
          onError: () =>
            toast.error(t('registration.form.messages.failedToSendInvitation')),
          onSuccess: () =>
            toast.success(
              t('registration.form.messages.succeededToSendInvitation', {
                email,
              })
            ),
        });
      },
    }),
    getActionItemProps({
      action: REGISTRATION_USER_ACTIONS.DELETE,
      onClick: onDelete,
    }),
  ];

  return (
    <>
      <FieldRow>
        <FieldWithButton
          button={
            <MenuDropdown
              button={
                <button
                  className={styles.toggleButton}
                  disabled={!isEditingAllowed}
                >
                  <IconMenuDots aria-hidden={true} />
                </button>
              }
              buttonLabel={t('common.buttonActions')}
              className={styles.toggleButton}
              closeOnItemClick={true}
              fixedPosition={true}
              id={menuDropdownId}
              items={actionItems}
            />
          }
        >
          <>
            <FormGroup>
              <FastField
                component={TextInputField}
                disabled={!isEditingAllowed}
                label={t(`registration.form.labelRegistrationUserEmail`)}
                name={fieldNames.email}
                placeholder={t(
                  `registration.form.placeholderRegistrationUserEmail`
                )}
                required={true}
              />
            </FormGroup>
          </>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default RegistrationUser;
