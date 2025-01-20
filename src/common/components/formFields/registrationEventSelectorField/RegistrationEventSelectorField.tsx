import { FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import {
  getEventDateText,
  getSuperEventTypeText,
} from '../../../../domain/events/utils';
import {
  EventFieldsFragment,
  EventsQueryVariables,
  PublicationStatus,
} from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import skipFalsyType from '../../../../utils/skipFalsyType';
import EventSelector from '../../eventSelector/EventSelector';
import { SelectPropsWithValue } from '../../select/Select';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = {
  onChangeCb?: (val: string | null) => void;
  variables: EventsQueryVariables;
} & SelectPropsWithValue<string | null> &
  FieldProps<string>;

const RegistrationEventSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  texts,
  disabled,
  onChangeCb,
  variables,
  ...rest
}) => {
  const { t } = useTranslation();
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    name,
    onBlur,
    onChange,
    onChangeCb,
    value,
  });

  const getEventOption = (
    event: EventFieldsFragment,
    locale: Language
  ): OptionType => {
    const { endTime, atId, name, startTime } = getEventFields(event, locale);

    return {
      label: [
        name,
        getEventDateText(endTime, startTime),
        getSuperEventTypeText(event.superEventType, t),
      ]
        .filter(skipFalsyType)
        .join(' '),
      value: atId,
    };
  };

  return (
    <EventSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      variables={{
        publicationStatus: PublicationStatus.Public,
        registration: false,
        registrationAdminUser: true,
        start: 'now',
        sort: EVENT_SORT_OPTIONS.NAME,
        superEventType: ['none'],
        ...variables,
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

export default RegistrationEventSelectorField;
