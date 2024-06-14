import { scrollToItem } from '../scrollToItem';
import { render, screen, waitFor } from '../testUtils';

const renderComponent = () =>
  render(
    <div id="container">
      <button id="button-1">Button 1</button>
      <button id="button-2">Button 2</button>
    </div>
  );

test.each([
  ['button-1', 'Button 1', false],
  ['button-2', 'Button 2', false],
  ['button-1', 'Button 1', true],
  ['button-2', 'Button 2', true],
])('should set focus to the element by id', async (id, buttonLabel, last) => {
  renderComponent();

  scrollToItem(id, { last: last });
  await waitFor(() =>
    expect(screen.getByRole('button', { name: buttonLabel })).toHaveFocus()
  );
});

test('should set focus to the first element', async () => {
  renderComponent();
  scrollToItem('container', { last: false });

  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Button 1' })).toHaveFocus()
  );
});

test('should set focus to the last element', async () => {
  renderComponent();
  scrollToItem('container', { last: true });

  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Button 2' })).toHaveFocus()
  );
});
