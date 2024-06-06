import { Field, useField } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Fieldset from '../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import PhoneInputField from '../../../common/components/formFields/phoneInputField/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import Notification from '../../../common/components/notification/Notification';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import useLanguageOptions from '../../language/hooks/useLanguageOptions';
import { getSignupFields } from '../../signups/utils';
import {
  CONTACT_PERSON_FIELDS,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
} from '../constants';
import Divider from '../divider/Divider';
import useNotificationOptions from '../hooks/useNotificationOptions';
import { SignupFormFields } from '../types';
import styles from './signupGroupFormFields.module.scss';
import Signups from './signups/Signups';

const CannotEditContactPersonNotification: FC<{
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
}> = ({ registration, signup }) => {
  const language = useLocale();
  const { t } = useTranslation();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { signupGroupUrl } = getSignupFields({
    language,
    registration,
    signup,
  });

  return (
    <Notification
      className={styles.cannotEditNotification}
      label={t(
        'signup.form.contactPerson.cannotEditContactPersonNotification.title'
      )}
      type="info"
    >
      <p>
        {t(
          'signup.form.contactPerson.cannotEditContactPersonNotification.text'
        )}
      </p>
      {signupGroupUrl && (
        <Link
          to={{ pathname: signupGroupUrl, search: queryStringWithReturnPath }}
        >
          {t(
            'signup.form.contactPerson.cannotEditContactPersonNotification.linkText'
          )}
        </Link>
      )}
    </Notification>
  );
};

interface Props {
  contactPersonFieldsDisabled?: boolean;
  createPayment: boolean;
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const SignupGroupFormFields: React.FC<Props> = ({
  contactPersonFieldsDisabled,
  createPayment,
  disabled,
  registration,
  signup,
  signupGroup,
}) => {
  const { t } = useTranslation();
  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const serviceLanguageOptions = useLanguageOptions({
    variables: { serviceLanguage: true },
  });

  const [{ value: signups }] = useField<SignupFormFields[]>({
    name: SIGNUP_GROUP_FIELDS.SIGNUPS,
  });

  const getContactPersonFieldName = (name: string) =>
    `${SIGNUP_GROUP_FIELDS.CONTACT_PERSON}.${name}`;

  const getContactPersonTranslation = (key: string) =>
    t(`signup.form.contactPerson.${key}`);

  const titleCannotEditContactPerson = contactPersonFieldsDisabled
    ? getContactPersonTranslation('titleCannotEditContactPerson')
    : undefined;
  const [{ value: notifications }] = useField<NOTIFICATIONS>({
    name: getContactPersonFieldName(CONTACT_PERSON_FIELDS.NOTIFICATIONS),
  });

  return (
    <div className={styles.signupGroupFormFieldsFields}>
      <Signups
        disabled={disabled}
        registration={registration}
        signup={signup}
        signupGroup={signupGroup}
      />
      <FormGroup>
        <h2>{getContactPersonTranslation('titleContactPersonInfo')}</h2>
      </FormGroup>
      <Notification type="info">
        <p style={{ margin: 0 }}>
          {getContactPersonTranslation('notificationTextContactPersonInfo')}
        </p>
      </Notification>
      <Divider />
      {contactPersonFieldsDisabled && signup && (
        <CannotEditContactPersonNotification
          registration={registration}
          signup={signup}
        />
      )}

      <Fieldset heading={getContactPersonTranslation(`titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.EMAIL)}
              component={TextInputField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelEmail')}
              placeholder={getContactPersonTranslation('placeholderEmail')}
              required
              title={titleCannotEditContactPerson}
            />
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.PHONE_NUMBER
              )}
              component={PhoneInputField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelPhoneNumber')}
              placeholder={getContactPersonTranslation(
                'placeholderPhoneNumber'
              )}
              type="tel"
              required={notifications.includes(NOTIFICATIONS.SMS)}
              title={titleCannotEditContactPerson}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nameRow}>
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelFirstName')}
              placeholder={getContactPersonTranslation('placeholderFirstName')}
              required={createPayment}
              title={titleCannotEditContactPerson}
            />
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelLastName')}
              placeholder={getContactPersonTranslation('placeholderLastName')}
              required={createPayment}
              title={titleCannotEditContactPerson}
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={getContactPersonTranslation(`titleNotifications`)}>
        <FormGroup>
          <Field
            name={getContactPersonFieldName(
              CONTACT_PERSON_FIELDS.NOTIFICATIONS
            )}
            className={styles.notifications}
            component={CheckboxGroupField}
            disabled={true}
            label={getContactPersonTranslation(`titleNotifications`)}
            options={notificationOptions}
            required
          />
        </FormGroup>
      </Fieldset>

      <Fieldset heading={getContactPersonTranslation(`titleAdditionalInfo`)}>
        <FormGroup>
          <div className={styles.membershipNumberRow}>
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER
              )}
              component={TextInputField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelMembershipNumber')}
              placeholder={getContactPersonTranslation(
                'placeholderMembershipNumber'
              )}
              title={titleCannotEditContactPerson}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nativeLanguageRow}>
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE
              )}
              clearable
              component={SingleSelectField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelNativeLanguage')}
              options={languageOptions}
              placeholder={getContactPersonTranslation(
                'placeholderNativeLanguage'
              )}
              title={titleCannotEditContactPerson}
            />
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE
              )}
              component={SingleSelectField}
              disabled={disabled || contactPersonFieldsDisabled}
              label={getContactPersonTranslation('labelServiceLanguage')}
              options={serviceLanguageOptions}
              placeholder={getContactPersonTranslation(
                'placeholderServiceLanguage'
              )}
              required
              title={titleCannotEditContactPerson}
            />
          </div>
        </FormGroup>
        {/* Don't show signup group extra info field when editing a single signup or 
        creating a new signup and amount of signups is 1 */}
        {(!!signupGroup || (!signup && !signupGroup && signups.length > 1)) && (
          <FormGroup>
            <Field
              name={SIGNUP_GROUP_FIELDS.EXTRA_INFO}
              component={TextAreaField}
              disabled={disabled}
              label={t('signup.form.labelExtraInfo')}
              placeholder={t('signup.form.placeholderExtraInfo')}
            />
          </FormGroup>
        )}
      </Fieldset>
    </div>
  );
};

export default SignupGroupFormFields;
