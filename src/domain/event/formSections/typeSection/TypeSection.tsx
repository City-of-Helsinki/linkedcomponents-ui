/* eslint-disable max-len */
import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import RadioButtonGroupField from '../../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/umbrellaEventSelectorField/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../common/components/notification/Notification';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import styles from '../../eventPage.module.scss';
import useEventTypeOptions from '../../hooks/useEventTypeOptions';
import { EventTime, RecurringEventSettings } from '../../types';
import {
  getEventFields,
  isRecurringEvent,
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import TypeInstructions from './typeInstructions/TypeInstructions';
import UmbrellaEventInstructions from './umbrellaEventInstructions/UmbrellaEventInstructions';

export interface TypeSectionProps {
  isEditingAllowed: boolean;
  isExternalUser: boolean;
  savedEvent?: EventFieldsFragment | null;
}

const TypeSection: React.FC<TypeSectionProps> = ({
  isEditingAllowed,
  isExternalUser,
  savedEvent,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const typeOptions = useEventTypeOptions();
  const { user } = useUser();

  const [{ value: type }] = useField<EVENT_TYPE>({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasUmbrella }] = useField({
    name: EVENT_FIELDS.HAS_UMBRELLA,
  });
  const [{ value: isUmbrella }] = useField({ name: EVENT_FIELDS.IS_UMBRELLA });
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

  const showIsUmbrellaTitle: boolean =
    hasUmbrella || isRecurringEvent(eventTimes, recurringEvents);

  const umbrellaEventTexts = React.useMemo(
    () => ({
      label: t('event.form.labelUmbrellaEvent'),
      assistive: t('event.form.helperUmbrellaEvent'),
    }),
    [t]
  );

  return (
    <Fieldset heading={t('event.form.sections.type')} hideLegend>
      <HeadingWithTooltip
        heading={t('event.form.titleEventType')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<TypeInstructions />}
        tooltipLabel={t('event.form.sections.type')}
      ></HeadingWithTooltip>

      <FieldRow
        notification={
          <>
            {showNotificationInstructions(user) && (
              <Notification
                className={styles.notificationForTitle}
                label={t('event.form.notificationTitleType')}
                type="info"
              >
                <TypeInstructions />
              </Notification>
            )}
          </>
        }
      >
        <FieldColumn>
          <Field
            columns={1}
            component={RadioButtonGroupField}
            disabled={!isEditingAllowed || isExternalUser}
            label={t('event.form.titleEventType')}
            name={EVENT_FIELDS.TYPE}
            options={typeOptions}
            required
          />
        </FieldColumn>
      </FieldRow>

      <HeadingWithTooltip
        heading={t('event.form.titleUmrellaEvent')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<UmbrellaEventInstructions savedEvent={savedEvent} />}
        tooltipLabel={t('event.form.notificationTitleUmrellaEvent')}
      ></HeadingWithTooltip>
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t('event.form.notificationTitleUmrellaEvent')}
              type="info"
            >
              <UmbrellaEventInstructions savedEvent={savedEvent} />
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              component={CheckboxField}
              disabled={
                !isEditingAllowed ||
                isExternalUser ||
                getDisabled(EVENT_FIELDS.IS_UMBRELLA)
              }
              label={t(`event.form.labelIsUmbrella.${type}`)}
              name={EVENT_FIELDS.IS_UMBRELLA}
              title={
                showIsUmbrellaTitle
                  ? t('event.form.tooltipEventIsUmbrella')
                  : ''
              }
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={CheckboxField}
              disabled={
                !isEditingAllowed ||
                isExternalUser ||
                getDisabled(EVENT_FIELDS.HAS_UMBRELLA)
              }
              label={t(`event.form.labelHasUmbrella.${type}`)}
              name={EVENT_FIELDS.HAS_UMBRELLA}
            />
          </FormGroup>
          {hasUmbrella && (
            <FormGroup>
              <Field
                component={UmbrellaEventSelectorField}
                disabled={!isEditingAllowed || isExternalUser}
                texts={umbrellaEventTexts}
                name={EVENT_FIELDS.SUPER_EVENT}
              />
            </FormGroup>
          )}
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default TypeSection;
