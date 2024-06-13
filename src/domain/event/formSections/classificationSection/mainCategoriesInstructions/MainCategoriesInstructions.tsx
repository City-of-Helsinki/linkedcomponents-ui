import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type MainCategoriesInstructionsProps = {
  eventType: string;
};

const MainCategoriesInstructions: FC<MainCategoriesInstructionsProps> = ({
  eventType,
}) => {
  const { t } = useTranslation();

  return <p>{t(`event.form.infoTextMainCategories.${eventType}`)}</p>;
};

export default MainCategoriesInstructions;
