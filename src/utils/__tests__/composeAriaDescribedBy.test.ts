import composeAriaDescribedBy from '../composeAriaDescribedBy';

test.each([
  [
    'input',
    'Helper text',
    'Error text',
    'Success text',
    'Info text',
    'input-helper input-error input-success input-info',
  ],
  [
    'input',
    '',
    'Error text',
    'Success text',
    'Info text',
    'input-error input-success input-info',
  ],
  [
    'input',
    'Helper text',
    '',
    'Success text',
    'Info text',
    'input-helper input-success input-info',
  ],
  [
    'input',
    'Helper text',
    'Error text',
    '',
    'Info text',
    'input-helper input-error input-info',
  ],
  [
    'input',
    'Helper text',
    'Error text',
    'Success text',
    '',
    'input-helper input-error input-success',
  ],
])(
  'should compose aria described by',
  (id, helperText, errorText, successText, infoText, expectedDescribedBy) => {
    expect(
      composeAriaDescribedBy(id, helperText, errorText, successText, infoText)
    ).toBe(expectedDescribedBy);
  }
);
