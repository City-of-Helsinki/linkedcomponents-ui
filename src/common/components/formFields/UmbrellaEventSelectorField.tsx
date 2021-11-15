import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getEventFields } from '../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../domain/events/constants';
import { EventFieldsFragment } from '../../../generated/graphql';
import { Language, OptionType } from '../../../types';
import { getErrorText } from '../../../utils/validationUtils';
import EventSelector, {
  EventSelectorProps,
} from '../eventSelector/EventSelector';

type Props = EventSelectorProps & FieldProps;

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
  helper,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    onChange({ target: { id: name, value: selected?.value || null } });
  };

  return (
    <EventSelector
      {...rest}
      {...field}
      name={name}
      variables={{
        sort: EVENT_SORT_OPTIONS.NAME,
        superEventType: ['umbrella'],
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

export default UmbrellaEventSelectorField;
