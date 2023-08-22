import { Field, useField } from 'formik';
import { IconCrossCircle, IconEnvelope, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import MenuDropdown from '../../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../../common/components/menuDropdown/types';
import useIdWithPrefix from '../../../../../hooks/useIdWithPrefix';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import useLanguageOptions from '../../../../enrolment/hooks/useLanguageOptions';
import FieldWithButton from '../../../../event/layout/FieldWithButton';
import { REGISTRATION_USER_ACCESS_ACTIONS } from '../../../../registrationUserAccess/constants';
// eslint-disable-next-line max-len
import useRegistrationUserAccessActions from '../../../../registrationUserAccess/hooks/useRegistrationUserAccessActions';
import { REGISTRATION_USER_ACCESS_FIELDS } from '../../../constants';
import styles from './registrationUserAccess.module.scss';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  registrationUserAccessPath: string;
};

const getFieldName = (registrationUserPath: string, field: string) =>
  `${registrationUserPath}.${field}`;

const RegistrationUserAccess: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  registrationUserAccessPath,
}) => {
  const { t } = useTranslation();

  const serviceLanguageOptions = useLanguageOptions({ serviceLanguage: true });

  const menuDropdownId = useIdWithPrefix({ prefix: 'menu-dropdown-' });

  const fieldNames = React.useMemo(
    () => ({
      email: getFieldName(
        registrationUserAccessPath,
        REGISTRATION_USER_ACCESS_FIELDS.EMAIL
      ),
      id: getFieldName(
        registrationUserAccessPath,
        REGISTRATION_USER_ACCESS_FIELDS.ID
      ),
      language: getFieldName(
        registrationUserAccessPath,
        REGISTRATION_USER_ACCESS_FIELDS.LANGUAGE
      ),
    }),
    [registrationUserAccessPath]
  );

  const [{ value: email }] = useField({ name: fieldNames.email });
  const [{ value: id }] = useField({ name: fieldNames.id });

  const { sendInvitation } = useRegistrationUserAccessActions({ id });

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: REGISTRATION_USER_ACCESS_ACTIONS;
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
      action: REGISTRATION_USER_ACCESS_ACTIONS.SEND_INVITATION,
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
      action: REGISTRATION_USER_ACCESS_ACTIONS.DELETE,
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
              <Field
                component={TextInputField}
                disabled={!isEditingAllowed}
                label={t(`registration.form.labelRegistrationUserAccessEmail`)}
                name={fieldNames.email}
                placeholder={t(
                  `registration.form.placeholderRegistrationUserAccessEmail`
                )}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <Field
                name={fieldNames.language}
                component={SingleSelectField}
                clearable={true}
                language
                disabled={!isEditingAllowed}
                label={t(
                  `registration.form.labelRegistrationUserAccessLanguage`
                )}
                options={serviceLanguageOptions}
                placeholder={t(
                  `registration.form.placeholderRegistrationUserAccessLanguage`
                )}
              />
            </FormGroup>
          </>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default RegistrationUserAccess;
