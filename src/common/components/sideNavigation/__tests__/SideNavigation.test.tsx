import { IconAngleDown } from 'hds-react';
import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import MainLevel from '../MainLevel';
import SideNavigation from '../SideNavigation';
import SubLevel from '../SubLevel';

const toggleButtonLabel = 'Navigate to page';
const mainLevelLabel1 = 'Main level 1';
const mainLevelLabel2 = 'Main level 2';
const mainLevelLabel3 = 'Main level 3';
const subLevelLabel1 = 'Sub level 1';
const subLevelLabel2 = 'Sub level 2';
const url = 'http://www.testurl.fi';

test('should open main level if sub level is active', () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
      >
        <SubLevel active={true} label={subLevelLabel2} to={url} />
      </MainLevel>
    </SideNavigation>
  );

  screen.getByRole('link', { name: mainLevelLabel1 });
  screen.getByRole('link', { name: mainLevelLabel2 });
  screen.getByRole('link', { name: subLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
});

test('should open sub levels if main level is active', () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={true}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel3}
        to={url}
      />
    </SideNavigation>
  );

  screen.getByRole('link', { name: mainLevelLabel1 });
  screen.getByRole('link', { name: mainLevelLabel2 });
  screen.getByRole('link', { name: mainLevelLabel3 });
  screen.getByRole('link', { name: subLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
});

test('should show/hide sub levels', () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
    </SideNavigation>
  );

  const mainLevelLink1 = screen.getByRole('link', { name: mainLevelLabel1 });
  screen.getByRole('link', { name: mainLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: subLevelLabel2 })
  ).not.toBeInTheDocument();

  userEvent.click(mainLevelLink1);

  screen.getByRole('link', { name: subLevelLabel1 });
});

test('should open mobile menu', () => {
  global.innerWidth = 500;

  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel3}
        to={url}
      />
    </SideNavigation>
  );

  const toggleButton = screen.getByRole('button', { name: toggleButtonLabel });
  userEvent.click(toggleButton);

  // Mobile menu should be closed by clicking main level link
  const mainLevelLink3 = screen.getByRole('link', { name: mainLevelLabel3 });
  userEvent.click(mainLevelLink3);

  expect(
    screen.queryByRole('link', { name: mainLevelLabel3 })
  ).not.toBeInTheDocument();

  userEvent.click(toggleButton);

  const mainLevelLink2 = screen.getByRole('link', { name: mainLevelLabel2 });
  userEvent.click(mainLevelLink2);

  // Mobile menu should be closed by clicking sub-level link
  const subLevelLink2 = screen.getByRole('link', { name: subLevelLabel2 });
  userEvent.click(subLevelLink2);

  expect(
    screen.queryByRole('link', { name: mainLevelLabel3 })
  ).not.toBeInTheDocument();
});
