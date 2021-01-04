import { render, screen } from '@testing-library/react';
import React from 'react';

import AudienceAgeText, { AudienceAgeTextProps } from '../AudienceAgeText';

const renderComponent = (props: AudienceAgeTextProps) =>
  render(<AudienceAgeText {...props} />);

test('should render correct text when only minAge is set', () => {
  renderComponent({ maxAge: null, minAge: 12 });
  expect(screen.getByText('Yli 12 v')).toBeInTheDocument();
});

test('should render correct text when only maxAge is set', () => {
  renderComponent({ maxAge: 12, minAge: null });
  expect(screen.getByText('Alle 12 v')).toBeInTheDocument();
});

test('should render correct text when both maxAge and minAge are set', () => {
  renderComponent({ maxAge: 18, minAge: 12 });
  expect(screen.getByText('12 – 18 v')).toBeInTheDocument();
});

test('should render correct text when both maxAge and minAge are unset', () => {
  renderComponent({ maxAge: null, minAge: null });
  expect(screen.getByText('-')).toBeInTheDocument();
});
