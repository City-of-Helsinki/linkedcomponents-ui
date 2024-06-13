import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const TypeInstructions: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <p>{t('event.form.infoTextType1')}</p>
      <p>{t('event.form.infoTextType2')}</p>
    </>
  );
};

export default TypeInstructions;
