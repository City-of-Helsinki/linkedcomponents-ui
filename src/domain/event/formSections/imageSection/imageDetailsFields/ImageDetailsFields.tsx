import { useApolloClient } from '@apollo/client';
import { Field, useField, useFormikContext } from 'formik';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../../common/components/formFields/RadioButtonGroupField';
import TextInputField from '../../../../../common/components/formFields/TextInputField';
import { CHARACTER_LIMITS } from '../../../../../constants';
import { ImageDocument, ImageQuery } from '../../../../../generated/graphql';
import getPathBuilder from '../../../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../../../utils/parseIdFromAtId';
import {
  DEFAULT_LICENSE_TYPE,
  LICENSE_TYPES,
} from '../../../../image/constants';
import useIsImageEditable from '../../../../image/hooks/useIsImageEditable';
import { getImageFields, imagePathBuilder } from '../../../../image/utils';
import { EVENT_FIELDS, IMAGE_DETAILS_FIELDS } from '../../../constants';
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
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const licenseOptions = [
    {
      label: t(`event.form.image.license.${camelCase(LICENSE_TYPES.CC_BY)}`),
      value: LICENSE_TYPES.CC_BY,
    },
    {
      label: t(
        `event.form.image.license.${camelCase(
          LICENSE_TYPES.EVENT_ONLY
        )}.${type}`
      ),
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
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
        [IMAGE_DETAILS_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
        [IMAGE_DETAILS_FIELDS.NAME]: '',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
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

          const imageFields = getImageFields(data.image);
          setFieldValue(
            field,
            {
              [IMAGE_DETAILS_FIELDS.ALT_TEXT]: imageFields.altText,
              [IMAGE_DETAILS_FIELDS.LICENSE]: imageFields.license,
              [IMAGE_DETAILS_FIELDS.NAME]: imageFields.name,
              [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]:
                imageFields.photographerName,
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
  }, [apolloClient, clearFields, field, imageAtId, setFieldValue]);

  React.useEffect(() => {
    setFieldValue(EVENT_FIELDS.IS_IMAGE_EDITABLE, editable, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  return (
    <div className={styles.imageDetailsFields}>
      <div>
        <Field
          disabled={!editable}
          name={getFieldName(IMAGE_DETAILS_FIELDS.ALT_TEXT)}
          component={TextInputField}
          label={t(`event.form.image.labelAltText`)}
          maxLength={CHARACTER_LIMITS.SHORT_STRING}
          placeholder={t(`event.form.image.placeholderAltText`)}
          required={editable}
          title={warning}
        />
      </div>
      <div>
        <Field
          disabled={!editable}
          name={getFieldName(IMAGE_DETAILS_FIELDS.NAME)}
          component={TextInputField}
          label={t(`event.form.image.labelName`)}
          maxLength={CHARACTER_LIMITS.MEDIUM_STRING}
          placeholder={t(`event.form.image.placeholderName`)}
          required={editable}
          title={warning}
        />
      </div>
      <div>
        <Field
          disabled={!editable}
          name={getFieldName(IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME)}
          component={TextInputField}
          label={t(`event.form.image.labelPhotographerName`)}
          placeholder={t(`event.form.image.placeholderPhotographerName`)}
          title={warning}
        />
      </div>
      <div>
        <h3 className={eventPageStyles.noTopMargin}>
          {t(`event.form.image.titleLicense`)}
        </h3>
        <Field
          disabled={!editable}
          name={getFieldName(IMAGE_DETAILS_FIELDS.LICENSE)}
          component={RadioButtonGroupField}
          options={licenseOptions}
          title={warning}
        />
      </div>
    </div>
  );
};

export default ImageDetailsFields;
