/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  ServerError,
  useApolloClient,
} from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import DateInputField from '../../../common/components/formFields/dateInputField/DateInputField';
import SingleOrganizationClassSelectorField from '../../../common/components/formFields/singleOrganizationClassSelectorField/SingleOrganizationClassSelectorField';
import SingleOrganizationSelectorField from '../../../common/components/formFields/singleOrganizationSelectorField/SingleOrganizationSelectorField';
import SingleSelectField from '../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import UserSelectorField from '../../../common/components/formFields/userSelectorField/UserSelectorField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../../constants';
import {
  CreateOrganizationMutationInput,
  OrganizationFieldsFragment,
  useCreateOrganizationMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import { clearOrganizationsQueries } from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_FIELDS,
  ORGANIZATION_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useOrganizationInternalTypeOptions from '../hooks/useOrganizationInternalTypeOptions';
import useOrganizationServerErrors from '../hooks/useOrganizationServerErrors';
import useOrganizationUpdateActions from '../hooks/useOrganizationUpdateActions';
import OrganizationAuthenticationNotification from '../organizationAuthenticationNotification/OrganizationAuthenticationNotification';
import { OrganizationFormFields } from '../types';
import {
  checkCanUserDoAction,
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

  const action = organization
    ? ORGANIZATION_ACTIONS.UPDATE
    : ORGANIZATION_ACTIONS.CREATE;
  const id = getValue(organization?.id, '');

  const isEditingAllowed = checkCanUserDoAction({
    action,
    id,
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

      return getValue(data.data?.createOrganization.id, '');
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

  const inputRowBorderStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed ? '' : styles.borderInMobile,
    [isEditingAllowed]
  );

  const inputRowBorderStyleIfOrganization = useMemo(
    () => (!isEditingAllowed || organization ? styles.borderInMobile : ''),
    [isEditingAllowed, organization]
  );

  const alignedInputStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed
        ? styles.alignedInput
        : styles.alignedInputWithFullBorder,
    [isEditingAllowed]
  );

  const alignedInputStyleIfOrganization = useMemo(
    () =>
      !isEditingAllowed || organization
        ? styles.alignedInputWithFullBorder
        : styles.alignedInput,
    [isEditingAllowed, organization]
  );

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

        const disabledIfOrganization = !isEditingAllowed || !!organization;

        return (
          <Form className={styles.form} noValidate={true}>
            <OrganizationAuthenticationNotification action={action} id={id} />

            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`organization.form.labelId`)}
                name={ORGANIZATION_FIELDS.ID}
                readOnly
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={alignedInputStyleIfOrganization}
                component={TextInputField}
                label={t(`organization.form.labelDataSource`)}
                name={ORGANIZATION_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>
            <FormRow className={inputRowBorderStyleIfOrganization}>
              <Field
                className={alignedInputStyle}
                component={TextInputField}
                label={t(`organization.form.labelOriginId`)}
                name={ORGANIZATION_FIELDS.ORIGIN_ID}
                readOnly={disabledIfOrganization}
                required={!organization}
              />
            </FormRow>
            <FormRow className={inputRowBorderStyle}>
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
                alignedLabel
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
                alignedLabel
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
                alignedLabel
                className={styles.alignedSelect}
                component={SingleSelectField}
                disabled={disabledIfOrganization}
                label={t(`organization.form.labelInternalType`)}
                options={internalTypeOptions}
                name={ORGANIZATION_FIELDS.INTERNAL_TYPE}
              />
            </FormRow>
            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable
                component={SingleOrganizationClassSelectorField}
                disabled={disabledIfOrganization}
                label={t(`organization.form.labelClassification`)}
                name={ORGANIZATION_FIELDS.CLASSIFICATION}
              />
            </FormRow>
            <FormRow className={inputRowBorderStyleIfOrganization}>
              <Field
                className={alignedInputStyleIfOrganization}
                component={DateInputField}
                label={t(`organization.form.labelFoundingDate`)}
                name={ORGANIZATION_FIELDS.FOUNDING_DATE}
                readOnly={disabledIfOrganization}
              />
            </FormRow>
            <FormRow className={inputRowBorderStyleIfOrganization}>
              <Field
                className={styles.alignedInput}
                component={DateInputField}
                label={t(`organization.form.labelDissolutionDate`)}
                name={ORGANIZATION_FIELDS.DISSOLUTION_DATE}
                readOnly={disabledIfOrganization}
              />
            </FormRow>
            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                component={SingleOrganizationSelectorField}
                disabled={disabledIfOrganization}
                label={t(`organization.form.labelParentOrganization`)}
                name={ORGANIZATION_FIELDS.PARENT_ORGANIZATION}
                required={!organization}
              />
            </FormRow>
            <FormRow>
              <Field
                alignedLabel
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
