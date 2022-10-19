/* eslint-disable max-len */
import { useApolloClient } from '@apollo/client';
import { Field, useField, useFormikContext } from 'formik';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import {
  CHARACTER_LIMITS,
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../../../../constants';
import { ImageDocument, ImageQuery } from '../../../../../generated/graphql';
import useLocale from '../../../../../hooks/useLocale';
import { isFeatureEnabled } from '../../../../../utils/featureFlags';
import getPathBuilder from '../../../../../utils/getPathBuilder';
import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import parseIdFromAtId from '../../../../../utils/parseIdFromAtId';
import {
  DEFAULT_LICENSE_TYPE,
  IMAGE_FIELDS,
  LICENSE_TYPES,
} from '../../../../image/constants';
import useIsImageEditable from '../../../../image/hooks/useIsImageEditable';
import { getImageFields, imagePathBuilder } from '../../../../image/utils';
import { EVENT_FIELDS } from '../../../constants';
import eventPageStyles from '../../../eventPage.module.scss';
import styles from './imageDetailsFields.module.scss';

export interface ImageDetailsFieldsProps {
  field: string;
  imageAtId: string;
}

const ImageDetailsFields: React.FC<ImageDetailsFieldsProps> = ({
  field,
  imageAtId,
}) => {
  const { editable, warning } = useIsImageEditable({ imageAtId });
  const locale = useLocale();
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const licenseOptions = [
    {
      label: t(`image.license.${camelCase(LICENSE_TYPES.CC_BY)}`),
      value: LICENSE_TYPES.CC_BY,
    },
    {
      label: t(`image.license.${camelCase(LICENSE_TYPES.EVENT_ONLY)}.${type}`),
      value: LICENSE_TYPES.EVENT_ONLY,
    },
  ];

  const { setFieldValue } = useFormikContext();

  const getFieldName = (path: string) => `${field}.${path}`;

  const apolloClient = useApolloClient();

  const clearFields = React.useCallback(() => {
    setFieldValue(
      field,
      {
        [IMAGE_FIELDS.ALT_TEXT]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [IMAGE_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
        [IMAGE_FIELDS.NAME]: '',
        [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
      },
      true
    );
  }, [field, setFieldValue]);

  React.useEffect(() => {
    if (imageAtId) {
      const setImageFieldValues = async () => {
        try {
          const { data } = await apolloClient.query<ImageQuery>({
            query: ImageDocument,
            variables: {
              createPath: getPathBuilder(imagePathBuilder),
              id: parseIdFromAtId(imageAtId),
            },
          });

          const imageFields = getImageFields(data.image, locale);

          setFieldValue(
            field,
            {
              [IMAGE_FIELDS.ALT_TEXT]: imageFields.altText,
              [IMAGE_FIELDS.LICENSE]: imageFields.license,
              [IMAGE_FIELDS.NAME]: imageFields.name,
              [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: imageFields.photographerName,
            },
            true
          );
        } catch (err) {
          // clear values when error happens
          clearFields();
        }
      };

      setImageFieldValues();
    } else {
      // clear values when error happens
      clearFields();
    }
  }, [apolloClient, clearFields, field, imageAtId, locale, setFieldValue]);

  React.useEffect(() => {
    setFieldValue(EVENT_FIELDS.IS_IMAGE_EDITABLE, editable, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  return (
    <div className={styles.imageDetailsFields}>
      {/* TODO: Remove LOCALIZED_IMAGE feature flag when localized image alt
          text is deployed to production of API */}
      {isFeatureEnabled('LOCALIZED_IMAGE') ? (
        ORDERED_LE_DATA_LANGUAGES.map((language) => {
          const langText = lowerCaseFirstLetter(
            t(`form.inLanguage.${language}`)
          );

          return (
            <Field
              key={language}
              className={styles.alignedInput}
              component={TextInputField}
              disabled={!editable}
              label={`${t('image.form.labelAltText')} (${langText})`}
              name={`${getFieldName(IMAGE_FIELDS.ALT_TEXT)}.${language}`}
              placeholder={`${t(
                'image.form.placeholderAltText'
              )} (${langText})`}
              required={language === LE_DATA_LANGUAGES.FI}
              title={warning}
            />
          );
        })
      ) : (
        <Field
          className={styles.alignedInput}
          component={TextInputField}
          disabled={!editable}
          label={t('image.form.labelAltText')}
          name={`${IMAGE_FIELDS.ALT_TEXT}.fi`}
          placeholder={t('image.form.placeholderAltText')}
          required={true}
        />
      )}
      <Field
        disabled={!editable}
        name={getFieldName(IMAGE_FIELDS.NAME)}
        component={TextInputField}
        label={t(`image.form.labelName`)}
        maxLength={CHARACTER_LIMITS.MEDIUM_STRING}
        placeholder={t(`image.form.placeholderName`)}
        required={editable}
        title={warning}
      />
      <Field
        disabled={!editable}
        name={getFieldName(IMAGE_FIELDS.PHOTOGRAPHER_NAME)}
        component={TextInputField}
        label={t(`image.form.labelPhotographerName`)}
        placeholder={t(`image.form.placeholderPhotographerName`)}
        title={warning}
      />
      <div>
        <h3 className={eventPageStyles.noTopMargin}>
          {t(`image.form.titleLicense`)}
        </h3>
        <Field
          disabled={!editable}
          name={getFieldName(IMAGE_FIELDS.LICENSE)}
          component={RadioButtonGroupField}
          options={licenseOptions}
          title={warning}
        />
      </div>
    </div>
  );
};

export default ImageDetailsFields;
