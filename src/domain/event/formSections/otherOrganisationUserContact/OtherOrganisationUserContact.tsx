import { Field } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';

type Props = {
  isEditingAllowed: boolean;
};

const OtherOrganisationUserContact: FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <Fieldset heading={t('event.form.sections.contact')} hideLegend>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelContactName')}
              name={EVENT_FIELDS.USER_NAME}
              placeholder={t('event.form.placeholderContactName')}
              disabled={!isEditingAllowed}
              required
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelEmail')}
              name={EVENT_FIELDS.EMAIL}
              placeholder={t('event.form.placeholderEmail')}
              required
              disabled={!isEditingAllowed}
              type="email"
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelPhoneNumber')}
              name={EVENT_FIELDS.PHONE_NUMBER}
              placeholder={t('event.form.placeholderPhoneNumber')}
              required
              disabled={!isEditingAllowed}
              type="tel"
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelOrganization')}
              name={EVENT_FIELDS.ORGANIZATION}
              placeholder={t('event.form.placeholderOrganization')}
              disabled={!isEditingAllowed}
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelRegistrationLink')}
              name={EVENT_FIELDS.REGISTRATION_LINK}
              placeholder={t('event.form.placeholderRegistrationLink')}
              disabled={!isEditingAllowed}
              type="url"
              required
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={CheckboxField}
              label={t('event.form.labelUserConsent')}
              name={EVENT_FIELDS.USER_CONSENT}
              disabled={!isEditingAllowed}
              required
            ></Field>
          </FormGroup>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default OtherOrganisationUserContact;
