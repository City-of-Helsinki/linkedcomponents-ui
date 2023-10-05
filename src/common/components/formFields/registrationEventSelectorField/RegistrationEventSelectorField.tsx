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
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = {
  onChangeCb?: (val: string | null) => void;
} & EventSelectorProps &
  FieldProps<string>;

const getEventOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
  const { endTime, atId, name, startTime } = getEventFields(event, locale);
  return {
    label: `${name} ${getEventDateText(endTime, startTime)}`,
    value: atId,
  };
};

const RegistrationEventSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  disabled,
  onChangeCb,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    disabled,
    name,
    onBlur,
    onChange,
    onChangeCb,
    value,
  });

  return (
    <EventSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      variables={{
        adminUser: true,
        publicationStatus: PublicationStatus.Public,
        registration: false,
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
