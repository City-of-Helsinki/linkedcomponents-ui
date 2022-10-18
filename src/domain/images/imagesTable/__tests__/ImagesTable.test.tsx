import { fakeImages } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { TEST_IMAGE_ID } from '../../../image/constants';
import { imageNames, images } from '../../__mocks__/imagesPage';
import { IMAGE_SORT_OPTIONS } from '../../constants';
import ImagesTable, { ImagesTableProps } from '../ImagesTable';

configure({ defaultHidden: true });

const defaultProps: ImagesTableProps = {
  caption: 'Images table',
  images: [],
  setSort: jest.fn(),
  sort: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC,
};

const renderComponent = (props?: Partial<ImagesTableProps>) =>
  render(<ImagesTable {...defaultProps} {...props} />);

test('should render images table', () => {
  renderComponent();

  const columnHeaders = ['Kuva', 'ID', 'Nimi', 'Viimeksi muokattu'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all images', () => {
  renderComponent({ images: images.data });

  // Test only first 2 to keep this test performant
  for (const name of imageNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit image page by clicking keyword', async () => {
  const imageName = 'Image name';
  const imageId = TEST_IMAGE_ID;

  const user = userEvent.setup();
  const { history } = renderComponent({
    images: fakeImages(1, [{ name: imageName, id: imageId, url: null }]).data,
  });

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: imageName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/administration/images/edit/${imageId}`
  );
});

test('should open edit keyword page by pressing enter on row', async () => {
  const imageName = 'Image name';
  const imageId = TEST_IMAGE_ID;

  const user = userEvent.setup();
  const { history } = renderComponent({
    images: fakeImages(1, [{ name: imageName, id: imageId }]).data,
  });

  await act(
    async () =>
      await user.type(
        screen.getByRole('button', { name: imageName }),
        '{enter}'
      )
  );

  expect(history.location.pathname).toBe(
    `/fi/administration/images/edit/${imageId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = jest.fn();
  const user = userEvent.setup();

  renderComponent({ setSort });

  const lastModifiedButton = screen.getByRole('button', {
    name: 'Viimeksi muokattu',
  });
  await act(async () => await user.click(lastModifiedButton));
  expect(setSort).toBeCalledWith('last_modified_time');
});
