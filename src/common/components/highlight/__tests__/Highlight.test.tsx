import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import Highlight from '../Highlight';

it('should render the title as a semantic heading element', () => {
  const title = 'Test Title';
  const icon = <span>🎯</span>;
  const text = 'Some descriptive text';

  render(<Highlight headingLevel={2} icon={icon} text={text} title={title} />);

  // Sonar S6819: prefer <h1>-<h6> over <div role="heading">
  const heading = screen.getByRole('heading', { level: 2, name: title });
  expect(heading.tagName).toBe('H2');
});

it('should handle multiline titles', () => {
  const title = 'Line One\nLine Two';
  const icon = <span>🎯</span>;
  const text = 'Some descriptive text';

  render(<Highlight headingLevel={3} icon={icon} text={text} title={title} />);

  const heading = screen.getByRole('heading', {
    level: 3,
    name: 'Line One Line Two',
  });
  expect(heading.tagName).toBe('H3');
});
