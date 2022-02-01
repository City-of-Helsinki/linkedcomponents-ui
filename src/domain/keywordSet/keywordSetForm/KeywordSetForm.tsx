/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ValidationError } from 'yup';

import KeywordSelectorField from '../../../common/components/formFields/KeywordSelectorField';
import PublisherSelectorField from '../../../common/components/formFields/PublisherSelectorField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import {
  CreateKeywordSetMutationInput,
  KeywordSetFieldsFragment,
  useCreateKeywordSetMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import { reportError } from '../../app/sentry/utils';
import useKeywordSetUsageOptions from '../../keywordSets/hooks/useKeywordSetUsageOptions';
import { clearKeywordSetsQueries } from '../../keywordSets/utils';
import useUser from '../../user/hooks/useUser';
import {
  KEYWORD_SET_ACTIONS,
  KEYWORD_SET_FIELDS,
  KEYWORD_SET_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import useKeywordSetServerErrors from '../hooks/useKeywordSetServerErrors';
import useKeywordSetUpdateActions from '../hooks/useKeywordSetUpdateActions';
import KeywordSetAuthenticationNotification from '../keywordSetAuthenticationNotification/KeywordSetAuthenticationNotification';
import { KeywordSetFormFields } from '../types';
import { getKeywordSetPayload } from '../utils';
import { getFocusableFieldId, keywordSetSchema } from '../validation';

type KeywordSetFormProps = {
  keywordSet?: KeywordSetFieldsFragment;
};

const KeywordSetForm: React.FC<KeywordSetFormProps> = ({ keywordSet }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const locale = useLocale();
  const { user } = useUser();
  const usageOptions = useKeywordSetUsageOptions();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const { saving, setSaving } = useKeywordSetUpdateActions();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useKeywordSetServerErrors();

  const [createKeywordSetMutation] = useCreateKeywordSetMutation();

  const goToKeywordSetsPage = () => {
    history.push(`/${locale}${ROUTES.KEYWORD_SETS}`);
  };

  const createSingleKeywordSet = async (
    payload: CreateKeywordSetMutationInput
  ) => {
    try {
      const data = await createKeywordSetMutation({
        variables: { input: payload },
      });

      return data.data?.createKeywordSet.id as string;
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

  const createKeyword = async (values: KeywordSetFormFields) => {
    setSaving(KEYWORD_SET_ACTIONS.CREATE);
    const payload = getKeywordSetPayload(values);

    const createdKeywordId = await createSingleKeywordSet(payload);

    if (createdKeywordId) {
      // Clear all keywords queries from apollo cache to show added registrations
      // in registration list
      clearKeywordSetsQueries(apolloClient);
      goToKeywordSetsPage();
    }

    setSaving(null);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={KEYWORD_SET_INITIAL_VALUES}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={keywordSetSchema}
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

            await keywordSetSchema.validate(values, { abortEarly: false });

            if (keywordSet) {
            } else {
              await createKeyword(values);
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
            <KeywordSetAuthenticationNotification
              action={
                keywordSet
                  ? KEYWORD_SET_ACTIONS.UPDATE
                  : KEYWORD_SET_ACTIONS.CREATE
              }
              publisher={
                keywordSet
                  ? (keywordSet.organization as string)
                  : values.organization
              }
            />
            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`keywordSet.form.labelId`)}
                name={KEYWORD_SET_FIELDS.ID}
                readOnly
              />
            </FormRow>

            <FormRow className={styles.borderInMobile}>
              <Field
                className={
                  keywordSet
                    ? styles.alignedInputWithFullBorder
                    : styles.alignedInput
                }
                component={TextInputField}
                label={t(`keywordSet.form.labelDataSource`)}
                name={KEYWORD_SET_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>

            <FormRow className={keywordSet && styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`keywordSet.form.labelOriginId`)}
                name={KEYWORD_SET_FIELDS.ORIGIN_ID}
                readOnly={!!keywordSet}
              />
            </FormRow>

            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable
                component={PublisherSelectorField}
                label={t(`keywordSet.form.labelOrganization`)}
                name={KEYWORD_SET_FIELDS.ORGANIZATION}
                disabled={!!keywordSet}
              />
            </FormRow>

            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language}>
                  <Field
                    className={styles.alignedInput}
                    component={TextInputField}
                    label={`${t('keywordSet.form.labelName')} (${langText})`}
                    name={`${KEYWORD_SET_FIELDS.NAME}.${language}`}
                    required={language === LE_DATA_LANGUAGES.FI}
                  />
                </FormRow>
              );
            })}
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={KeywordSelectorField}
                label={t(`keywordSet.form.labelKeywords`)}
                name={KEYWORD_SET_FIELDS.KEYWORDS}
                required
              />
            </FormRow>

            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={SingleSelectField}
                label={t(`keywordSet.form.labelUsage`)}
                name={KEYWORD_SET_FIELDS.USAGE}
                options={usageOptions}
                required
              />
            </FormRow>

            {keywordSet ? null : (
              <CreateButtonPanel
                onSave={handleSubmit}
                publisher={values.organization}
                saving={saving}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default KeywordSetForm;
