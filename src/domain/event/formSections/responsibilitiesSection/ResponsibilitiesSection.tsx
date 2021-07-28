import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import PublisherSelectorField from '../../../../common/components/formFields/PublisherSelectorField';
import Notification from '../../../../common/components/notification/Notification';
import { EventFieldsFragment } from '../../../../generated/graphql';
import useUser from '../../../user/hooks/useUser';
import useUserOrganizations from '../../../user/hooks/useUserOrganizations';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

export interface ResponsibilitiesSectionProps {
  savedEvent?: EventFieldsFragment;
}

const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({
  savedEvent,
}) => {
  const { user } = useUser();
  const { organizations: userOrganizations } = useUserOrganizations(user);
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: publisher }, , { setValue: setPublisher }] = useField({
    name: EVENT_FIELDS.PUBLISHER,
  });

  const getDisabled = (name: EVENT_FIELDS.PUBLISHER): boolean => {
    const savedPublisher = savedEvent?.publisher;

    switch (name) {
      case EVENT_FIELDS.PUBLISHER:
        return (
          !userOrganizations.length ||
          Boolean(savedPublisher) ||
          (publisher && userOrganizations.length === 1)
        );
    }
  };

  React.useEffect(() => {
    if (!savedEvent && user && publisher) {
      // Set default publisher after user logs in if publisher is not set
      /* istanbul ignore next */
      setPublisher(user.organization ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.notificationTitlePublisher.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextPublisher.${type}`)}</p>
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

      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.notificationTitleProvider.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextProvider.${type}`)}</p>
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
    </>
  );
};

export default ResponsibilitiesSection;
