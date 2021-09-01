import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import RadioButtonGroupField from '../../../../common/components/formFields/RadioButtonGroupField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { ROUTES } from '../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../constants';
import useEventTypeOptions from '../../hooks/useEventTypeOptions';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime, RecurringEventSettings } from '../../types';
import { getEventFields } from '../../utils';

export interface TypeSectionProps {
  savedEvent?: EventFieldsFragment;
}

const getAllEventTimes = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): EventTime[] => [
  ...eventTimes,
  ...recurringEvents.reduce(
    (previous: EventTime[], current) => [...previous, ...current.eventTimes],
    []
  ),
];

const isRecurringEvent = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): boolean => getAllEventTimes(eventTimes, recurringEvents).length > 1;

const TypeSection: React.FC<TypeSectionProps> = ({ savedEvent }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const typeOptions = useEventTypeOptions();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasUmbrella }] = useField({
    name: EVENT_FIELDS.HAS_UMBRELLA,
  });
  const [{ value: isUmbrella }, , { setValue: setIsUmbrella }] = useField({
    name: EVENT_FIELDS.IS_UMBRELLA,
  });
  const [{ value: eventTimes }] = useField<EventTime[]>({
    name: EVENT_FIELDS.EVENT_TIMES,
  });
  const [{ value: recurringEvents }] = useField<RecurringEventSettings[]>({
    name: EVENT_FIELDS.RECURRING_EVENTS,
  });

  const {
    superEventAtId: savedSuperEvent,
    superEventType: savedSuperEventType,
  } = savedEvent
    ? getEventFields(savedEvent, locale)
    : { superEventAtId: null, superEventType: null };
  const superEventSuperEventType = savedEvent?.superEvent?.superEventType;
  const superEventId = savedEvent?.superEvent?.id;

  const getDisabled = (
    name: EVENT_FIELDS.HAS_UMBRELLA | EVENT_FIELDS.IS_UMBRELLA
  ): boolean => {
    const savedEventIsUmbrellaEvent =
      savedSuperEventType === SuperEventType.Umbrella;
    const savedEventIsRecurringEvent =
      savedSuperEventType === SuperEventType.Recurring;
    const savedEventHasSubEvents = Boolean(savedEvent?.subEvents.length);

    switch (name) {
      /**
       * The 'isUmbrella' checkbox should be disabled when:
       *  - The 'hasUmbrella' checkbox is checked
       *  - When creating a new event and the form has more than one event date defined for it
       *  - The event being edited is an umbrella event with sub events
       *  - The event being edited is a super (recurring) event
       *  - The event being edited has super event
       * */
      case EVENT_FIELDS.IS_UMBRELLA:
        return (
          hasUmbrella ||
          (!savedEvent && isRecurringEvent(eventTimes, recurringEvents)) ||
          (savedEventIsUmbrellaEvent && savedEventHasSubEvents) ||
          savedEventIsRecurringEvent ||
          !!savedSuperEvent
        );
      /**
       * The 'hasHmbrella' checkbox should be disabled when:
       *  - The 'isUmbrella' checkbox is checked
       *  - The event being edited is an umbrella event
       *  - The event being edited is a sub event of a super (recurring) event
       */
      case EVENT_FIELDS.HAS_UMBRELLA:
        return (
          isUmbrella ||
          savedEventIsUmbrellaEvent ||
          superEventSuperEventType === SuperEventType.Recurring
        );
    }
  };

  const disabledIsUmbrella: boolean =
    hasUmbrella || isRecurringEvent(eventTimes, recurringEvents);

  React.useEffect(() => {
    // Set is umbrella to false if event has more than one event time
    if (isRecurringEvent(eventTimes, recurringEvents) && isUmbrella) {
      setIsUmbrella(false);
    }
  }, [eventTimes, isUmbrella, recurringEvents, setIsUmbrella]);

  return (
    <>
      <h3>{t('event.form.titleEventType')}</h3>
      <FieldRow
        notification={
          <Notification
            label={t('event.form.notificationTitleType')}
            type="info"
          >
            <p>{t('event.form.infoTextType1')}</p>
            <p>{t('event.form.infoTextType2')}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.TYPE}
            columns={1}
            component={RadioButtonGroupField}
            options={typeOptions}
          />
        </FieldColumn>
      </FieldRow>
      <h3>{t('event.form.titleUmrellaEvent')}</h3>
      <FieldRow
        notification={
          <Notification
            label={t('event.form.notificationTitleUmrellaEvent')}
            type="info"
          >
            <p>{t('event.form.infoTextUmrellaEvent1')}</p>
            <p>{t('event.form.infoTextUmrellaEvent2')}</p>
            {superEventId &&
              superEventSuperEventType === SuperEventType.Recurring && (
                <p>
                  {t('event.form.infoTextUmbrellaSubEvent')}{' '}
                  <Link
                    to={`/${locale}${ROUTES.EDIT_EVENT.replace(
                      ':id',
                      superEventId
                    )}`}
                  >
                    {t('event.form.infoTextUmbrellaSubEventLink')}.
                  </Link>
                </p>
              )}
          </Notification>
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              disabled={getDisabled(EVENT_FIELDS.IS_UMBRELLA)}
              label={t(`event.form.labelIsUmbrella.${type}`)}
              name={EVENT_FIELDS.IS_UMBRELLA}
              component={CheckboxField}
              title={
                disabledIsUmbrella ? t('event.form.tooltipEventIsUmbrella') : ''
              }
            />
          </FormGroup>
          <FormGroup>
            <Field
              disabled={getDisabled(EVENT_FIELDS.HAS_UMBRELLA)}
              label={t(`event.form.labelHasUmbrella.${type}`)}
              name={EVENT_FIELDS.HAS_UMBRELLA}
              component={CheckboxField}
            />
          </FormGroup>
          {hasUmbrella && (
            <FormGroup>
              <Field
                helper={t('event.form.helperUmbrellaEvent')}
                label={t('event.form.labelUmbrellaEvent')}
                name={EVENT_FIELDS.SUPER_EVENT}
                component={UmbrellaEventSelectorField}
              />
            </FormGroup>
          )}
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default TypeSection;
