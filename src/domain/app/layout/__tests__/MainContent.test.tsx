import * as React from 'react';
import { scroller } from 'react-scroll';

import { MAIN_CONTENT_ID } from '../../../../constants';
import { render, screen, waitFor } from '../../../../utils/testUtils';
import MainContent from '../MainContent';

const renderComponent = (
  onScrollFn?: () => void,
  route = `/fi/test#${MAIN_CONTENT_ID}`
) =>
  render(
    <MainContent onScrollFn={onScrollFn}>
      <label htmlFor="input-1">Input 1</label>
      <input id="input-1" type="text" />
      <label htmlFor="input-2">Input 2</label>
      <input id="input-2" type="text" />
    </MainContent>,
    {
      routes: [route],
    }
  );

test('should call default scrollTo function', () => {
  scroller.scrollTo = jest.fn();
  renderComponent();

  expect(scroller.scrollTo).toBeCalledTimes(1);
});

test('onScrollFn should be called and input should be focused', async () => {
  const onScrollFn = jest.fn();
  renderComponent(onScrollFn);

  expect(onScrollFn).toBeCalledTimes(1);

  const input = await screen.findByRole('textbox', { name: 'Input 1' });
  await waitFor(() => {
    expect(input).toHaveFocus();
  });
});

test('onScrollFn should not be called', async () => {
  const onScrollFn = jest.fn();
  renderComponent(onScrollFn, '/fi/test');

  expect(onScrollFn).toBeCalledTimes(0);
});
