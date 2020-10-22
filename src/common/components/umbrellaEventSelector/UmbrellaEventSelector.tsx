import { SingleSelectProps } from 'hds-react/components/Select';
import sortBy from 'lodash/sortBy';
import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { eventPathBuilder } from '../../../domain/event/utils';
import { eventsPathBuilder } from '../../../domain/events/utils';
import {
  EventFieldsFragment,
  useEventQuery,
  useEventsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import Combobox from '../combobox/Combobox';

const getEventFields = (event: EventFieldsFragment, locale: Language) => ({
  name: getLocalisedString(event.name, locale),
  id: event.id,
});

const getOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
  const { name: label, id: value } = getEventFields(event, locale);
  return { label, value };
};

type ValueType = string | null;

export type UmbrellaEventSelectorProps = {
  name: string;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options'>;

const UmbrellaEventSelector: React.FC<UmbrellaEventSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<OptionType | null>(
    null
  );

  const { data: eventsData } = useEventsQuery({
    variables: {
      superEventType: ['umbrella'],
      text: search,
      createPath: eventsPathBuilder,
    },
  });

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      id: value,
      createPath: eventPathBuilder,
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    setTimeout(() => {
      setSearch(inputValue);
    }, 0);

    return items.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  React.useEffect(() => {
    if (eventsData?.events.data) {
      setOptions(
        sortBy(
          eventsData.events.data.map((event) =>
            getOption(event as EventFieldsFragment, locale)
          ),
          ['label']
        )
      );
    }
  }, [eventsData, locale]);

  const option = eventData?.event ? getOption(eventData.event, locale) : null;

  useDeepCompareEffect(() => {
    setSelectedEvent(option);
  }, [{ option }]);

  return (
    <Combobox
      {...rest}
      multiselect={false}
      filter={handleFilter}
      id={name}
      label={label}
      options={options}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedEvent as OptionType | undefined}
    />
  );
};

export default UmbrellaEventSelector;
