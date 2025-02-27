import {
  configure,
  render,
  screen,
  shouldOpenMenuAndSelectOption,
} from '../../../../utils/testUtils';
import {
  keywordAtId,
  keywordName,
  keywordNames,
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../__mocks__/keywordSelector';
import KeywordSelector, { KeywordSelectorProps } from '../KeywordSelector';

configure({ defaultHidden: true });

beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

const helper = 'Helper text';
const label = 'Select keyword';
const name = 'keyword';

const mocks = [mockedKeywordResponse, mockedKeywordsResponse];

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

test('should combobox input value to be selected keyword option label', async () => {
  renderComponent();

  await screen.findAllByText(keywordName, undefined, { timeout: 2000 });
});

// test('should open menu by clickin toggle button and list of options should be visible', async () => {
//   renderComponent();

//   await shouldOpenMenuAndSelectOption({
//     optionLabels: keywordNames,
//     toggleButtonLabel: new RegExp(label),
//   });
// });
