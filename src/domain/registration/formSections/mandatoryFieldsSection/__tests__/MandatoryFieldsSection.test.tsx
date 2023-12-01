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
    <Formik initialValues={REGISTRATION_INITIAL_VALUES} onSubmit={vi.fn()}>
      <MandatoryFieldsSection isEditingAllowed={true} />
    </Formik>
  );

test('should show correct checkboxes', async () => {
  renderComponent();

  const withinBasicInfo = within(
    await screen.findByRole('group', { name: 'Ilmoittautujan perustiedot' })
  );
  withinBasicInfo.getByLabelText('Etunimi');
  withinBasicInfo.getByLabelText('Sukunimi');
  withinBasicInfo.getByLabelText('Kaupunki');
  withinBasicInfo.getByLabelText('Postinumero');
  withinBasicInfo.getByLabelText('Katuosoite');
});
