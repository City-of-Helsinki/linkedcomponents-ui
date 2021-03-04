import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import PublisherSelectorField from '../../../../common/components/formFields/PublisherSelectorField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { ROUTES } from '../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import useUser from '../../../user/hooks/useUser';
import useUserOrganizations from '../../../user/hooks/useUserOrganizations';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { getEventFields } from '../../utils';

export interface ResponsibilitiesSectionProps {
  savedEvent?: EventFieldsFragment;
}

const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({
  savedEvent,
}) => {
  const locale = useLocale();
  const { user } = useUser();
  const { organizations: userOrganizations } = useUserOrganizations(user);
  const { t } = useTranslation();
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: hasUmbrella }] = useField({
    name: EVENT_FIELDS.HAS_UMBRELLA,
  });
  const [{ value: isUmbrella }, , { setValue: setIsUmbrella }] = useField({
    name: EVENT_FIELDS.IS_UMBRELLA,
  });
  const [{ value: eventTimes }] = useField<string[]>({
    name: EVENT_FIELDS.EVENT_TIMES,
  });
  const [{ value: recurringEvents }] = useField<string[]>({
    name: EVENT_FIELDS.RECURRING_EVENTS,
  });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: publisher }, , { setValue: setPublisher }] = useField({
    name: EVENT_FIELDS.PUBLISHER,
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
    name:
      | EVENT_FIELDS.HAS_UMBRELLA
      | EVENT_FIELDS.IS_UMBRELLA
      | EVENT_FIELDS.PUBLISHER
  ): boolean => {
    const savedEventIsUmbrellaEvent =
      savedSuperEventType === SuperEventType.Umbrella;
    const savedEventIsRecurringEvent =
      savedSuperEventType === SuperEventType.Umbrella;
    const savedEventHasSubEvents = Boolean(savedEvent?.subEvents.length);
    const hasEventTimes = Boolean(eventTimes.length || recurringEvents.length);
    const savedPublisher = savedEvent?.publisher;

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
          (!savedEvent && hasEventTimes) ||
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
      case EVENT_FIELDS.PUBLISHER:
        return (
          !userOrganizations.length ||
          Boolean(savedPublisher) ||
          (publisher && userOrganizations.length === 1)
        );
    }
  };

  useDeepCompareEffect(() => {
    // Set is umbrella to false if event has more than one event time
    if ((eventTimes.length || recurringEvents.length) && isUmbrella) {
      setIsUmbrella(false);
    }
  }, [{ eventTimes, isUmbrella, recurringEvents }]);

  useDeepCompareEffect(() => {
    if (!savedEvent && user && publisher) {
      // Set default publisher after user logs in if publisher is not set
      setPublisher(user.organization ?? '');
    }
  }, [{ user }]);

  const disabledIsUmbrella: boolean =
    hasUmbrella || eventTimes.length || recurringEvents.length;

  return (
    <>
      <h3>{t('event.form.titlePersonsInCharge')}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t('event.form.notificationTitleProvider')}
            type="info"
          >
            <p>{t('event.form.infoTextProvider')}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <MultiLanguageField
            labelKey={`event.form.labelProvider.${type}`}
            languages={eventInfoLanguages}
            name={EVENT_FIELDS.PROVIDER}
            placeholder={t(`event.form.placeholderProvider.${type}`)}
          />
        </FieldColumn>
      </FieldRow>

      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t('event.form.notificationTitlePublisher')}
            type="info"
          >
            <p>{t('event.form.infoTextPublisher')}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            disabled={getDisabled(EVENT_FIELDS.PUBLISHER)}
            label={t(`event.form.labelPublisher.${type}`)}
            name={EVENT_FIELDS.PUBLISHER}
            component={PublisherSelectorField}
            publisher={savedEvent?.publisher}
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
            <p>{t('event.form.infoTextUmrellaEvent')}</p>
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
                disabledIsUmbrella && t('event.form.tooltipEventIsUmbrella')
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

export default ResponsibilitiesSection;
