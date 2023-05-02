import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import {
  mockedPlaceResponse,
  mockedPlacesResponse,
  placeId,
  placeName,
  placeOverrides,
} from '../../../__mocks__/eventSearchPage';
import PlaceSelector, { PlaceSelectorProps } from '../PlaceSelector';

configure({ defaultHidden: true });

const mocks = [mockedPlacesResponse, mockedPlaceResponse];

const toggleButtonLabel = 'Select place';

const defaultProps: PlaceSelectorProps = {
  onChange: jest.fn(),
  toggleButtonLabel,
  value: [],
};

const renderComponent = (props?: Partial<PlaceSelectorProps>) =>
  render(<PlaceSelector {...defaultProps} {...props} />, { mocks });

const getElement = (key: 'toggleButton') => {
  switch (key) {
    case 'toggleButton':
      return screen.getByRole('button', { name: toggleButtonLabel });
  }
};
test('should render place selector', async () => {
  const user = userEvent.setup();
  renderComponent({ value: [placeId] });

  await screen.findByText(placeName);

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  for (const { name } of placeOverrides) {
    await screen.findByLabelText(name);
  }
});
