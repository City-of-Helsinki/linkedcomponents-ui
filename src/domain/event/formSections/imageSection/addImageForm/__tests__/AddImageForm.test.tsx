import { MockedResponse } from '@apollo/react-testing';
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
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import translations from '../../../../../app/i18n/fi.json';
import AddImageForm, { AddImageFormProps } from '../AddImageForm';

configure({ defaultHidden: true });

const publisher = 'publisher:1';
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

const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
  organizationMemberships: [],
});
const userVariables = {
  createPath: undefined,
  id: 'user:1',
};
const userResponse = { data: { user } };
const mockedUserResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
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

test('should render add image form', () => {
  renderComponent({});

  const titles = [
    translations.event.form.image.titleUseImportedImage,
    translations.event.form.image.titleImportFromHardDisk,
    translations.event.form.image.titleImportFromInternet,
  ];
  titles.forEach((name) => {
    screen.getByRole('heading', { name });
  });

  const buttons = [translations.common.cancel, translations.common.add];
  buttons.forEach((name) => {
    screen.getByRole('button', { name });
  });
});

test('should call onCancel', async () => {
  const onCancel = jest.fn();
  renderComponent({ props: { onCancel } });

  userEvent.click(
    screen.getByRole('button', { name: translations.common.cancel })
  );

  expect(onCancel).toBeCalled();
});

test('should call onSubmit with existing image', async () => {
  const onSubmit = jest.fn();
  renderComponent({ props: { onSubmit } });

  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });
  const imageCheckbox = await screen.findByRole('checkbox', {
    name: images.data[0].name,
  });
  const addButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(urlInput).toBeEnabled();
  });

  userEvent.click(imageCheckbox);

  expect(urlInput).toBeDisabled();

  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });

  userEvent.click(addButton);

  await waitFor(() => {
    expect(onSubmit).toBeCalledWith({
      selectedImage: [images.data[0].atId],
      url: '',
    });
  });
});

test('should validate url', async () => {
  renderComponent({});

  const invalidUrlText = 'invalid url';
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });
  const addButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(urlInput).toBeEnabled();
  });
  userEvent.type(urlInput, invalidUrlText);

  userEvent.tab();

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

  const uploadImageButton = screen.getByRole('button', {
    name: 'Sinulla ei ole oikeuksia lisätä kuvia',
  });
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });
  await screen.findByRole('checkbox', { name: images.data[0].name });

  await waitFor(() => {
    expect(urlInput).toBeDisabled();
  });
  expect(uploadImageButton).toBeDisabled();
});

test('should call onSubmit with image url', async () => {
  const onSubmit = jest.fn();
  renderComponent({ props: { onSubmit } });

  const url = 'http://test.com';
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });
  const imageCheckbox = await screen.findByRole('checkbox', {
    name: images.data[0].name,
  });
  const addButton = screen.getByRole('button', {
    name: translations.common.add,
  });

  expect(addButton).toBeDisabled();
  await waitFor(() => {
    expect(urlInput).toBeEnabled();
  });

  userEvent.type(urlInput, url);

  expect(imageCheckbox).toBeDisabled();

  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });
  userEvent.click(addButton);

  await waitFor(() => {
    expect(onSubmit).toBeCalledWith({
      selectedImage: [],
      url,
    });
  });
});
