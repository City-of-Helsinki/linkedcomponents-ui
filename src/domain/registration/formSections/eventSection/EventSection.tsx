/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Field, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import RegistrationEventSelectorField from '../../../../common/components/formFields/registrationEventSelectorField/RegistrationEventSelectorField';
import { EventDocument, EventQuery } from '../../../../generated/graphql';
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

interface Props {
  isEditingAllowed: boolean;
}

const EventSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

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

  return (
    <Fieldset heading={t('registration.form.sections.event')} hideLegend>
      <FieldRow>
        <FieldColumn>
          <Field
            component={RegistrationEventSelectorField}
            disabled={!isEditingAllowed}
            label={t(`registration.form.labelEvent`)}
            name={REGISTRATION_FIELDS.EVENT}
            onChangeCb={onChangeEventCallback}
            placeholder={t(`registration.form.placeholderEvent`)}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default EventSection;
