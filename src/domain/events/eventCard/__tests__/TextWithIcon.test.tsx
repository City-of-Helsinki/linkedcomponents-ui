import { render } from '@testing-library/react';
import { IconInfoCircle } from 'hds-react';
import React from 'react';

import TextWithIcon from '../TextWithIcon';

test('should match snapshot', () => {
  const { container } = render(
    <TextWithIcon icon={<IconInfoCircle />} text={'Text'} />
  );

  expect(container).toMatchSnapshot();
});
