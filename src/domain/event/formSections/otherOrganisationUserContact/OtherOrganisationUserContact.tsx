import { Field } from 'formik';
import React, { FC } from 'react';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import { EVENT_FIELDS } from '../../constants';

const OtherOrganisationUserContact: FC = () => {
  return (
    <Fieldset heading="Yhteystiedot" hideLegend>
      <FieldColumn>
        <FormGroup>
          <Field
            component={TextInputField}
            label="Nimi"
            name={EVENT_FIELDS.USER_NAME}
            placeholder="Nimi"
          ></Field>
        </FormGroup>
        <FormGroup>
          <Field
            component={TextInputField}
            label="Sähköposti"
            name={EVENT_FIELDS.EMAIL}
            placeholder="Sähköposti"
          ></Field>
        </FormGroup>
        <FormGroup>
          <Field
            component={TextInputField}
            label="Puhelinnumero"
            name={EVENT_FIELDS.PHONE_NUMBER}
            placeholder="Puhelinnumero"
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
          ></Field>
        </FormGroup>
        <FormGroup>
          <Field
            component={CheckboxField}
            label="Annan suostumukseni tietojeni käyttöön"
            name={EVENT_FIELDS.USER_CONSENT}
          ></Field>
        </FormGroup>
      </FieldColumn>
    </Fieldset>
  );
};

export default OtherOrganisationUserContact;
