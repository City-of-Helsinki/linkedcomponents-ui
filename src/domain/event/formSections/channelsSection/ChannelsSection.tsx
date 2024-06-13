import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import MultiLanguageField from '../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../common/components/notification/Notification';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import ExternalLinks from './externalLinks/ExternalLinks';
import SocialMediaInstructions from './socialMediaInstructions/SocialMediaInstructions';

interface Props {
  isEditingAllowed: boolean;
}

const ChannelsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <Fieldset heading={t(`event.form.sections.channels.${type}`)} hideLegend>
      <h3>{t(`event.form.titleInfoUrl.${type}`)}</h3>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <MultiLanguageField
              disabled={!isEditingAllowed}
              languages={eventInfoLanguages}
              labelKey={`event.form.labelInfoUrl.${type}`}
              name={EVENT_FIELDS.INFO_URL}
              placeholderKey={`event.form.placeholderInfoUrl.${type}`}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>

      <HeadingWithTooltip
        heading={t(`event.form.titleSocialMedia.${type}`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<SocialMediaInstructions eventType={type} />}
        tooltipLabel={t(`event.form.titleSocialMedia.${type}`)}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.titleSocialMedia.${type}`)}
              type="info"
            >
              <SocialMediaInstructions eventType={type} />
            </Notification>
          ) : undefined
        }
      >
        <ExternalLinks isEditingAllowed={isEditingAllowed} />
      </FieldRow>
    </Fieldset>
  );
};

export default ChannelsSection;
