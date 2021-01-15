import React from 'react';

import { PublicationStatus } from '../../../../generated/graphql';
import { render, screen } from '../../../../utils/testUtils';
import PublicationStatusTag from '../PublicationStatusTag';

test('should render correct text when publication status is draft', () => {
  render(<PublicationStatusTag publicationStatus={PublicationStatus.Draft} />);
  expect(screen.getByText('Luonnos')).toBeInTheDocument();
});

test('should render correct text when publication status is public', () => {
  render(<PublicationStatusTag publicationStatus={PublicationStatus.Public} />);
  expect(screen.getByText('Julkaistu')).toBeInTheDocument();
});
