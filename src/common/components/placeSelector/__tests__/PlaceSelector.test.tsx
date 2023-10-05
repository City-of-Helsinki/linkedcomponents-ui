/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import React from 'react';

import { OptionType } from '../../../../types';
import generateAtId from '../../../../utils/generateAtId';
import getValue from '../../../../utils/getValue';
import { fakePlace } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  filteredPlaces,
  mockedFilteredPlacesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  place,
  selectedPlaceText,
} from '../__mocks__/placeSelector';
import PlaceSelector, {
  getOption,
  GetOptionArgs,
  PlaceSelectorProps,
} from '../PlaceSelector';

configure({ defaultHidden: true });

const mocks = [
  mockedPlaceResponse,
  mockedFilteredPlacesResponse,
  mockedPlacesResponse,
];

const helper = 'Helper text';
const label = 'Select place';
const name = 'place';

const defaultProps: PlaceSelectorProps = {
  helper,
  label,
  name,
  value: place.atId,
};

const renderComponent = (props?: Partial<PlaceSelectorProps>) =>
  render(<PlaceSelector {...defaultProps} {...props} />, { mocks });

const getElement = (key: 'inputField' | 'toggleButton') => {
  switch (key) {
    case 'inputField':
      return screen.getByRole('combobox', { name: new RegExp(helper) });
    case 'toggleButton':
      return screen.getByRole('button', { name: new RegExp(label) });
  }
};

test('should combobox input value to be selected place option label', async () => {
  renderComponent();

  const inputField = getElement('inputField');

  await waitFor(() => expect(inputField).toHaveValue(selectedPlaceText));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  const user = userEvent.setup();
  renderComponent();

  const inputField = getElement('inputField');
  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');
  for (const option of filteredPlaces.data) {
    await screen.findByRole('option', {
      hidden: true,
      name: new RegExp(getValue(option?.name?.fi, '')),
    });
  }
});

describe('getOption function', () => {
  const commonProps: Pick<GetOptionArgs, 'locale' | 't'> = {
    locale: 'fi',
    t: i18n.t.bind(i18n),
  };
  const id = 'place:1';
  const atId = generateAtId(id, 'place');

  const commonPlaceOverrides = {
    addressLocality: { fi: 'Address locality' },
    id,
    atId,
    name: { fi: 'Place name' },
    nEvents: 100,
    streetAddress: { fi: 'Street address' },
  };

  const testCases: [
    Pick<GetOptionArgs, 'place' | 'showEventAmount'>,
    OptionType,
  ][] = [
    [
      {
        place: fakePlace(commonPlaceOverrides),
        showEventAmount: false,
      },
      {
        label: 'Place name (Street address, Address locality)',
        value: atId,
      },
    ],
    [
      {
        place: fakePlace(commonPlaceOverrides),
        showEventAmount: true,
      },
      {
        label: 'Place name (Street address, Address locality)\n100 tapahtumaa',
        value: atId,
      },
    ],
    [
      {
        place: fakePlace({
          ...commonPlaceOverrides,
          dataSource: 'osoite',
        }),
        showEventAmount: false,
      },
      {
        label: 'Place name',
        value: atId,
      },
    ],
    [
      {
        place: fakePlace({
          ...commonPlaceOverrides,
          dataSource: 'osoite',
        }),
        showEventAmount: true,
      },
      {
        label: 'Place name\n100 tapahtumaa',
        value: atId,
      },
    ],
  ];

  it.each(testCases)('with args %p returns %p', (args, expectedOption) => {
    expect(getOption({ ...commonProps, ...args })).toEqual(expectedOption);
  });
});
