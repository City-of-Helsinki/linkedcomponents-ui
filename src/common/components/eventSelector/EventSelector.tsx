/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { eventPathBuilder } from '../../../domain/event/utils';
import { eventsPathBuilder } from '../../../domain/events/utils';
import {
  EventFieldsFragment,
  EventsQuery,
  EventsQueryVariables,
  useEventQuery,
  useEventsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';

export type EventSelectorProps = {
  getOption: (event: EventFieldsFragment, locale: Language) => OptionType;
  variables: EventsQueryVariables;
} & SingleComboboxProps<string | null>;

const EventSelector: React.FC<EventSelectorProps> = ({
  getOption,
  texts,
  name,
  value,
  variables,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const QUERY_VARIABLES = {
    ...variables,
    createPath: getPathBuilder(eventsPathBuilder),
  };

  const {
    data: eventsData,
    loading,
    refetch,
  } = useEventsQuery({
    variables: QUERY_VARIABLES,
  });

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(parseIdFromAtId(value), ''),
    },
  });

  const getEventsData = useCallback(
    (data: EventsQuery | undefined) =>
      getValue(
        data?.events.data.map((event) =>
          getOption(event as EventFieldsFragment, locale)
        ),
        []
      ),
    [getOption, locale]
  );

  const handleSearch: SearchFunction = async (
    searchValue: string
  ): Promise<SearchResult> => {
    try {
      const { data: searchEventsData, error } = await refetch({
        ...QUERY_VARIABLES,
        text: searchValue,
      });

      if (error) {
        throw error;
      }

      return { options: getEventsData(searchEventsData) };
    } catch (error) {
      return Promise.reject(error as ApolloError);
    }
  };

  const options = React.useMemo(
    () => getEventsData(eventsData),
    [eventsData, getEventsData]
  );

  const selectedEvent = React.useMemo(
    () => (eventData?.event ? getOption(eventData.event, locale) : null),
    [eventData?.event, getOption, locale]
  );

  return (
    <Combobox
      {...rest}
      onSearch={handleSearch}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearEvents'),
      }}
      options={options}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedEvent?.value}
    />
  );
};

export default EventSelector;
