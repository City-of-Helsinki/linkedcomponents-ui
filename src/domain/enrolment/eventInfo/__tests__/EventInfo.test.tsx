/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { configure, render, screen } from '../../../../utils/testUtils';
import {
  event,
  eventOverrides,
  locationText,
} from '../../../event/__mocks__/event';
import { keywordsOverrides } from '../../../keyword/__mocks__/keyword';
import { mockedPlaceResponse } from '../../../place/__mocks__/place';
import EventInfo from '../EventInfo';

configure({ defaultHidden: true });

const findElement = (key: 'location') => {
  switch (key) {
    case 'location':
      return screen.findByText(locationText);
  }
};

const getElement = (key: 'age' | 'date' | 'description' | 'name' | 'price') => {
  switch (key) {
    case 'age':
      return screen.getByText('8 – 15 v');
    case 'date':
      return screen.getByText('10.07.2020 – 13.07.2020');
    case 'description':
      return screen.getByText(eventOverrides.description.fi as string);
    case 'name':
      return screen.getByText(eventOverrides.name.fi as string);
    case 'price':
      return screen.getByText(eventOverrides.offers[0].price.fi as string);
  }
};

const mocks = [mockedPlaceResponse];

test('should show event info', async () => {
  render(<EventInfo event={event} />, { mocks });

  await findElement('location');
  getElement('name');
  keywordsOverrides.forEach((item) =>
    screen.getByText(item.name?.fi as string)
  );
  getElement('description');
  getElement('price');
  getElement('age');
});
