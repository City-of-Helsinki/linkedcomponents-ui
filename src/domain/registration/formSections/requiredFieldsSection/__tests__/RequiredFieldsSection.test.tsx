import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  within,
} from '../../../../../utils/testUtils';
import { REGISTRATION_INITIAL_VALUES } from '../../../constants';
import RequiredFieldsSection from '../RequiredFieldsSection';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(
    <Formik initialValues={REGISTRATION_INITIAL_VALUES} onSubmit={jest.fn()}>
      <RequiredFieldsSection isEditingAllowed={true} />
    </Formik>
  );

test('should show correct checkboxes', async () => {
  renderComponent();

  const withinBasicInfo = within(
    screen.getByRole('group', { name: 'Ilmoittautujan perustiedot' })
  );
  withinBasicInfo.getByLabelText('Nimi');
  withinBasicInfo.getByLabelText('Kaupunki');
  withinBasicInfo.getByLabelText('Osoite');

  const withinContactInfo = within(
    screen.getByRole('group', { name: 'Yhteystiedot' })
  );
  withinContactInfo.getByLabelText('Puhelinnumero');
});
