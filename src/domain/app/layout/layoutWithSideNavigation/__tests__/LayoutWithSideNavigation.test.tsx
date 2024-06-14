import { IconHome } from 'hds-react';

import { ROUTES } from '../../../../../constants';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import LayoutWithSideNavigation, {
  LayoutWithSideNavigationProps,
} from '../LayoutWithSideNavigation';

const route = ROUTES.HELP;

const defaultProps: Omit<LayoutWithSideNavigationProps, 'children'> = {
  levels: [],
  toggleButtonLabel: 'Avaa sivu',
};
const renderComponent = (props?: Partial<LayoutWithSideNavigationProps>) =>
  render(
    <LayoutWithSideNavigation {...defaultProps} {...props}>
      <div />
    </LayoutWithSideNavigation>,
    { routes: [route] }
  );

const subLevels = [
  { label: 'Sub level 1', to: '/sub-level1' },
  { label: 'Sub level 2', to: '/sub-level2' },
  { label: 'Sub level 3', to: '/sub-level3' },
  { label: 'Sub level 4', to: '/sub-level4' },
];

const levels = [
  {
    icon: <IconHome />,
    label: 'Level 1 with sub level',
    subLevels: subLevels,
    to: '/level1',
  },
  {
    icon: <IconHome />,
    label: 'Level 2',
    subLevels: [],
    to: '/level2',
  },
];

test('should route to level url', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ levels });

  const level1Button = screen.getByRole('button', { name: levels[0].label });
  await user.click(level1Button);

  for (const subLevel of subLevels) {
    const subLevelLink = screen.getAllByRole('link', {
      name: subLevel.label,
    })[0];
    await user.click(subLevelLink);

    await waitFor(() =>
      expect(history.location.pathname).toBe(`/fi${subLevel.to}`)
    );
  }

  const level2Link = screen.getByRole('link', { name: levels[1].label });
  await user.click(level2Link);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi${levels[1].to}`)
  );
});
