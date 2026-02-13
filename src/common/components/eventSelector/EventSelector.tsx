import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
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
import useInitialSelectorOptions from '../../../hooks/useInitialSelectorOptions';
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

  const queryVariables = React.useMemo(
    () => ({
      ...variables,
      createPath: getPathBuilder(eventsPathBuilder),
      text: '',
    }),
    [variables]
  );

  const {
    data: eventsData,
    loading,
    refetch,
  } = useEventsQuery({
    variables: queryVariables,
  });

  const { data: eventData } = useEventQuery({
    skip: !value,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(parseIdFromAtId(value), ''),
    },
  });

  // Update initial options when variables or locale change
  const initialOptions = useInitialSelectorOptions(
    eventsData?.events.data as EventFieldsFragment[] | undefined,
    getOption,
    [queryVariables]
  );

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

  const selectedEvent = React.useMemo(() => {
    if (!eventData?.event) return [];
    return [getOption(eventData.event, locale)];
  }, [eventData?.event, getOption, locale]);

  const memoizedTexts = React.useMemo(
    () => ({
      ...texts,
      clearButtonAriaLabel_one: t('common.combobox.clearEvents'),
    }),
    [texts, t]
  );

  return (
    <Select
      {...rest}
      multiSelect={false}
      onSearch={handleSearch}
      onChange={onChange}
      id={name}
      isLoading={loading}
      texts={memoizedTexts}
      options={initialOptions}
      value={selectedEvent}
    />
  );
};

export default EventSelector;
