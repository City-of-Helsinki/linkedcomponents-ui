import { TEST_KEYWORD_ID } from '../../../../domain/keyword/constants';
import getValue from '../../../../utils/getValue';
import {
  configure,
  render,
  screen,
  shouldOpenMenuAndSelectOption,
  userEvent,
} from '../../../../utils/testUtils';
import {
  filteredKeywords,
  keywordName,
  keywordNames,
  mockedKeywordResponse,
} from '../../keywordSelector/__mocks__/keywordSelector';
import {
  mockedFilteredKeywordsResponse,
  mockedKeywordsResponse,
} from '../__mocks__/singleKeywordSelector';
import SingleKeywordSelector, {
  SingleKeywordSelectorProps,
} from '../SingleKeywordSelector';

configure({ defaultHidden: true });

const label = 'Select keyword';
const name = 'keyword';

const mocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedFilteredKeywordsResponse,
];

const defaultProps: SingleKeywordSelectorProps = {
  texts: { label },
  name,
  value: TEST_KEYWORD_ID,
  onChange: vi.fn(),
};

const getToggleButton = () =>
  screen.getByRole('button', { name: new RegExp(label) });

const getInput = (): HTMLInputElement =>
  screen.getByRole('combobox', { name: new RegExp(label) });

const renderComponent = (props?: Partial<SingleKeywordSelectorProps>) =>
  render(<SingleKeywordSelector {...defaultProps} {...props} />, { mocks });

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  await shouldOpenMenuAndSelectOption({
    optionLabels: keywordNames,
    toggleButtonLabel: new RegExp(label),
  });
});

test('should search for keywords', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getToggleButton();

  await user.click(toggleButton);

  const input = getInput();

  await user.type(input, keywordName);

  for (const option of filteredKeywords.data) {
    await screen.findByRole('option', {
      hidden: true,
      name: getValue(option?.name?.fi, ''),
    });
  }
});
