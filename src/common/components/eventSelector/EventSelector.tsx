/* eslint-disable no-undef */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { COMBOBOX_DEBOUNCE_TIME_MS } from '../../../constants';
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
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';
import ComboboxLoadingSpinner from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';

export type EventSelectorProps = {
  getOption: (event: EventFieldsFragment, locale: Language) => OptionType;
  variables: EventsQueryVariables;
} & SingleComboboxProps<string | null>;

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
  const [debouncedSearch] = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const {
    data: eventsData,
    loading,
    previousData: previousEventsData,
  } = useEventsQuery({
    variables: {
      ...variables,
      createPath: getPathBuilder(eventsPathBuilder),
      text: debouncedSearch,
    },
  });

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(parseIdFromAtId(value), ''),
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
      getValue(
        (eventsData || previousEventsData)?.events.data.map((event) =>
          getOption(event as EventFieldsFragment, locale)
        ),
        []
      ),
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
    <ComboboxLoadingSpinner isLoading={loading}>
      <Combobox
        {...rest}
        multiselect={false}
        filter={handleFilter}
        id={name}
        label={label}
        options={options}
        toggleButtonAriaLabel={getValue(
          t('common.combobox.toggleButtonAriaLabel'),
          ''
        )}
        // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
        // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
        value={selectedEvent as OptionType | undefined}
      />
    </ComboboxLoadingSpinner>
  );
};

export default EventSelector;
