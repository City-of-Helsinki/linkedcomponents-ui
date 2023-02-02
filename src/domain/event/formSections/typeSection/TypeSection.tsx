/* eslint-disable max-len */
import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import RadioButtonGroupField from '../../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/umbrellaEventSelectorField/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { ROUTES } from '../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import {
  EVENT_FIELDS,
  EVENT_TYPE,
  PUBLICATION_LIST_LINKS,
} from '../../constants';
import styles from '../../eventPage.module.scss';
import useEventTypeOptions from '../../hooks/useEventTypeOptions';
import { EventTime, RecurringEventSettings } from '../../types';
import { getEventFields, isRecurringEvent } from '../../utils';
import PublicationListLinks from './publicationListLinks/PublicationListLinks';

export interface TypeSectionProps {
  isEditingAllowed: boolean;
  savedEvent?: EventFieldsFragment | null;
}

const TypeSection: React.FC<TypeSectionProps> = ({
  isEditingAllowed,
  savedEvent,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const typeOptions = useEventTypeOptions();

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

  const showIsUmbrellaTitle: boolean =
    hasUmbrella || isRecurringEvent(eventTimes, recurringEvents);

  return (
    <Fieldset heading={t('event.form.sections.type')} hideLegend>
      <h3>{t('event.form.titleEventType')}</h3>
      <FieldRow
        notification={
          <>
            <Notification
              className={styles.notificationForTitle}
              label={t('event.form.notificationTitleType')}
              type="info"
            >
              <p>{t('event.form.infoTextType1')}</p>
              <p>{t('event.form.infoTextType2')}</p>
            </Notification>
            <Notification
              className={styles.secondNotification}
              label={t('event.form.notificationTitlePublication')}
              type="info"
            >
              <p>{t('event.form.infoTextPublication')}</p>
              <PublicationListLinks links={PUBLICATION_LIST_LINKS[type]} />
            </Notification>
          </>
        }
      >
        <FieldColumn>
          <Field
            columns={1}
            component={RadioButtonGroupField}
            disabled={!isEditingAllowed}
            label={t('event.form.titleEventType')}
            name={EVENT_FIELDS.TYPE}
            options={typeOptions}
            required
          />
        </FieldColumn>
      </FieldRow>

      <h3>{t('event.form.titleUmrellaEvent')}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notificationForTitle}
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
              component={CheckboxField}
              disabled={
                !isEditingAllowed || getDisabled(EVENT_FIELDS.IS_UMBRELLA)
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
                !isEditingAllowed || getDisabled(EVENT_FIELDS.HAS_UMBRELLA)
              }
              label={t(`event.form.labelHasUmbrella.${type}`)}
              name={EVENT_FIELDS.HAS_UMBRELLA}
            />
          </FormGroup>
          {hasUmbrella && (
            <FormGroup>
              <Field
                component={UmbrellaEventSelectorField}
                disabled={!isEditingAllowed}
                helper={t('event.form.helperUmbrellaEvent')}
                label={t('event.form.labelUmbrellaEvent')}
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
