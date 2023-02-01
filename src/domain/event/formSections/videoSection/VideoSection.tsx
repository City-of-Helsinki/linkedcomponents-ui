import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'react-uuid';

import Button from '../../../../common/components/button/Button';
import Fieldset from '../../../../common/components/fieldset/Fieldset';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';
import { VideoDetails } from '../../types';
import { getEmptyOffer } from '../../utils';
import Video from './video/Video';

const getVideoPath = (index: number) => `${EVENT_FIELDS.VIDEOS}[${index}]`;

interface Props {
  isEditingAllowed: boolean;
}

const VideoSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: videos }] = useField<VideoDetails[]>({
    name: EVENT_FIELDS.VIDEOS,
  });

  return (
    <Fieldset heading={t('event.form.sections.video')} hideLegend>
      <FieldArray
        name={EVENT_FIELDS.VIDEOS}
        render={(arrayHelpers) => (
          <div>
            {videos.map((_, index: number) => {
              return (
                <Video
                  key={uuid()}
                  canDelete={videos.length > 1}
                  isEditingAllowed={isEditingAllowed}
                  onDelete={() => arrayHelpers.remove(index)}
                  showInstructions={!index}
                  type={type}
                  videoPath={getVideoPath(index)}
                />
              );
            })}

            <FieldWithButton>
              <Button
                disabled={!isEditingAllowed}
                fullWidth={true}
                iconLeft={<IconPlus />}
                onClick={() => arrayHelpers.push(getEmptyOffer())}
                type="button"
                variant="primary"
              >
                {t('event.form.buttonAddVideo')}
              </Button>
            </FieldWithButton>
          </div>
        )}
      />
    </Fieldset>
  );
};

export default VideoSection;
