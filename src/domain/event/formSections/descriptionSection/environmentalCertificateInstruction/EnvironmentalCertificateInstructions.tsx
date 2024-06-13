import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const EnvironmentalCertificateInstructions: FC = () => {
  const { t } = useTranslation();

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: t('event.form.infoTextEnvironmentalCertificate'),
      }}
    />
  );
};

export default EnvironmentalCertificateInstructions;
