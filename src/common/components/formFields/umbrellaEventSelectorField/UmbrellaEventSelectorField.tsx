import { FieldProps } from 'formik';
import { Option } from 'hds-react';
import React from 'react';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { EventFieldsFragment } from '../../../../generated/graphql';
import { Language } from '../../../../types';
import EventSelector, {
  EventSelectorProps,
} from '../../eventSelector/EventSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = EventSelectorProps & FieldProps<string>;

const getEventOption = (
  event: EventFieldsFragment,
  locale: Language
): Partial<Option> => {
  const { atId, name } = getEventFields(event, locale);
  return { label: name, value: atId };
};

const UmbrellaEventSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  texts,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    disabled,
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <EventSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      variables={{
        sort: EVENT_SORT_OPTIONS.NAME,
        superEventType: ['umbrella'],
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      texts={{ ...texts, error: errorText }}
      invalid={!!errorText}
      getOption={getEventOption}
    />
  );
};

export default UmbrellaEventSelectorField;
