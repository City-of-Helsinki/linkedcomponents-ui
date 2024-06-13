import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type VideoInstructionsProps = {
  eventType: string;
};

const VideoInstructions: FC<VideoInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t(`event.form.infoTextVideo1.${eventType}`)}</p>
      <p>{t(`event.form.infoTextVideo2`)}</p>
    </>
  );
};

export default VideoInstructions;
