import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { VIDEO_DETAILS_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldRow from '../../layout/FieldRow';
import FieldWithButton from '../../layout/FieldWithButton';

type Props = {
  canDelete: boolean;
  onDelete: () => void;
  type: string;
  videoPath: string;
};

const getFieldName = (videoPath: string, field: string) =>
  `${videoPath}.${field}`;

const Video: React.FC<Props> = ({ canDelete, onDelete, type, videoPath }) => {
  const { t } = useTranslation();

  const [{ value: name }] = useField({
    name: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.NAME),
  });
  const [{ value: url }] = useField({
    name: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.URL),
  });
  const [{ value: altText }] = useField({
    name: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.ALT_TEXT),
  });

  const isRequired = Boolean(name || url || altText);

  return (
    <>
      <h3>{t(`event.form.titleVideo.${type}`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.notificationTitleVideo.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextVideo1.${type}`)}</p>
            <p>{t(`event.form.infoTextVideo2`)}</p>
          </Notification>
        }
      >
        <FieldWithButton
          button={
            canDelete && (
              <DeleteButton
                label={t('event.form.buttonDeleteVideo')}
                onClick={onDelete}
              />
            )
          }
        >
          <>
            <FormGroup>
              <Field
                component={TextInputField}
                name={getFieldName(videoPath, VIDEO_DETAILS_FIELDS.NAME)}
                label={t(`event.form.labelVideoName`)}
                placeholder={t(`event.form.placeholderVideoName`)}
                required={isRequired}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={TextInputField}
                name={getFieldName(videoPath, VIDEO_DETAILS_FIELDS.ALT_TEXT)}
                label={t(`event.form.labelVideoAltText`)}
                placeholder={t(`event.form.placeholderVideoAltText`)}
                required={isRequired}
              />
            </FormGroup>

            <FormGroup>
              <Field
                component={TextInputField}
                name={getFieldName(videoPath, VIDEO_DETAILS_FIELDS.URL)}
                label={t(`event.form.labelVideoUrl`)}
                placeholder={t(`event.form.placeholderVideoUrl`)}
                required={isRequired}
              />
            </FormGroup>
          </>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default Video;
