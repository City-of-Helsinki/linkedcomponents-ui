import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';
import { VideoDetails } from '../../types';
import { getEmptyOffer } from '../../utils';
import Video from './Video';

const getVideoPath = (index: number) => `${EVENT_FIELDS.VIDEOS}[${index}]`;

const VideoSection: React.FC = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: videos }] = useField<VideoDetails[]>({
    name: EVENT_FIELDS.VIDEOS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.VIDEOS}
      render={(arrayHelpers) => (
        <div>
          {videos.map((_, index: number) => {
            return (
              <Video
                key={index}
                canDelete={videos.length > 1}
                onDelete={() => arrayHelpers.remove(index)}
                showInstructions={!index}
                type={type}
                videoPath={getVideoPath(index)}
              />
            );
          })}

          <FieldWithButton>
            <Button
              type="button"
              fullWidth={true}
              onClick={() => arrayHelpers.push(getEmptyOffer())}
              iconLeft={<IconPlus />}
              variant="primary"
            >
              {t('event.form.buttonAddVideo')}
            </Button>
          </FieldWithButton>
        </div>
      )}
    />
  );
};

export default VideoSection;
