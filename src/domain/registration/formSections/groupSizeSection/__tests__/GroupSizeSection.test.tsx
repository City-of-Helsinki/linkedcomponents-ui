import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { REGISTRATION_FIELDS } from '../../../constants';
import { registrationSchema } from '../../../validation';
import GroupSizeSection from '../GroupSizeSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: number | '';
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: '',
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={registrationSchema}
    >
      <GroupSizeSection isEditingAllowed={true} />
    </Formik>
  );

const getElement = (key: 'maxGroupSize') => {
  switch (key) {
    case 'maxGroupSize':
      return screen.getByRole('spinbutton', {
        name: 'Ryhmän enimmäiskoko',
      });
  }
};

test('should show validation error if max group size is less than 1', async () => {
  const user = userEvent.setup();
  renderComponent({
    [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: 0,
  });

  const maxGroupSizeInput = getElement('maxGroupSize');

  await user.click(maxGroupSizeInput);
  await user.tab();

  await screen.findByText('Arvon tulee olla vähintään 1');
});
