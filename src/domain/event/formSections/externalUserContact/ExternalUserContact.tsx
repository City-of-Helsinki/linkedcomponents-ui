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
import styles from './externalUserContact.module.scss';

export type ExternalUserContactProps = {
  isEditingAllowed: boolean;
};

const ExternalUserContact: FC<ExternalUserContactProps> = ({
  isEditingAllowed,
}) => {
  const { t } = useTranslation();

  return (
    <Fieldset
      heading={t('event.form.sections.contact')}
      hideLegend
      data-testid="fields-external-user-contact"
    >
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelUserName')}
              name={EVENT_FIELDS.USER_NAME}
              placeholder={t('event.form.placeholderUserName')}
              disabled={!isEditingAllowed}
              required
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t('event.form.labelEmail')}
              name={EVENT_FIELDS.USER_EMAIL}
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
              name={EVENT_FIELDS.USER_PHONE_NUMBER}
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
              name={EVENT_FIELDS.USER_ORGANIZATION}
              placeholder={t('event.form.placeholderOrganization')}
              disabled={!isEditingAllowed}
            ></Field>
          </FormGroup>
          <FormGroup>
            <div className={styles.panel}>
              <Field
                component={CheckboxField}
                label={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('event.form.labelUserConsent', {
                        openInNewTab: t('common.openInNewTab'),
                      }),
                    }}
                  />
                }
                name={EVENT_FIELDS.USER_CONSENT}
                disabled={!isEditingAllowed}
                required
              ></Field>
            </div>
          </FormGroup>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default ExternalUserContact;
