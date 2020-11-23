import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import React from 'react';

import { OptionType } from '../../../../types';
import { render, screen } from '../../../../utils/testUtils';
import FormLanguageSelector from '../FormLanguageSelector';

const options: OptionType[] = [
  {
    label: 'Suomi',
    value: 'fi',
  },
  {
    label: 'Ruotsi',
    value: 'sc',
  },
];

const defaultProps = { fields: [], options };

it('should call onChange', () => {
  const onChange = jest.fn();
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormLanguageSelector
        {...defaultProps}
        onChange={onChange}
        selectedLanguage="fi"
      />
    </Formik>
  );

  const svButton = screen.getByRole('link', { name: options[1].label });

  userEvent.click(svButton);
  expect(onChange).toBeCalledWith(options[1].value);
});
