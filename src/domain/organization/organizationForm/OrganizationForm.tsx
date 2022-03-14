/* eslint-disable max-len */
import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';

import DatepickerField from '../../../common/components/formFields/DatepickerField';
import SingleOrganizationSelectorField from '../../../common/components/formFields/SingleOrganizationSelectorField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import UserSelectorField from '../../../common/components/formFields/UserSelectorField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../../constants';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_FIELDS,
  ORGANIZATION_INITIAL_VALUES,
} from '../constants';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useOrganizationInternalTypeOptions from '../hooks/useOrganizationInternalTypeOptions';
import useOrganizationServerErrors from '../hooks/useOrganizationServerErrors';
import useOrganizationUpdateActions from '../hooks/useOrganizationUpdateActions';
import OrganizationAuthenticationNotification from '../organizationAuthenticationNotification/OrganizationAuthenticationNotification';
import { OrganizationFormFields } from '../types';
import { getOrganizationInitialValues } from '../utils';
import { organizationSchema } from '../validation';
import SubOrganizationTable from './subOrganizationTable/SubOrganizationTable';

type OrganizationFormProps = {
  organization?: OrganizationFieldsFragment;
};

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const internalTypeOptions = useOrganizationInternalTypeOptions();

  const goToOrganizationsPage = () => {
    history.push(`/${locale}${ROUTES.ORGANIZATIONS}`);
  };

  const { saving, updateOrganization } = useOrganizationUpdateActions({
    organization,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useOrganizationServerErrors();

  const onUpdate = async (values: OrganizationFormFields) => {
    await updateOrganization(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: async () => {
        goToOrganizationsPage();
      },
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        organization
          ? getOrganizationInitialValues(organization)
          : /* istanbul ignore next */ ORGANIZATION_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={organizationSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await organizationSchema.validate(values, { abortEarly: false });

            if (organization) {
              await onUpdate(values);
            } else {
              toast.error('TODO: Handle saving organization');
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form className={styles.form} noValidate={true}>
            <OrganizationAuthenticationNotification
              action={ORGANIZATION_ACTIONS.UPDATE}
              id={organization?.id as string}
            />

            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={UserSelectorField}
                label={t(`organization.form.labelAdminUsers`)}
                name={ORGANIZATION_FIELDS.ADMIN_USERS}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={UserSelectorField}
                label={t(`organization.form.labelRegularUsers`)}
                name={ORGANIZATION_FIELDS.REGULAR_USERS}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleOrganizationSelectorField}
                label={t(`organization.form.labelReplacedBy`)}
                name={ORGANIZATION_FIELDS.REPLACED_BY}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`organization.form.labelId`)}
                name={ORGANIZATION_FIELDS.ID}
                readOnly={!!organization}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`organization.form.labelDataSource`)}
                name={ORGANIZATION_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={SingleSelectField}
                label={t(`organization.form.labelInternalType`)}
                options={internalTypeOptions}
                name={ORGANIZATION_FIELDS.INTERNAL_TYPE}
                disabled={!!organization}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`organization.form.labelOriginId`)}
                name={ORGANIZATION_FIELDS.ORIGIN_ID}
                readOnly={!!organization}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`organization.form.labelClassification`)}
                name={ORGANIZATION_FIELDS.CLASSIFICATION}
                readOnly={!!organization}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`organization.form.labelName`)}
                name={ORGANIZATION_FIELDS.NAME}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={DatepickerField}
                label={t(`organization.form.labelFoundingDate`)}
                name={ORGANIZATION_FIELDS.FOUNDING_DATE}
                readOnly={!!organization}
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={DatepickerField}
                label={t(`organization.form.labelDissolutionDate`)}
                name={ORGANIZATION_FIELDS.DISSOLUTION_DATE}
                readOnly={!!organization}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleOrganizationSelectorField}
                label={t(`organization.form.labelParentOrganization`)}
                name={ORGANIZATION_FIELDS.PARENT_ORGANIZATION}
                disabled={!!organization}
              />
            </FormRow>

            <SubOrganizationTable
              organizationIds={values.subOrganizations}
              title={t('organization.subOrganizationsTableTitle')}
            />

            <SubOrganizationTable
              organizationIds={values.affiliatedOrganizations}
              title={t('organization.affiliatedOrganizationsTableTitle')}
            />

            <EditButtonPanel
              id={values.id}
              onSave={handleSubmit}
              saving={saving}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrganizationForm;
