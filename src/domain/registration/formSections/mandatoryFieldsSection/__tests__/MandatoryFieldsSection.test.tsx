import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  within,
} from '../../../../../utils/testUtils';
import { REGISTRATION_INITIAL_VALUES } from '../../../constants';
import MandatoryFieldsSection from '../MandatoryFieldsSection';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(
    <Formik initialValues={REGISTRATION_INITIAL_VALUES} onSubmit={jest.fn()}>
      <MandatoryFieldsSection isEditingAllowed={true} />
    </Formik>
  );

test('should show correct checkboxes', async () => {
  renderComponent();

  const withinBasicInfo = within(
    await screen.findByRole('group', { name: 'Ilmoittautujan perustiedot' })
  );
  withinBasicInfo.getByLabelText('Nimi');
  withinBasicInfo.getByLabelText('Kaupunki');
  withinBasicInfo.getByLabelText('Postinumero');
  withinBasicInfo.getByLabelText('Katuosoite');

  const withinContactInfo = within(
    await screen.findByRole('group', { name: 'Yhteystiedot' })
  );
  withinContactInfo.getByLabelText('Puhelinnumero');
});
