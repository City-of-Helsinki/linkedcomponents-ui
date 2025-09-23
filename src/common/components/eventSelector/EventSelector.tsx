/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { Option, SearchFunction, SearchResult, SelectData } from 'hds-react';
import React, { useCallback, useEffect } from 'react';
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
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Select, { SelectPropsWithValue } from '../select/Select';

export type EventSelectorProps = {
  getOption: (event: EventFieldsFragment, locale: Language) => OptionType;
  variables: EventsQueryVariables;
} & SelectPropsWithValue<string | null>;

const EventSelector: React.FC<EventSelectorProps> = ({
  getOption,
  texts,
  name,
  value,
  variables,
  onChange,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const [options, setOptions] = React.useState<OptionType[]>([]);
  const initialOptions = React.useRef<OptionType[]>([]);

  const {
    data: eventsData,
    loading,
    previousData: previousEventsData,
    refetch,
  } = useEventsQuery({
    variables: {
      ...variables,
      createPath: getPathBuilder(eventsPathBuilder),
      text: '',
    },
  });

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(parseIdFromAtId(value), ''),
    },
  });

  const getEventsData = useCallback(
    () =>
      getValue(
        (eventsData || previousEventsData)?.events.data.map((event) =>
          getOption(event as EventFieldsFragment, locale)
        ),
        []
      ),
    [eventsData, getOption, locale, previousEventsData]
  );

  const eventsOptions = React.useMemo(() => getEventsData(), [getEventsData]);

  useEffect(() => {
    setOptions(eventsOptions);

    if (eventsData && !initialOptions?.current.length) {
      initialOptions.current = eventsOptions;
    }
  }, [eventsOptions, eventsData]);

  const handleSearch: SearchFunction = React.useCallback(
    async (searchValue: string): Promise<SearchResult> => {
      try {
        const { error, data: newEventsData } = await refetch({
          text: searchValue,
        });

        if (error) {
          throw error;
        }

        return {
          options: getValue(
            newEventsData?.events.data.map((event) =>
              getOption(event as EventFieldsFragment, locale)
            ),
            []
          ),
        };
      } catch (error) {
        return Promise.reject(error as ApolloError);
      }
    },
    [refetch, getOption, locale]
  );

  const handleChange = React.useCallback(
    (selectedOptions: Option[], clickedOption: Option, data: SelectData) => {
      setOptions(initialOptions.current);

      if (onChange) {
        onChange(selectedOptions, clickedOption, data);
      }
    },
    [onChange]
  );

  const selectedEvent = React.useMemo(
    () => (eventData?.event ? [getOption(eventData.event, locale)] : []),
    [eventData?.event, getOption, locale]
  );

  return (
    <Select
      {...rest}
      multiSelect={false}
      onSearch={handleSearch}
      onChange={handleChange}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearEvents'),
      }}
      options={options}
      value={selectedEvent}
    />
  );
};

export default EventSelector;
