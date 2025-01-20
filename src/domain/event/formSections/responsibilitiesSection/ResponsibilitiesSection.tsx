/* eslint-disable max-len */
import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import MultiLanguageField from '../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import PublisherSelectorField from '../../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import Notification from '../../../../common/components/notification/Notification';
import { EventFieldsFragment } from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../user/hooks/useUser';
import useUserOrganizations from '../../../user/hooks/useUserOrganizations';
import { EVENT_FIELDS } from '../../constants';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';

export interface ResponsibilitiesSectionProps {
  isEditingAllowed: boolean;
  isExternalUser: boolean;
  savedEvent?: EventFieldsFragment | null;
}

const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({
  isEditingAllowed,
  isExternalUser,
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

  const isPublisherDisabled = (): boolean => {
    const savedPublisher = savedEvent?.publisher;

    return (
      !userOrganizations.length ||
      Boolean(savedPublisher) ||
      (publisher && userOrganizations.length === 1)
    );
  };

  React.useEffect(() => {
    if (!savedEvent && user && publisher) {
      // Set default publisher after user logs in if publisher is not set
      /* istanbul ignore next */
      setPublisher(getValue(user.organization, ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Fieldset heading={t('event.form.sections.responsibilities')} hideLegend>
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              label={t(`event.form.notificationTitlePublisher.${type}`)}
              type="info"
            >
              <p>{t(`event.form.infoTextPublisher.${type}`)}</p>
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <Field
            component={PublisherSelectorField}
            disabled={
              !isEditingAllowed || isExternalUser || isPublisherDisabled()
            }
            name={EVENT_FIELDS.PUBLISHER}
            texts={{
              label: t(`event.form.labelPublisher.${type}`),
            }}
            publisher={savedEvent?.publisher}
            {...(showTooltipInstructions(user)
              ? {
                  tooltipButtonLabel: t('common.showInstructions'),
                  tooltipLabel: t(`event.form.labelPublisher.${type}`),
                  tooltipText: t(`event.form.infoTextPublisher.${type}`),
                }
              : {})}
          />
        </FieldColumn>
      </FieldRow>

      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              label={t(`event.form.notificationTitleProvider.${type}`)}
              type="info"
            >
              <p>{t(`event.form.infoTextProvider.${type}`)}</p>
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <MultiLanguageField
            disabled={!isEditingAllowed}
            labelKey={
              isExternalUser
                ? 'event.form.labelProvider.other'
                : `event.form.labelProvider.${type}`
            }
            languages={eventInfoLanguages}
            name={EVENT_FIELDS.PROVIDER}
            placeholder={getValue(
              t(`event.form.placeholderProvider.${type}`),
              undefined
            )}
            required={isExternalUser}
            {...(showTooltipInstructions(user)
              ? {
                  tooltipButtonLabel: t('common.showInstructions'),
                  tooltipLabel: t(
                    `event.form.notificationTitleProvider.${type}`
                  ),
                  tooltipText: t(`event.form.infoTextProvider.${type}`),
                }
              : {})}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default ResponsibilitiesSection;
