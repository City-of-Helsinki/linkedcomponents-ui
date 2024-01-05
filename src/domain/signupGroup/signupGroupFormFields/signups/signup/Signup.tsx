import { Field } from 'formik';
import { Fieldset, IconTrash } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextAreaField from '../../../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { RegistrationFieldsFragment } from '../../../../../generated/graphql';
import { featureFlagUtils } from '../../../../../utils/featureFlags';
import skipFalsyType from '../../../../../utils/skipFalsyType';
import { SIGNUP_FIELDS } from '../../../constants';
import useSignupPriceGroupOptions from '../../../hooks/useSignupPriceGroupOptions';
import { useSignupGroupFormContext } from '../../../signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupFormFields } from '../../../types';
import {
  isDateOfBirthFieldRequired,
  isSignupFieldRequired,
} from '../../../utils';
import styles from './signup.module.scss';
import SignupAccordion from './signupAccordion/SignupAccordion';

export type SignupProps = {
  disabled?: boolean;
  index: number;
  isEditingMode: boolean;
  onDelete: () => void;
  registration: RegistrationFieldsFragment;
  showDelete: boolean;
  signup: SignupFormFields;
  signupPath: string;
};

const getFieldName = (signupPath: string, field: string) =>
  `${signupPath}.${field}`;

const Signup: React.FC<SignupProps> = ({
  disabled,
  index,
  isEditingMode,
  onDelete,
  registration,
  showDelete,
  signup,
  signupPath,
}) => {
  const { t } = useTranslation();
  const { openParticipant, toggleOpenParticipant } =
    useSignupGroupFormContext();

  const translateSignupText = (key: string) => t(`signup.form.signup.${key}`);
  const priceGroupOptions = useSignupPriceGroupOptions(registration);

  const accordionLabel = useMemo(() => {
    const nameText =
      [signup.firstName, signup.lastName].filter(skipFalsyType).join(' ') ||
      t('signup.form.signup.signupDefaultTitle', { index: index + 1 });
    const signupGroupText =
      featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
      priceGroupOptions?.find((o) => o.value === signup.priceGroup)?.label;

    return signupGroupText ? [nameText, signupGroupText].join(' — ') : nameText;
  }, [
    index,
    priceGroupOptions,
    signup.firstName,
    signup.lastName,
    signup.priceGroup,
    t,
  ]);

  return (
    <SignupAccordion
      deleteButton={
        showDelete && !disabled ? (
          <button
            aria-label={translateSignupText('buttonDeleteSignup')}
            className={styles.deleteButton}
            onClick={onDelete}
            type="button"
          >
            <IconTrash />
          </button>
        ) : undefined
      }
      inWaitingList={signup.inWaitingList}
      onClick={() => toggleOpenParticipant(index)}
      open={openParticipant === index}
      toggleButtonLabel={accordionLabel}
    >
      <Fieldset heading={translateSignupText('titleBasicInfo')}>
        {!!registration.registrationPriceGroups?.length && (
          <FormGroup>
            {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') && (
              <div className={styles.priceGroupRow}>
                <Field
                  name={getFieldName(signupPath, SIGNUP_FIELDS.PRICE_GROUP)}
                  component={SingleSelectField}
                  disabled={disabled || isEditingMode}
                  label={translateSignupText('labelPriceGroup')}
                  options={priceGroupOptions}
                  placeholder={translateSignupText('placeholderPriceGroup')}
                  required={!!priceGroupOptions?.length}
                />
              </div>
            )}
          </FormGroup>
        )}

        <FormGroup>
          <div className={styles.nameRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelFirstName')}
              placeholder={translateSignupText('placeholderFirstName')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.FIRST_NAME
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelLastName')}
              placeholder={translateSignupText('placeholderLastName')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.LAST_NAME
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.phoneNumberRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.PHONE_NUMBER)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelPhoneNumber')}
              placeholder={translateSignupText('placeholderPhoneNumber')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.PHONE_NUMBER
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.streetAddressRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.STREET_ADDRESS)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelStreetAddress')}
              placeholder={translateSignupText('placeholderStreetAddress')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.STREET_ADDRESS
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.DATE_OF_BIRTH)}
              component={DateInputField}
              disabled={disabled}
              label={translateSignupText('labelDateOfBirth')}
              placeholder={t('common.placeholderDate')}
              required={isDateOfBirthFieldRequired(registration)}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.zipRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.ZIPCODE)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelZipcode')}
              placeholder={translateSignupText('placeholderZipcode')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.ZIPCODE
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.CITY)}
              component={TextInputField}
              disabled={disabled}
              label={translateSignupText('labelCity')}
              placeholder={translateSignupText('placeholderCity')}
              required={isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY)}
            />
          </div>
        </FormGroup>
        <Field
          name={getFieldName(signupPath, SIGNUP_FIELDS.EXTRA_INFO)}
          className={styles.extraInfoField}
          component={TextAreaField}
          disabled={disabled}
          helperText={translateSignupText('helperExtraInfo')}
          label={translateSignupText('labelExtraInfo')}
          placeholder={translateSignupText('placeholderExtraInfo')}
          required={isSignupFieldRequired(
            registration,
            SIGNUP_FIELDS.EXTRA_INFO
          )}
        />
      </Fieldset>
    </SignupAccordion>
  );
};

export default Signup;
