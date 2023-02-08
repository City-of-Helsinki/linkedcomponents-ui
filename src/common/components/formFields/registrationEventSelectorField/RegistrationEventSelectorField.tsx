import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { getEventDateText } from '../../../../domain/events/utils';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';
import EventSelector, {
  EventSelectorProps,
} from '../../eventSelector/EventSelector';

type Props = EventSelectorProps & FieldProps;

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
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    onChange({ target: { id: name, value: getValue(selected?.value, null) } });
  };

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
