import { IconDrag, IconMenuDots } from 'hds-react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EVENT_LIST_TYPES } from '../constants';
import { ListTypeOption } from '../eventList/ListTypeSelector';

const useEventListTypeOptions = (): ListTypeOption[] => {
  const { t } = useTranslation();
  const typeOptions = React.useMemo(
    () => [
      {
        // TODO: Change icon when added to HDS
        icon: <IconMenuDots aria-hidden={true} />,
        label: t('eventsPage.listTypes.table'),
        value: EVENT_LIST_TYPES.TABLE,
      },
      {
        // TODO: Change icon when added to HDS
        icon: <IconDrag aria-hidden={true} />,
        label: t('eventsPage.listTypes.cardList'),
        value: EVENT_LIST_TYPES.CARD_LIST,
      },
    ],
    [t]
  );

  return typeOptions;
};

export default useEventListTypeOptions;
