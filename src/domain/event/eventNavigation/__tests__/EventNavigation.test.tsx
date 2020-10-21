import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import EventNavigation from '../EventNavigation';

const stepLabels = ['Step 1', 'Step 2', 'Step 3'];

const steps = stepLabels.map((label) => ({
  component: (
    <div>
      <h1>{label}</h1>
    </div>
  ),
  disabled: false,
  isCompleted: false,
  label,
}));

test('should navigate to next/previous page', async () => {
  render(<EventNavigation items={steps} />);

  const nextButton = screen.getByRole('button', {
    name: translations.event.navigation.buttonNext,
  });

  const previousButton = screen.getByRole('button', {
    name: translations.event.navigation.buttonPrevious,
  });

  for (let i = 0; i < stepLabels.length; i = i + 1) {
    expect(
      screen.queryByRole('heading', { name: stepLabels[i] })
    ).toBeInTheDocument();

    if (i === stepLabels.length - 1) {
      expect(nextButton).toBeDisabled();
    } else {
      userEvent.click(nextButton);
    }
  }

  for (let i = stepLabels.length - 1; i >= 0; i = i - 1) {
    expect(
      screen.queryByRole('heading', { name: stepLabels[i] })
    ).toBeInTheDocument();

    if (i === 0) {
      expect(previousButton).toBeDisabled();
    } else {
      userEvent.click(previousButton);
    }
  }
});

test('should navigate to correct page with item click', async () => {
  render(<EventNavigation items={steps} />);

  stepLabels.forEach((label) => {
    userEvent.click(screen.getByRole('link', { name: label }));
    expect(screen.queryByRole('heading', { name: label })).toBeInTheDocument();
  });
});

test('should navigate to correct page with enter', async () => {
  render(<EventNavigation items={steps} />);

  stepLabels.forEach((label) => {
    userEvent.type(screen.getByRole('link', { name: label }), '{enter}');
    expect(screen.queryByRole('heading', { name: label })).toBeInTheDocument();
  });
});

test("should not navigate to page by clicking item if it's disabled", async () => {
  const items = [...steps];
  items[2].disabled = true;
  render(<EventNavigation items={items} />);

  expect(
    screen.queryByRole('heading', { name: items[0].label })
  ).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: items[2].label }));
  expect(
    screen.queryByRole('heading', { name: items[0].label })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: items[2].label })
  ).not.toBeInTheDocument();
});
