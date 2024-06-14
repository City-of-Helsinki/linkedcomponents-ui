import { render, screen } from '../../../../../utils/testUtils';
import SwaggerLink from '../SwaggerLink';

const renderSwaggerLink = (showExplanations: boolean) =>
  render(<SwaggerLink showExplanations={showExplanations} />);

const explanation = 'dokumentaatio';

test('should show link exlanation', () => {
  renderSwaggerLink(true);

  expect(screen.getByText(`(${explanation})`)).toBeInTheDocument();
});

test('should not show link exlanation', () => {
  renderSwaggerLink(false);

  expect(screen.queryByText(`(${explanation})`)).not.toBeInTheDocument();
});
