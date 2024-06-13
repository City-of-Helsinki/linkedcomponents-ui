import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type ImageInstructionsProps = {
  eventType: string;
};

const ImageInstructions: FC<ImageInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return (
    <>
      <p
        dangerouslySetInnerHTML={{
          __html: t(`event.form.infoTextImage1.${eventType}`, {
            openInNewTab: t('common.openInNewTab'),
          }),
        }}
      />
      <p>{t(`event.form.infoTextImage2`)}</p>
      <p>{t(`event.form.infoTextImage3`)}</p>
      <p>{t(`event.form.infoTextImage4`)}</p>
    </>
  );
};

export default ImageInstructions;
