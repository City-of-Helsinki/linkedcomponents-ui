import { render, screen } from '@testing-library/react';
import React from 'react';

import { PublicationStatus as PublicationStatusEnum } from '../../../../generated/graphql';
import PublicationStatus from '../PublicationStatus';

test('should render correct text when publication status is draft', () => {
  render(<PublicationStatus publicationStatus={PublicationStatusEnum.Draft} />);
  expect(screen.getByText('Luonnos')).toBeInTheDocument();
});

test('should render correct text when publication status is public', () => {
  render(
    <PublicationStatus publicationStatus={PublicationStatusEnum.Public} />
  );
  expect(screen.getByText('Julkaistu')).toBeInTheDocument();
});
