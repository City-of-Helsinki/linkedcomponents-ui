import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { EVENT_TYPE } from '../../../constants';

export type DescriptionInstructionsProps = {
  eventType: string;
};

const DescriptionInstructions: FC<DescriptionInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <p
        dangerouslySetInnerHTML={{
          __html: t(`event.form.infoTextDescription.${eventType}.paragraph1`),
        }}
      />
      <p>{t(`event.form.infoTextDescription.${eventType}.paragraph2`)}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t(`event.form.infoTextDescription.${eventType}.paragraph3`, {
            openInNewTab: t('common.openInNewTab'),
          }),
        }}
      />
      {eventType === EVENT_TYPE.General && (
        <>
          <p>{t(`event.form.infoTextDescription.${eventType}.paragraph4`)}</p>
          <p>{t(`event.form.infoTextDescription.${eventType}.paragraph5`)}</p>
          <ul style={{ paddingInlineStart: 'var(--spacing-s)' }}>
            {Object.values(
              t(`event.form.infoTextDescription.${eventType}.exclusions`, {
                returnObjects: true,
              })
            ).map((exlusion) => (
              <li key={exlusion}>{exlusion}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default DescriptionInstructions;
