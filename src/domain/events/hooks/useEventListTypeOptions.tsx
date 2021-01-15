import React from 'react';
import { useTranslation } from 'react-i18next';

import IconGallery from '../../../icons/IconGallery';
import IconList from '../../../icons/IconList';
import { EVENT_LIST_TYPES } from '../constants';
import { ListTypeOption } from '../eventList/ListTypeSelector';

const useEventListTypeOptions = (): ListTypeOption[] => {
  const { t } = useTranslation();
  const typeOptions = React.useMemo(
    () => [
      {
        icon: <IconList aria-hidden={true} />,
        label: t('eventsPage.listTypes.table'),
        value: EVENT_LIST_TYPES.TABLE,
      },
      {
        icon: <IconGallery aria-hidden={true} />,
        label: t('eventsPage.listTypes.cardList'),
        value: EVENT_LIST_TYPES.CARD_LIST,
      },
    ],
    [t]
  );

  return typeOptions;
};

export default useEventListTypeOptions;
