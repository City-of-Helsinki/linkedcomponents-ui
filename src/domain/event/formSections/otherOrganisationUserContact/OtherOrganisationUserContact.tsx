import { Field, useField } from 'formik';
import React, { FC, useEffect, useState } from 'react';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';

const OtherOrganisationUserContact: FC = () => {
  const [{ value: email }] = useField({ name: EVENT_FIELDS.EMAIL });
  const [{ value: phoneNumber }] = useField({
    name: EVENT_FIELDS.PHONE_NUMBER,
  });

  const [emailRequired, setEmailRequired] = useState(!!email === false);
  const [phoneRequired, setPhoneRequired] = useState(!!phoneNumber === false);

  useEffect(() => {
    if (phoneNumber) {
      setEmailRequired(false);
    } else {
      setEmailRequired(true);
    }
    if (email) {
      setPhoneRequired(false);
    } else {
      setPhoneRequired(true);
    }
  }, [phoneNumber, email]);

  return (
    <Fieldset heading="Yhteystiedot" hideLegend>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              component={TextInputField}
              label="Nimi"
              name={EVENT_FIELDS.USER_NAME}
              placeholder="Nimi"
              required
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label="Sähköposti"
              name={EVENT_FIELDS.EMAIL}
              placeholder="Sähköposti"
              required={emailRequired}
              disabled={!emailRequired}
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label="Puhelinnumero"
              name={EVENT_FIELDS.PHONE_NUMBER}
              placeholder="Puhelinnumero"
              required={phoneRequired}
              disabled={!phoneRequired}
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label="Organisaatio"
              name={EVENT_FIELDS.ORGANISATION}
              placeholder="Organisaatio"
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label="Matkailun rekisteriseloste (linkki)"
              name={EVENT_FIELDS.REGISTRATION_LINK}
              placeholder="Matkailun rekisteriseloste (linkki)"
              required
            ></Field>
          </FormGroup>
          <FormGroup>
            <Field
              component={CheckboxField}
              label="Annan suostumukseni tietojeni käyttöön"
              name={EVENT_FIELDS.USER_CONSENT}
              required
            ></Field>
          </FormGroup>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default OtherOrganisationUserContact;
