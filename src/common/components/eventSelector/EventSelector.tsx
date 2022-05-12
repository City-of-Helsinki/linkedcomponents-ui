/* eslint-disable no-undef */
import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { eventPathBuilder } from '../../../domain/event/utils';
import { eventsPathBuilder } from '../../../domain/events/utils';
import {
  EventFieldsFragment,
  EventsQueryVariables,
  useEventQuery,
  useEventsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

type ValueType = string | null;

export type EventSelectorProps = {
  getOption: (event: EventFieldsFragment, locale: Language) => OptionType;
  name: string;
  value: ValueType;
  variables: EventsQueryVariables;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const EventSelector: React.FC<EventSelectorProps> = ({
  getOption,
  label,
  name,
  value,
  variables,
  ...rest
}) => {
  const timer = React.useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = useMountedState('');

  const { data: eventsData, previousData: previousEventsData } = useEventsQuery(
    {
      variables: {
        ...variables,
        createPath: getPathBuilder(eventsPathBuilder),
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
      setSearch(inputValue);
    });

    return items;
  };

  const options: OptionType[] = React.useMemo(
    () =>
      (eventsData || previousEventsData)?.events.data.map((event) =>
        getOption(event as EventFieldsFragment, locale)
      ) ?? [],
    [eventsData, getOption, locale, previousEventsData]
  );

  const selectedEvent = React.useMemo(
    () => (eventData?.event ? getOption(eventData.event, locale) : null),
    [eventData?.event, getOption, locale]
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

export default EventSelector;
