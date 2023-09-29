import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { testIds } from '../../../../constants';
import getValue from '../../../../utils/getValue';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  fireEvent,
  mockFile,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import {
  images,
  mockedImagesResponse,
  publisher,
} from '../../../event/formSections/imageSection/__mocks__/imageSection';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { ADD_IMAGE_INITIAL_VALUES } from '../../constants';
import AddImageForm, { AddImageFormProps } from '../AddImageForm';

configure({ defaultHidden: true });

const defaultMocks = [
  mockedImagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultProps: AddImageFormProps = {
  onAddImageByFile: vi.fn(),
  onCancel: vi.fn(),
  onSubmit: vi.fn(),
  publisher,
};

const renderComponent = ({
  mocks = defaultMocks,
  props,
}: {
  mocks?: MockedResponse[];
  props?: Partial<AddImageFormProps>;
}) =>
  render(<AddImageForm {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
  });

const findElement = (key: 'imageCheckbox') => {
  switch (key) {
    case 'imageCheckbox':
      return screen.findByLabelText(getValue(images.data[0]?.name, ''));
  }
};

const getElement = (key: 'addButton' | 'cancelButton' | 'urlInput') => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: 'Lisää' });
    case 'cancelButton':
      return screen.getByRole('button', { name: /peruuta/i });
    case 'urlInput':
      return screen.getByLabelText(/kuvan url-osoite/i);
  }
};

test('should call onCancel', async () => {
  const onCancel = vi.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onCancel } });

  await findElement('imageCheckbox');

  const cancelButton = getElement('cancelButton');
  await user.click(cancelButton);
  await waitFor(() => expect(onCancel).toBeCalled());
});

test('should call onSubmit with existing image', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  await waitFor(() => expect(urlInput).toBeEnabled());

  await user.click(imageCheckbox);
  expect(urlInput).toBeDisabled();
  await waitFor(() => expect(addButton).toBeEnabled());

  await user.click(addButton);
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      selectedImage: [images.data[0]?.atId],
    })
  );
});

test('should call onSubmit by double clicking image', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');

  await waitFor(() => expect(urlInput).toBeEnabled());

  await user.dblClick(imageCheckbox);
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      selectedImage: [images.data[0]?.atId],
    })
  );
});

test('should show error message if trying to enter too large image file', async () => {
  const user = userEvent.setup();

  renderComponent({});

  const addButton = getElement('addButton');
  await waitFor(() => expect(addButton).toBeDisabled());

  const fileInput = screen.getByTestId(testIds.imageUploader.input);
  const file = mockFile({ size: 3000000 });

  Object.defineProperty(fileInput, 'files', { value: [file] });
  fireEvent.change(fileInput);

  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);

  await screen.findByRole('alert', {
    name: 'Tiedostokoko on liian suuri. Tiedoston maksimikoko on 2 Mt',
  });
});

test('should validate url', async () => {
  const user = userEvent.setup();
  renderComponent({});

  const invalidUrlText = 'invalid url';
  await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  await waitFor(() => expect(urlInput).toBeEnabled());
  await user.click(urlInput);
  await user.type(urlInput, invalidUrlText);

  await user.tab();

  await screen.findByText(translations.form.validation.string.url);
  expect(addButton).toBeDisabled();
});

test('should call onSubmit with image url', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const url = 'http://test.com';
  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  expect(addButton).toBeDisabled();
  await waitFor(() => expect(urlInput).toBeEnabled());

  await user.click(urlInput);
  await user.type(urlInput, url);
  expect(imageCheckbox).toBeDisabled();

  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      url,
    })
  );
});
