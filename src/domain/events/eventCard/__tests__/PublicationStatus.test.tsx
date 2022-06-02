import React from 'react';

import { PublicationStatus as PublicationStatusEnum } from '../../../../generated/graphql';
import { render, screen } from '../../../../utils/testUtils';
import PublicationStatus from '../publicationStatus/PublicationStatus';

test('should render correct text when publication status is draft', () => {
  render(<PublicationStatus publicationStatus={PublicationStatusEnum.Draft} />);
  screen.getByText('Luonnos');
});

test('should render correct text when publication status is public', () => {
  render(
    <PublicationStatus publicationStatus={PublicationStatusEnum.Public} />
  );
  screen.getByText('Julkaistu');
});
