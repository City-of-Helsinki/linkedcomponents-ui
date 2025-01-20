import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import MultiLanguageField from '../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import PlaceSelectorField from '../../../../common/components/formFields/placeSelectorField/PlaceSelectorField';
// eslint-disable-next-line max-len
import RadioButtonGroupField from '../../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../user/hooks/useUser';
import { EVENT_ENVIRONMENT_VALUE, EVENT_FIELDS } from '../../constants';
import stylesEventPage from '../../eventPage.module.scss';
import { showNotificationInstructions } from '../../utils';
import LocationInstructions from './locationInstructions/LocationInstructions';
import styles from './placeSection.module.scss';

interface Props {
  isEditingAllowed: boolean;
  isExternalUser: boolean;
}

const PlaceSection: React.FC<Props> = ({
  isEditingAllowed,
  isExternalUser,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: location }] = useField({ name: EVENT_FIELDS.LOCATION });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  const eventPlaceOptions = Object.values(EVENT_ENVIRONMENT_VALUE).map(
    (value) => ({
      label: t(`event.form.placeOptions.${value}`),
      value,
    })
  );

  return (
    <Fieldset heading={t('event.form.sections.place')} hideLegend>
      <h3>{t(`event.form.titleLocation`)}</h3>
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={stylesEventPage.notificationForTitle}
              label={t(`event.form.notificationTitleLocation`)}
              type="info"
            >
              <LocationInstructions eventType={type} />
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              component={PlaceSelectorField}
              disabled={!isEditingAllowed}
              name={EVENT_FIELDS.LOCATION}
              texts={{
                label: t('event.form.labelLocation'),
                placeholder: t('event.form.placeholderLocation'),
              }}
              required
            />
            <div className={styles.locationId}>
              {t('event.form.labelLocationId')} {parseIdFromAtId(location)}
            </div>
          </FormGroup>

          <h3>{t(`event.form.titleLocationExtraInfo`)}</h3>
          <FormGroup>
            <MultiLanguageField
              disabled={!isEditingAllowed}
              labelKey={`event.form.labelLocationExtraInfo`}
              languages={eventInfoLanguages}
              name={EVENT_FIELDS.LOCATION_EXTRA_INFO}
              placeholderKey={`event.form.placeholderLocationExtraInfo`}
            />
          </FormGroup>
        </FieldColumn>
        {isExternalUser && (
          <Fieldset heading={t('event.form.labelEnvironment')}>
            <FieldColumn>
              <FormGroup>
                <Field
                  columns={1}
                  component={RadioButtonGroupField}
                  name={EVENT_FIELDS.ENVIRONMENT}
                  disabled={!isEditingAllowed}
                  options={eventPlaceOptions}
                  required
                ></Field>
              </FormGroup>
            </FieldColumn>
          </Fieldset>
        )}
      </FieldRow>
    </Fieldset>
  );
};

export default PlaceSection;
