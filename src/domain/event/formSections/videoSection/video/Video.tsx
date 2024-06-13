import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../common/components/deleteButton/DeleteButton';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../../common/components/notification/Notification';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../../user/hooks/useUser';
import { VIDEO_DETAILS_FIELDS } from '../../../constants';
import styles from '../../../eventPage.module.scss';
import FieldWithButton from '../../../layout/FieldWithButton';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../../utils';
import VideoInstructions from '../videoInstructions/VideoInstructions';

type Props = {
  canDelete: boolean;
  isEditingAllowed: boolean;
  onDelete: () => void;
  showInstructions?: boolean;
  type: string;
  videoPath: string;
};

const getFieldName = (videoPath: string, field: string) =>
  `${videoPath}.${field}`;

const Video: React.FC<Props> = ({
  canDelete,
  isEditingAllowed,
  onDelete,
  showInstructions,
  type,
  videoPath,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const fieldNames = React.useMemo(
    () => ({
      altText: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.ALT_TEXT),
      name: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.NAME),
      url: getFieldName(videoPath, VIDEO_DETAILS_FIELDS.URL),
    }),
    [videoPath]
  );

  const [{ value: altText }] = useField({
    name: fieldNames.altText,
  });
  const [{ value: name }] = useField({
    name: fieldNames.name,
  });
  const [{ value: url }] = useField({
    name: fieldNames.url,
  });

  const isRequired = React.useMemo(
    () => Boolean(name || url || altText),
    [altText, name, url]
  );

  return (
    <>
      <HeadingWithTooltip
        heading={t(`event.form.titleVideo.${type}`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<VideoInstructions eventType={type} />}
        tooltipLabel={t(`event.form.notificationTitleVideo.${type}`)}
      />

      <FieldRow
        notification={
          showInstructions && showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.notificationTitleVideo.${type}`)}
              type="info"
            >
              <VideoInstructions eventType={type} />
            </Notification>
          ) : undefined
        }
      >
        <FieldWithButton
          button={
            canDelete && (
              <DeleteButton
                ariaLabel={t('event.form.buttonDeleteVideo')}
                disabled={!isEditingAllowed}
                onClick={onDelete}
              />
            )
          }
        >
          <>
            <FormGroup>
              <Field
                component={TextInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelVideoUrl`)}
                name={fieldNames.url}
                placeholder={t(`event.form.placeholderVideoUrl`)}
                required={isRequired}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={TextInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelVideoName`)}
                name={fieldNames.name}
                placeholder={t(`event.form.placeholderVideoName`)}
                required={isRequired}
              />
            </FormGroup>
            <Field
              component={TextInputField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelVideoAltText`)}
              name={fieldNames.altText}
              placeholder={t(`event.form.placeholderVideoAltText`)}
              required={isRequired}
            />
          </>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default Video;
