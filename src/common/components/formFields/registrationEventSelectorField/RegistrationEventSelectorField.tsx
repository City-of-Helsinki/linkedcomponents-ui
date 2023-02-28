import { FieldProps } from 'formik';
import React from 'react';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { getEventDateText } from '../../../../domain/events/utils';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import EventSelector, {
  EventSelectorProps,
} from '../../eventSelector/EventSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = EventSelectorProps & FieldProps<string>;

const getEventOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
  const { endTime, id, name, startTime } = getEventFields(event, locale);
  return {
    label: `${name} ${getEventDateText(endTime, startTime)}`,
    value: id,
  };
};

const RegistrationEventSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useComboboxFieldProps({
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <EventSelector
      {...rest}
      {...field}
      name={name}
      variables={{
        adminUser: true,
        publicationStatus: PublicationStatus.Public,
        start: 'now',
        sort: EVENT_SORT_OPTIONS.NAME,
        superEventType: ['none'],
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      helper={helper}
      error={errorText}
      invalid={!!errorText}
      getOption={getEventOption}
    />
  );
};

export default RegistrationEventSelectorField;
