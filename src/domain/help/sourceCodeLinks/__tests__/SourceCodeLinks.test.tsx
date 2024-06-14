import { render, screen } from '../../../../utils/testUtils';
import SourceCodeLinks from '../SourceCodeLinks';

const renderSourceCodeLinks = (showExplanations: boolean) =>
  render(<SourceCodeLinks showExplanations={showExplanations} />);

const explanations = [
  'rajapinta',
  'tapahtumien hallinnan käyttöliittymä',
  'ilmoittautumisen käyttöliittymä',
];

test('should show link exlanations', () => {
  renderSourceCodeLinks(true);

  for (const explanation of explanations) {
    expect(screen.getByText(`(${explanation})`)).toBeInTheDocument();
  }
});

test('should not show link exlanations', () => {
  renderSourceCodeLinks(false);

  for (const explanation of explanations) {
    expect(screen.queryByText(`(${explanation})`)).not.toBeInTheDocument();
  }
});
