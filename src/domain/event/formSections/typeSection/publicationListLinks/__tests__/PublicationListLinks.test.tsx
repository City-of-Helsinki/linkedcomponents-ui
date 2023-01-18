import React from 'react';

import { configure, render, screen } from '../../../../../../utils/testUtils';
import PublicationListLinks, {
  PublicationListLink,
} from '../PublicationListLinks';

configure({ defaultHidden: true });

test('should show all links', async () => {
  const links: PublicationListLink[] = [
    { href: 'https://tapahtumat.hel.fi', text: 'tapahtumat.hel.fi' },
    {
      href: 'https://vapaaehtoistoiminta.hel.fi',
      text: 'vapaaehtoistoiminta.hel.fi',
    },
  ];
  render(<PublicationListLinks links={links} />);

  for (const { text } of links) {
    screen.getByRole('link', { name: text });
  }
});
