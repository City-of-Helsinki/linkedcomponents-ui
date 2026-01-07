import { ArrayHelpers, FieldArray, useField } from 'formik';
import { ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
        render={(arrayHelpers: ArrayHelpers) => (
          <div>
            {videos.map((_, index) => {
              return (
                <Video
                  key={`video-${index}`}
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
                iconStart={<IconPlus />}
                onClick={() => arrayHelpers.push(getEmptyOffer())}
                type="button"
                variant={ButtonVariant.Primary}
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
