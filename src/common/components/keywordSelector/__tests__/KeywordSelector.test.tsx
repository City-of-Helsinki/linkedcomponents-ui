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
  keywordAtId,
  keywordName,
  keywordNames,
  mockedFilteredKeywordsResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../__mocks__/keywordSelector';
import KeywordSelector, { KeywordSelectorProps } from '../KeywordSelector';

configure({ defaultHidden: true });

const helper = 'Helper text';
const label = 'Select keyword';
const name = 'keyword';

const mocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedFilteredKeywordsResponse,
];

const clearButtonAriaLabel = 'Poista kaikki';
const selectedItemRemoveButtonAriaLabel = 'Poista valinta';

const defaultProps: KeywordSelectorProps = {
  texts: {
    clearButtonAriaLabel_multiple: clearButtonAriaLabel,
    assistive: helper,
    label,
    tagRemoveSelectionAriaLabel: selectedItemRemoveButtonAriaLabel,
  },
  multiSelect: true,
  name,
  value: [keywordAtId],
  onChange: vi.fn(),
};

const renderComponent = (props?: Partial<KeywordSelectorProps>) =>
  render(<KeywordSelector {...defaultProps} {...props} />, { mocks });

const getToggleButton = () =>
  screen.getByRole('button', { name: new RegExp(label) });

const getInput = (): HTMLInputElement =>
  screen.getByRole('combobox', { name: new RegExp(label) });

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
