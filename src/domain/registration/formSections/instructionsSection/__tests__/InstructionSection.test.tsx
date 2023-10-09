/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik';
import React from 'react';
import { vi } from 'vitest';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../../../constants';
import { MultiLanguageObject } from '../../../../../types';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { REGISTRATION_FIELDS } from '../../../constants';
import InstructionsSection, {
  InstructionsSectionProps,
} from '../InstructionsSection';

configure({ defaultHidden: true });

const languages: LE_DATA_LANGUAGES[] = [
  LE_DATA_LANGUAGES.FI,
  LE_DATA_LANGUAGES.SV,
];

type InitialValues = {
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: MultiLanguageObject;
  [REGISTRATION_FIELDS.INFO_LANGUAGES]: LE_DATA_LANGUAGES[];
  [REGISTRATION_FIELDS.INSTRUCTIONS]: MultiLanguageObject;
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [REGISTRATION_FIELDS.INFO_LANGUAGES]: languages,
  [REGISTRATION_FIELDS.INSTRUCTIONS]: EMPTY_MULTI_LANGUAGE_OBJECT,
};

const defaultProps: InstructionsSectionProps = {
  isEditingAllowed: true,
};

const renderComponent = (initialValues?: Partial<InitialValues>) => {
  const { rerender, ...rest } = render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
    >
      <InstructionsSection {...defaultProps} />
    </Formik>
  );

  return {
    rerender: (newInitialValues?: Partial<InitialValues>) =>
      rerender(
        <Formik
          initialValues={{
            ...defaultInitialValues,
            ...initialValues,
            ...newInitialValues,
          }}
          onSubmit={vi.fn()}
          enableReinitialize={true}
        >
          <InstructionsSection {...defaultProps} />
        </Formik>
      ),
    ...rest,
  };
};

const findElement = (key: 'instructionsSv') => {
  switch (key) {
    case 'instructionsSv':
      return screen.findByLabelText(/ilmoittautumisohjeet ruotsiksi/i);
  }
};

const getElement = (
  key: 'confirmationMessageFi' | 'fiButton' | 'instructionsFi' | 'svButton'
) => {
  switch (key) {
    case 'confirmationMessageFi':
      return screen.getByLabelText(/vahvistusviesti suomeksi/i);
    case 'fiButton':
      return screen.getByRole('tab', { name: /suomi/i });
    case 'instructionsFi':
      return screen.getByLabelText(/ilmoittautumisohjeet suomeksi/i);
    case 'svButton':
      return screen.getByRole('tab', { name: /ruotsi/i });
  }
};

test('should change form section language', async () => {
  const user = userEvent.setup();
  renderComponent();

  const svButton = getElement('svButton');
  await user.click(svButton);
  await findElement('instructionsSv');
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from info languages', async () => {
  const { rerender } = await renderComponent();

  const fiButton = getElement('fiButton');
  const svButton = getElement('svButton');

  expect(fiButton.getAttribute('aria-selected')).toBe('true');
  expect(svButton.getAttribute('aria-selected')).toBe('false');

  rerender({
    [REGISTRATION_FIELDS.INFO_LANGUAGES]: [LE_DATA_LANGUAGES.SV],
  });

  await findElement('instructionsSv');
  expect(svButton.getAttribute('aria-selected')).toBe('true');
});
