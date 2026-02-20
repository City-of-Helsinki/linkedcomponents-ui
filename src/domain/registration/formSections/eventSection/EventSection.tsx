/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Field, useFormikContext } from 'formik';
import { IconCalendar } from 'hds-react';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from '../../../../common/components/checkbox/Checkbox';
import DateSelectorDropdown, {
  DATE_FIELDS,
} from '../../../../common/components/dateSelectorDropdown/DateSelectorDropdown';
import Fieldset from '../../../../common/components/fieldset/Fieldset';
import RegistrationEventSelectorField from '../../../../common/components/formFields/registrationEventSelectorField/RegistrationEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { DATE_FORMAT_API } from '../../../../constants';
import { EventDocument, EventQuery } from '../../../../generated/graphql';
import useSearchState from '../../../../hooks/useSearchState';
import formatDate from '../../../../utils/formatDate';
import getPathBuilder from '../../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_INCLUDES } from '../../../event/constants';
import {
  eventPathBuilder,
  getEventInfoToRegistrationForm,
} from '../../../event/utils';
import {
  DEFAULT_COMMON_REGISTRATION_AND_EVENT_FIELD_VALUES,
  REGISTRATION_FIELDS,
} from '../../constants';
import { RegistrationFormFields } from '../../types';
import styles from './eventSection.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

type SearchState = {
  end: Date | null;
  recurringEvent: boolean;
  start: Date | null;
};

const EventSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    end: null,
    recurringEvent: false,
    start: null,
  });

  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { setValues, values } = useFormikContext<RegistrationFormFields>();

  const clearRegistrationFormValues = () => {
    setValues({
      ...values,
      ...DEFAULT_COMMON_REGISTRATION_AND_EVENT_FIELD_VALUES,
      event: '',
    });
  };

  const setRegistrationFormValues = async (eventAtId: string) => {
    const { data: eventData } = await apolloClient.query<EventQuery>({
      query: EventDocument,
      variables: {
        id: parseIdFromAtId(eventAtId),
        include: EVENT_INCLUDES,
        createPath: getPathBuilder(eventPathBuilder),
      },
    });

    /* istanbul ignore else */
    if (eventData.event) {
      setValues({
        ...values,
        ...getEventInfoToRegistrationForm(eventData.event),
        event: eventAtId,
      });
    }
  };

  const onChangeEventCallback = (eventAtId: string | null) => {
    if (eventAtId) {
      setRegistrationFormValues(eventAtId);
    } else {
      clearRegistrationFormValues();
    }
  };

  const handleChangeDate = (field: DATE_FIELDS, value: Date | null) => {
    switch (field) {
      case DATE_FIELDS.END_DATE:
        setSearchState({ end: value });
        break;
      case DATE_FIELDS.START_DATE:
        setSearchState({ start: value });
        break;
    }
  };

  const handleChangeRecurringEvent: React.ChangeEventHandler<
    HTMLInputElement
  > = (ev) => {
    setSearchState({ recurringEvent: ev.target.checked });
  };

  const eventSelectorVariables = React.useMemo(
    () =>
      omitBy(
        {
          start: searchState.start
            ? formatDate(searchState.start, DATE_FORMAT_API)
            : undefined,
          end: searchState.end
            ? formatDate(searchState.end, DATE_FORMAT_API)
            : undefined,
          superEventType: searchState.recurringEvent
            ? ['recurring']
            : undefined,
        },
        isUndefined
      ),
    [searchState.start, searchState.end, searchState.recurringEvent]
  );

  const eventSelectorTexts = React.useMemo(
    () => ({
      label: t(`registration.form.labelEvent`),
      placeholder: t(`registration.form.placeholderEvent`),
    }),
    [t]
  );

  return (
    <Fieldset heading={t('registration.form.sections.event')} hideLegend>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Checkbox
              id="recurring"
              label={t(`registration.form.labelFilterRecurringEvent`)}
              checked={searchState.recurringEvent}
              onChange={handleChangeRecurringEvent}
            />
          </FormGroup>
          <FormGroup>
            <DateSelectorDropdown
              className={styles.dateSelector}
              icon={<IconCalendar aria-hidden={true} />}
              label={t(`registration.form.labelFilterByDates`)}
              onChangeDate={handleChangeDate}
              value={{
                endDate: searchState.end,
                startDate: searchState.start,
              }}
            />
          </FormGroup>
          <Field
            component={RegistrationEventSelectorField}
            disabled={!isEditingAllowed}
            clearable
            name={REGISTRATION_FIELDS.EVENT}
            onChangeCb={onChangeEventCallback}
            texts={eventSelectorTexts}
            variables={eventSelectorVariables}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default EventSection;
