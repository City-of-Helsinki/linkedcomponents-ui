import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { PAGE_SIZE } from '../../../../../../common/components/imageSelector/constants';
import { MAX_PAGE_SIZE } from '../../../../../../constants';
import {
  ImagesDocument,
  OrganizationsDocument,
  UserDocument,
} from '../../../../../../generated/graphql';
import {
  fakeImages,
  fakeOrganizations,
  fakeUser,
} from '../../../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import translations from '../../../../../app/i18n/fi.json';
import { TEST_PUBLISHER_ID } from '../../../../../organization/constants';
import {
  mockedUserResponse,
  userVariables,
} from '../../../../../user/__mocks__/user';
import AddImageForm, { AddImageFormProps } from '../AddImageForm';

configure({ defaultHidden: true });

const publisher = TEST_PUBLISHER_ID;
const images = fakeImages(PAGE_SIZE, [{ publisher }]);
const imagesVariables = {
  createPath: undefined,
  pageSize: PAGE_SIZE,
  publisher,
};
const imagesResponse = {
  data: {
    images: {
      ...images,
      meta: {
        ...images.meta,
        count: 15,
        next: 'https://api.hel.fi/linkedevents/v1/image/?page=2',
      },
    },
  },
};
const mockedImagesResponse = {
  request: {
    query: ImagesDocument,
    variables: imagesVariables,
  },
  result: imagesResponse,
};

const organizationsVariables = {
  child: publisher,
  createPath: undefined,
  pageSize: MAX_PAGE_SIZE,
};
const organizationsResponse = { data: { organizations: fakeOrganizations(0) } };
const mockedOrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const defaultMocks = [
  mockedImagesResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: AddImageFormProps = {
  onCancel: jest.fn(),
  onFileChange: jest.fn(),
  onSubmit: jest.fn(),
  publisher: publisher,
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
      return screen.findByRole('checkbox', { name: images.data[0].name });
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
  renderComponent({ props: { onCancel } });

  await findElement('imageCheckbox');

  const cancelButton = getElement('cancelButton');
  act(() => userEvent.click(cancelButton));
  await waitFor(() => expect(onCancel).toBeCalled());
});

test('should call onSubmit with existing image', async () => {
  const onSubmit = jest.fn();
  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  await waitFor(() => expect(urlInput).toBeEnabled());

  act(() => userEvent.click(imageCheckbox));
  expect(urlInput).toBeDisabled();
  await waitFor(() => expect(addButton).toBeEnabled());

  act(() => userEvent.click(addButton));
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      selectedImage: [images.data[0].atId],
      url: '',
    })
  );
});

test('should call onSubmit by double clicking image', async () => {
  const onSubmit = jest.fn();
  renderComponent({ props: { onSubmit } });

  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');

  await waitFor(() => expect(urlInput).toBeEnabled());

  userEvent.dblClick(imageCheckbox);
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      selectedImage: [images.data[0].atId],
      url: '',
    })
  );
});

test('should validate url', async () => {
  renderComponent({});

  const invalidUrlText = 'invalid url';
  await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  await waitFor(() => expect(urlInput).toBeEnabled());
  act(() => userEvent.click(urlInput));
  userEvent.type(urlInput, invalidUrlText);

  act(() => userEvent.tab());

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
    request: {
      query: UserDocument,
      variables: userVariables,
    },
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
    name: 'Sinulla ei ole oikeuksia lisätä kuvia',
  });
  const urlInput = getElement('urlInput');

  await waitFor(() => expect(urlInput).toBeDisabled());
  expect(uploadImageButton).toBeDisabled();
});

test('should call onSubmit with image url', async () => {
  const onSubmit = jest.fn();
  renderComponent({ props: { onSubmit } });

  const url = 'http://test.com';
  const imageCheckbox = await findElement('imageCheckbox');
  const urlInput = getElement('urlInput');
  const addButton = getElement('addButton');

  expect(addButton).toBeDisabled();
  await waitFor(() => expect(urlInput).toBeEnabled());

  act(() => userEvent.click(urlInput));
  userEvent.type(urlInput, url);
  expect(imageCheckbox).toBeDisabled();

  await waitFor(() => expect(addButton).toBeEnabled());
  act(() => userEvent.click(addButton));
  await waitFor(() =>
    expect(onSubmit).toBeCalledWith({
      selectedImage: [],
      url,
    })
  );
});
