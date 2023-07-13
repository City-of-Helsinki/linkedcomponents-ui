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
import { CHARACTER_LIMITS } from '../../../../constants';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_ENVIRONMENT_VALUE, EVENT_FIELDS } from '../../constants';
import stylesEventPage from '../../eventPage.module.scss';
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
          <Notification
            className={stylesEventPage.notificationForTitle}
            label={t(`event.form.notificationTitleLocation`)}
            type="info"
          >
            <p>{t(`event.form.infoTextLocation1`)}</p>
            <p>{t(`event.form.infoTextLocation2.${type}`)}</p>
            <p>{t(`event.form.infoTextLocation3`)}</p>
            <p>{t(`event.form.infoTextLocation4`)}</p>
            <p
              dangerouslySetInnerHTML={{
                __html: t(`event.form.infoTextLocation5`, {
                  openInNewTab: t('common.openInNewTab'),
                }),
              }}
            />
            <p>{t(`event.form.infoTextLocation6`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              component={PlaceSelectorField}
              disabled={!isEditingAllowed}
              label={t('event.form.labelLocation')}
              name={EVENT_FIELDS.LOCATION}
              placeholder={t('event.form.placeholderLocation')}
              required={true}
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
              maxLength={CHARACTER_LIMITS.SHORT_STRING}
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
