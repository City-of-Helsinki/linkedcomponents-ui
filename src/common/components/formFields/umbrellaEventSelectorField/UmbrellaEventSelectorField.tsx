import { FieldProps } from 'formik';
import React from 'react';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { EventFieldsFragment } from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import { SingleComboboxProps } from '../../combobox/Combobox';
import EventSelector from '../../eventSelector/EventSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleComboboxProps<string | null> & FieldProps<string>;

const getEventOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
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
