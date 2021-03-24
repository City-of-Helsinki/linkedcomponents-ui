import { IconAngleDown } from 'hds-react';
import React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
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

test('should open main level if sub level is active', async () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
        type="toggle"
      >
        <SubLevel active={true} label={subLevelLabel2} to={url} />
      </MainLevel>
    </SideNavigation>
  );

  await screen.findByRole('button', { name: mainLevelLabel1 });
  await screen.findByRole('button', { name: mainLevelLabel2 });
  await screen.findByRole('link', { name: subLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
});

test('should open sub levels if main level is active', async () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={true}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel3}
        to={url}
        type="link"
      />
    </SideNavigation>
  );

  await screen.findByRole('button', { name: mainLevelLabel1 });
  await screen.findByRole('button', { name: mainLevelLabel2 });
  await screen.findByRole('link', { name: mainLevelLabel3 });
  await screen.findByRole('link', { name: subLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
});

test('should show/hide sub levels', async () => {
  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
    </SideNavigation>
  );

  const mainLevelButton1 = await screen.findByRole('button', {
    name: mainLevelLabel1,
  });
  await screen.findByRole('button', { name: mainLevelLabel2 });

  expect(
    screen.queryByRole('link', { name: subLevelLabel1 })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: subLevelLabel2 })
  ).not.toBeInTheDocument();

  userEvent.click(mainLevelButton1);

  await screen.findByRole('link', {
    name: subLevelLabel1,
  });

  userEvent.click(mainLevelButton1);

  await waitFor(() => {
    expect(
      screen.queryByRole('link', { name: subLevelLabel1 })
    ).not.toBeInTheDocument();
  });
});

test('should open mobile menu', async () => {
  global.innerWidth = 500;

  render(
    <SideNavigation toggleButtonLabel={toggleButtonLabel}>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel1}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel1} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel2}
        to={url}
        type="toggle"
      >
        <SubLevel active={false} label={subLevelLabel2} to={url} />
      </MainLevel>
      <MainLevel
        active={false}
        icon={<IconAngleDown />}
        label={mainLevelLabel3}
        to={url}
        type="link"
      />
    </SideNavigation>
  );

  const toggleButton = await screen.findByRole('button', {
    name: toggleButtonLabel,
  });
  userEvent.click(toggleButton);

  // Mobile menu should be closed by clicking main level link
  const mainLevelLink3 = await screen.findByRole('link', {
    name: mainLevelLabel3,
  });
  userEvent.click(mainLevelLink3);
  await waitFor(() => {
    expect(
      screen.queryByRole('link', {
        name: mainLevelLabel3,
      })
    ).not.toBeInTheDocument();
  });

  userEvent.click(toggleButton);

  const mainLevelButton2 = await screen.findByRole('button', {
    name: mainLevelLabel2,
  });
  userEvent.click(mainLevelButton2);

  // Mobile menu should be closed by clicking sub-level link
  const subLevelLink2 = await screen.findByRole('link', {
    name: subLevelLabel2,
  });
  userEvent.click(subLevelLink2);
  await waitFor(() => {
    expect(
      screen.queryByRole('link', {
        name: mainLevelLabel3,
      })
    ).not.toBeInTheDocument();
  });
});
