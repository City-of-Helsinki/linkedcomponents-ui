import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { toast } from 'react-toastify';

import { testIds } from '../../../../common/components/imageUploader/ImageUploader';
import { UserDocument } from '../../../../generated/graphql';
import { fakeUser } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  fireEvent,
  getMockReduxStore,
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
import {
  mockedUserResponse,
  userVariables,
} from '../../../user/__mocks__/user';
import { ADD_IMAGE_INITIAL_VALUES } from '../../constants';
import AddImageForm, { AddImageFormProps } from '../AddImageForm';

configure({ defaultHidden: true });

const defaultMocks = [
  mockedImagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: AddImageFormProps = {
  onAddImageByFile: jest.fn(),
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  publisher,
};

const renderComponent = ({
  mocks = defaultMocks,
  props,
}: {
  mocks?: MockedResponse[];
  props?: Partial<AddImageFormProps>;
}) => render(<AddImageForm {...defaultProps} {...props} />, { mocks, store });

const findElement = (key: 'imageCheckbox') => {
  switch (key) {
    case 'imageCheckbox':
      return screen.findByRole('checkbox', {
        name: images.data[0]?.name as string,
      });
  }
};

const getElement = (key: 'addButton' | 'cancelButton' | 'urlInput') => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: 'Lisää' });
    case 'cancelButton':
      return screen.getByRole('button', { name: /peruuta/i });
    case 'urlInput':
      return screen.getByRole('textbox', { name: /kuvan url-osoite/i });
  }
};

test('should call onCancel', async () => {
  const onCancel = jest.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onCancel } });

  await findElement('imageCheckbox');

  const cancelButton = getElement('cancelButton');
  await act(async () => await user.click(cancelButton));
  await waitFor(() => expect(onCancel).toBeCalled());
});

test('should call onSubmit with existing image', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  await waitFor(() => expect(urlInput).toBeEnabled());

  await act(async () => await user.click(imageCheckbox));
  expect(urlInput).toBeDisabled();
  await waitFor(() => expect(addButton).toBeEnabled());

  await act(async () => await user.click(addButton));
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      selectedImage: [images.data[0]?.atId],
    })
  );
});

test('should call onSubmit by double clicking image', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');

  await waitFor(() => expect(urlInput).toBeEnabled());

  await act(async () => await user.dblClick(imageCheckbox));
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      selectedImage: [images.data[0]?.atId],
    })
  );
});

test('should show error message if trying to enter too large image file', async () => {
  toast.error = jest.fn();
  const user = userEvent.setup();

  renderComponent({});

  const addButton = getElement('addButton');
  await waitFor(() => expect(addButton).toBeDisabled());

  const fileInput = screen.getByTestId(testIds.input);
  const file = mockFile({ size: 3000000 });

  Object.defineProperty(fileInput, 'files', { value: [file] });
  fireEvent.change(fileInput);

  await waitFor(() => expect(addButton).toBeEnabled());
  await act(async () => await user.click(addButton));

  await waitFor(() => {
    expect(toast.error).toBeCalledWith(
      'Tiedostokoko on liian suuri. Tiedoston maksimikoko on 2 Mt'
    );
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
  await act(async () => await user.click(urlInput));
  await act(async () => await user.type(urlInput, invalidUrlText));

  await act(async () => await user.tab());

  await screen.findByText(translations.form.validation.string.url);
  expect(addButton).toBeDisabled();
});

test("inputs to add new images should be disabled if user doesn't have permissions to add images", async () => {
  const user = fakeUser({
    organization: '',
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };

  const mocks = [
    ...defaultMocks.filter((mock) => mock.request.query !== UserDocument),
    mockedUserResponse,
  ];
  const onSubmit = jest.fn();
  renderComponent({ mocks, props: { onSubmit } });

  await findElement('imageCheckbox');
  const uploadImageButton = screen.getByRole('button', {
    name: 'Raahaa ja pudota kuva alueelle tai lisää omalta koneelta klikkaamalla',
  });
  const urlInput = getElement('urlInput');

  await waitFor(() => expect(urlInput).toBeDisabled());
  expect(uploadImageButton).toBeDisabled();
});

test('should call onSubmit with image url', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  renderComponent({ props: { onSubmit } });

  const url = 'http://test.com';
  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  expect(addButton).toBeDisabled();
  await waitFor(() => expect(urlInput).toBeEnabled());

  await act(async () => await user.click(urlInput));
  await act(async () => await user.type(urlInput, url));
  expect(imageCheckbox).toBeDisabled();

  await waitFor(() => expect(addButton).toBeEnabled());
  await act(async () => await user.click(addButton));
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      ...ADD_IMAGE_INITIAL_VALUES,
      url,
    })
  );
});
