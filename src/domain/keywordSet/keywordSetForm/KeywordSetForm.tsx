/* eslint-disable max-len */
import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import KeywordSelectorField from '../../../common/components/formFields/keywordSelectorField/KeywordSelectorField';
import PublisherSelectorField from '../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import SingleSelectField from '../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import useAdminFormStyles from '../../admin/layout/hooks/useAdminFormStyles';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useKeywordSetUsageOptions from '../../keywordSets/hooks/useKeywordSetUsageOptions';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  KEYWORD_SET_ACTIONS,
  KEYWORD_SET_FIELDS,
  KEYWORD_SET_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useKeywordSetActions from '../hooks/useKeywordSetActions';
import useKeywordSetServerErrors from '../hooks/useKeywordSetServerErrors';
import KeywordSetAuthenticationNotification from '../keywordSetAuthenticationNotification/KeywordSetAuthenticationNotification';
import { KeywordSetFormFields } from '../types';
import { checkCanUserDoAction, getKeywordSetInitialValues } from '../utils';
import { getFocusableKeywordSetFieldId, keywordSetSchema } from '../validation';

type KeywordSetFormProps = {
  keywordSet?: KeywordSetFieldsFragment;
};

const KeywordSetForm: React.FC<KeywordSetFormProps> = ({ keywordSet }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const navigate = useNavigate();
  const locale = useLocale();
  const { user } = useUser();
  const usageOptions = useKeywordSetUsageOptions();

  const action = keywordSet
    ? KEYWORD_SET_ACTIONS.UPDATE
    : KEYWORD_SET_ACTIONS.CREATE;
  const organization = getValue(keywordSet?.organization, '');
  const { organizationAncestors } = useOrganizationAncestors(organization);
  const isEditingAllowed = checkCanUserDoAction({
    action,
    organization,
    organizationAncestors,
    user,
  });

  const { createKeywordSet, saving, updateKeywordSet } = useKeywordSetActions({
    keywordSet,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useKeywordSetServerErrors();

  /* istanbul ignore next */
  const goToKeywordSetsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORD_SETS}`);
  };

  /* istanbul ignore next */
  const onCreate = async (values: KeywordSetFormFields) => {
    await createKeywordSet(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: goToKeywordSetsPage,
    });
  };

  /* istanbul ignore next */
  const onUpdate = async (values: KeywordSetFormFields) => {
    await updateKeywordSet(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: () => {
        goToKeywordSetsPage();
        addNotification({
          label: t('keywordSet.form.notificationKeywordSetUpdated'),
          type: 'success',
        });
      },
    });
  };

  const {
    alignedInputStyleIfHasInstance,
    inputRowBorderStyle,
    inputRowBorderStyleIfHasInstance,
  } = useAdminFormStyles({
    isEditingAllowed,
    instance: keywordSet,
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        keywordSet
          ? getKeywordSetInitialValues(keywordSet)
          : KEYWORD_SET_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={
        /* istanbul ignore next */
        () => undefined
      }
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={
        /* istanbul ignore next */
        isEditingAllowed && keywordSetSchema
      }
    >
      {({ setErrors, setTouched, values }) => {
        /* istanbul ignore next */
        const clearErrors = () => setErrors({});

        /* istanbul ignore next */
        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();
          setServerErrorItems([]);
          clearErrors();

          try {
            await keywordSetSchema.validate(values, { abortEarly: false });

            if (keywordSet) {
              await onUpdate(values);
            } else {
              await onCreate(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as ValidationError,
              getFocusableFieldId: getFocusableKeywordSetFieldId,
            });
          }
        };

        const organization = keywordSet
          ? getValue(keywordSet.organization, '')
          : values.organization;

        /* istanbul ignore next */
        const disabledIfKeywordSet = !isEditingAllowed || !!keywordSet;

        return (
          <Form noValidate={true}>
            <KeywordSetAuthenticationNotification
              action={action}
              organization={organization}
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
                className={alignedInputStyleIfHasInstance}
                component={TextInputField}
                label={t(`keywordSet.form.labelDataSource`)}
                name={KEYWORD_SET_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>

            <FormRow className={inputRowBorderStyleIfHasInstance}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`keywordSet.form.labelOriginId`)}
                name={KEYWORD_SET_FIELDS.ORIGIN_ID}
                readOnly={disabledIfKeywordSet}
                required
              />
            </FormRow>

            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable
                component={PublisherSelectorField}
                disabled={disabledIfKeywordSet}
                texts={{ label: t(`keywordSet.form.labelOrganization`) }}
                name={KEYWORD_SET_FIELDS.ORGANIZATION}
              />
            </FormRow>

            {ORDERED_LE_DATA_LANGUAGES.map((language, i) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );
              const isLastRow = ORDERED_LE_DATA_LANGUAGES.length - 1 === i;

              return (
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={
                      /* istanbul ignore next */
                      !isEditingAllowed && !isLastRow
                        ? styles.alignedInputWithFullBorder
                        : styles.alignedInput
                    }
                    component={TextInputField}
                    label={`${t('keywordSet.form.labelName')} (${langText})`}
                    name={`${KEYWORD_SET_FIELDS.NAME}.${language}`}
                    readOnly={!isEditingAllowed}
                    required={language === LE_DATA_LANGUAGES.FI}
                  />
                </FormRow>
              );
            })}
            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                component={KeywordSelectorField}
                disabled={!isEditingAllowed}
                name={KEYWORD_SET_FIELDS.KEYWORDS}
                texts={{
                  label: t(`keywordSet.form.labelKeywords`),
                }}
                required
              />
            </FormRow>

            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                component={SingleSelectField}
                disabled={!isEditingAllowed}
                name={KEYWORD_SET_FIELDS.USAGE}
                options={usageOptions}
                texts={{ label: t(`keywordSet.form.labelUsage`) }}
                required
              />
            </FormRow>

            {keywordSet ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                organization={organization}
                saving={saving}
              />
            ) : (
              <CreateButtonPanel
                onSave={handleSubmit}
                organization={organization}
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
