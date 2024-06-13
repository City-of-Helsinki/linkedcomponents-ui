import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type LocationInstructionsProps = {
  eventType: string;
};

const LocationInstructions: FC<LocationInstructionsProps> = ({ eventType }) => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t(`event.form.infoTextLocation1`)}</p>
      <p>{t(`event.form.infoTextLocation2.${eventType}`)}</p>
      <p>{t(`event.form.infoTextLocation3`)}</p>
      <p>{t(`event.form.infoTextLocation4`)}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t(`event.form.infoTextLocation5`, {
            openInNewTab: t('common.openInNewTab'),
          }),
        }}
      />
      <p>{t(`event.form.infoTextLocation6`)}</p>
    </>
  );
};

export default LocationInstructions;
