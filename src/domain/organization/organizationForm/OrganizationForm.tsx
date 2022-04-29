/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  ServerError,
  useApolloClient,
} from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import DatepickerField from '../../../common/components/formFields/DatepickerField';
import SingleDataSourceSelectorField from '../../../common/components/formFields/SingleDataSourceSelectorField';
import SingleOrganizationClassSelectorField from '../../../common/components/formFields/SingleOrganizationClassSelectorField';
import SingleOrganizationSelectorField from '../../../common/components/formFields/SingleOrganizationSelectorField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import UserSelectorField from '../../../common/components/formFields/UserSelectorField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../../constants';
import {
  CreateOrganizationMutationInput,
  OrganizationFieldsFragment,
  useCreateOrganizationMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_FIELDS,
  ORGANIZATION_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useOrganizationAncestors from '../hooks/useOrganizationAncestors';
import useOrganizationInternalTypeOptions from '../hooks/useOrganizationInternalTypeOptions';
import useOrganizationServerErrors from '../hooks/useOrganizationServerErrors';
import useOrganizationUpdateActions from '../hooks/useOrganizationUpdateActions';
import OrganizationAuthenticationNotification from '../organizationAuthenticationNotification/OrganizationAuthenticationNotification';
import { OrganizationFormFields } from '../types';
import {
  checkCanUserDoAction,
  clearOrganizationsQueries,
  getOrganizationInitialValues,
  getOrganizationPayload,
} from '../utils';
import { getFocusableFieldId, organizationSchema } from '../validation';
import SubOrganizationTable from './subOrganizationTable/SubOrganizationTable';

type OrganizationFormProps = {
  organization?: OrganizationFieldsFragment;
};

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const internalTypeOptions = useOrganizationInternalTypeOptions();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    organization?.id ?? ''
  );

  const isEditingAllowed = checkCanUserDoAction({
    action: organization
      ? ORGANIZATION_ACTIONS.UPDATE
      : ORGANIZATION_ACTIONS.CREATE,
    id: organization?.id ?? '',
    organizationAncestors,
    user,
  });

  const goToOrganizationsPage = () => {
    navigate(`/${locale}${ROUTES.ORGANIZATIONS}`);
  };

  const { saving, setSaving, updateOrganization } =
    useOrganizationUpdateActions({
      organization,
    });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useOrganizationServerErrors();

  const [createOrganizationMutation] = useCreateOrganizationMutation();

  const onUpdate = async (values: OrganizationFormFields) => {
    await updateOrganization(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: async () => {
        goToOrganizationsPage();
      },
    });
  };

  const createSingleOrganization = async (
    payload: CreateOrganizationMutationInput
  ) => {
    try {
      const data = await createOrganizationMutation({
        variables: { input: payload },
      });

      return data.data?.createOrganization.id as string;
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error });
      // // Report error to Sentry
      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to create keyword',
        user,
      });
    }
  };

  const createOrganization = async (values: OrganizationFormFields) => {
    setSaving(ORGANIZATION_ACTIONS.CREATE);
    const payload = getOrganizationPayload(values);

    const createdKeywordId = await createSingleOrganization(payload);

    if (createdKeywordId) {
      // Clear all keywords queries from apollo cache to show added registrations
      // in registration list
      clearOrganizationsQueries(apolloClient);
      goToOrganizationsPage();
    }

    setSaving(null);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        organization
          ? getOrganizationInitialValues(organization)
          : ORGANIZATION_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={isEditingAllowed && organizationSchema}
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
              await createOrganization(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as ValidationError,
              getFocusableFieldId,
            });
          }
        };

        return (
          <Form className={styles.form} noValidate={true}>
            <OrganizationAuthenticationNotification
              action={
                organization
                  ? ORGANIZATION_ACTIONS.UPDATE
                  : ORGANIZATION_ACTIONS.CREATE
              }
              id={organization?.id ?? ''}
            />

            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`organization.form.labelId`)}
                name={ORGANIZATION_FIELDS.ID}
                readOnly
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleDataSourceSelectorField}
                disabled={!isEditingAllowed || !!organization}
                label={t(`organization.form.labelDataSource`)}
                name={ORGANIZATION_FIELDS.DATA_SOURCE}
                required
                showOnlyUserEditable={true}
              />
            </FormRow>
            <FormRow
              className={
                !isEditingAllowed || organization ? styles.borderInMobile : ''
              }
            >
              <Field
                className={
                  /* istanbul ignore next */
                  isEditingAllowed
                    ? styles.alignedInput
                    : styles.alignedInputWithFullBorder
                }
                component={TextInputField}
                label={t(`organization.form.labelOriginId`)}
                name={ORGANIZATION_FIELDS.ORIGIN_ID}
                readOnly={!isEditingAllowed || !!organization}
                required
              />
            </FormRow>
            <FormRow
              className={
                /* istanbul ignore next */
                !isEditingAllowed ? styles.borderInMobile : ''
              }
            >
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`organization.form.labelName`)}
                name={ORGANIZATION_FIELDS.NAME}
                readOnly={!isEditingAllowed}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={UserSelectorField}
                disabled={!isEditingAllowed}
                label={t(`organization.form.labelAdminUsers`)}
                name={ORGANIZATION_FIELDS.ADMIN_USERS}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={UserSelectorField}
                disabled={!isEditingAllowed}
                label={t(`organization.form.labelRegularUsers`)}
                name={ORGANIZATION_FIELDS.REGULAR_USERS}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleSelectField}
                disabled={!isEditingAllowed || !!organization}
                label={t(`organization.form.labelInternalType`)}
                options={internalTypeOptions}
                name={ORGANIZATION_FIELDS.INTERNAL_TYPE}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={SingleOrganizationClassSelectorField}
                disabled={!isEditingAllowed || !!organization}
                label={t(`organization.form.labelClassification`)}
                name={ORGANIZATION_FIELDS.CLASSIFICATION}
              />
            </FormRow>
            <FormRow
              className={
                !isEditingAllowed || organization ? styles.borderInMobile : ''
              }
            >
              <Field
                className={styles.alignedInputWithFullBorder}
                component={DatepickerField}
                label={t(`organization.form.labelFoundingDate`)}
                name={ORGANIZATION_FIELDS.FOUNDING_DATE}
                readOnly={!isEditingAllowed || !!organization}
              />
            </FormRow>
            <FormRow
              className={
                !isEditingAllowed || organization ? styles.borderInMobile : ''
              }
            >
              <Field
                className={styles.alignedInput}
                component={DatepickerField}
                label={t(`organization.form.labelDissolutionDate`)}
                name={ORGANIZATION_FIELDS.DISSOLUTION_DATE}
                readOnly={!isEditingAllowed || !!organization}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleOrganizationSelectorField}
                disabled={!isEditingAllowed || !!organization}
                label={t(`organization.form.labelParentOrganization`)}
                name={ORGANIZATION_FIELDS.PARENT_ORGANIZATION}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleOrganizationSelectorField}
                disabled={!isEditingAllowed}
                label={t(`organization.form.labelReplacedBy`)}
                name={ORGANIZATION_FIELDS.REPLACED_BY}
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

            {organization ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                saving={saving}
              />
            ) : (
              <CreateButtonPanel onSave={handleSubmit} saving={saving} />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrganizationForm;
