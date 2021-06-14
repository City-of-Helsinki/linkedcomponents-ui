import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { eventPathBuilder, getEventFields } from '../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../domain/events/constants';
import { eventsPathBuilder } from '../../../domain/events/utils';
import {
  EventFieldsFragment,
  useEventQuery,
  useEventsQuery,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

const getOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
  const { atId, name } = getEventFields(event, locale);
  return { label: name, value: atId };
};

type ValueType = string | null;

export type UmbrellaEventSelectorProps = {
  name: string;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const UmbrellaEventSelector: React.FC<UmbrellaEventSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const timer = React.useRef<number>();
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = React.useState('');

  const { data: eventsData, previousData: previousEventsData } = useEventsQuery(
    {
      variables: {
        createPath: getPathBuilder(eventsPathBuilder),
        sort: EVENT_SORT_OPTIONS.NAME,
        superEventType: ['umbrella'],
        text: search,
      },
    }
  );

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: parseIdFromAtId(value) as string,
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      /* istanbul ignore else */
      if (isMounted.current) {
        setSearch(inputValue);
      }
    });

    return items;
  };

  const options: OptionType[] = React.useMemo(
    () =>
      (eventsData || previousEventsData)?.events.data.map((event) =>
        getOption(event as EventFieldsFragment, locale)
      ) ?? [],
    [eventsData, locale, previousEventsData]
  );

  const selectedEvent = React.useMemo(
    () => (eventData?.event ? getOption(eventData.event, locale) : null),
    [eventData, locale]
  );

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Combobox
      {...rest}
      multiselect={false}
      filter={handleFilter}
      id={name}
      label={label}
      options={options}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedEvent as OptionType | undefined}
    />
  );
};

export default UmbrellaEventSelector;
