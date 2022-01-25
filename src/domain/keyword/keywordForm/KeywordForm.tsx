import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../common/components/formFields/CheckboxField';
import OrganizationSelectorField from '../../../common/components/formFields/OrganizationSelectorField';
import SingleKeywordSelectorField from '../../../common/components/formFields/SingleKeywordSelectorField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../../constants';
import { KeywordFieldsFragment } from '../../../generated/graphql';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import Container from '../../app/layout/Container';
import { KEYWORD_FIELDS } from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import FormRow from './FormRow';
import styles from './keywordForm.module.scss';

type KeywordFormProps = {
  keyword?: KeywordFieldsFragment;
};

const KeywordForm: React.FC<KeywordFormProps> = ({ keyword }) => {
  const { t } = useTranslation();

  const initialValues = {
    [KEYWORD_FIELDS.DATA_SOURCE]: '',
    [KEYWORD_FIELDS.DEPRECATED]: false,
    [KEYWORD_FIELDS.ID]: '',
    [KEYWORD_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
    [KEYWORD_FIELDS.ORIGIN_ID]: '',
    [KEYWORD_FIELDS.PUBLISHER]: '',
    [KEYWORD_FIELDS.REPLACED_BY]: '',
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {() => {
        return (
          <Form className={styles.form} noValidate={true}>
            <Container className={styles.form} withOffset>
              <FormRow className={styles.borderInMobile}>
                <Field
                  className={styles.alignedInputWithFullBorder}
                  component={TextInputField}
                  label={t(`keyword.form.labelId`)}
                  name={KEYWORD_FIELDS.ID}
                  readOnly
                />
              </FormRow>

              <FormRow className={styles.borderInMobile}>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`keyword.form.labelDataSource`)}
                  name={KEYWORD_FIELDS.DATA_SOURCE}
                  readOnly
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`keyword.form.labelOriginId`)}
                  name={KEYWORD_FIELDS.ORIGIN_ID}
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedSelect}
                  clearable
                  component={OrganizationSelectorField}
                  label={t(`keyword.form.labelPublisher`)}
                  name={KEYWORD_FIELDS.PUBLISHER}
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
                      label={`${t('keyword.form.labelName')} (${langText})`}
                      name={`${KEYWORD_FIELDS.NAME}.${language}`}
                      required={language === LE_DATA_LANGUAGES.FI}
                    />
                  </FormRow>
                );
              })}

              <FormRow>
                <Field
                  className={styles.alignedSelect}
                  clearable
                  component={SingleKeywordSelectorField}
                  label={t(`keyword.form.labelReplacedBy`)}
                  name={KEYWORD_FIELDS.REPLACED_BY}
                />
              </FormRow>

              <FormRow>
                <Field
                  label={t(`keyword.form.labelDeprecated`)}
                  name={KEYWORD_FIELDS.DEPRECATED}
                  component={CheckboxField}
                />
              </FormRow>
            </Container>
            {!keyword && (
              <CreateButtonPanel
                onSave={() => alert('TODO: save')}
                saving={false}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default KeywordForm;
