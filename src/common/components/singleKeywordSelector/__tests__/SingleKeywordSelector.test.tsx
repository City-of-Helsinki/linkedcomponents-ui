import { TEST_KEYWORD_ID } from '../../../../domain/keyword/constants';
import {
  configure,
  render,
  screen,
  shouldOpenMenuAndSelectOption,
  waitFor,
} from '../../../../utils/testUtils';
import {
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
  label,
  name,
  value: TEST_KEYWORD_ID,
};

const renderComponent = (props?: Partial<SingleKeywordSelectorProps>) =>
  render(<SingleKeywordSelector {...defaultProps} {...props} />, { mocks });

test('should set input value to equal label of selected keyword', async () => {
  renderComponent();

  const combobox = screen.getByRole('combobox', { name: new RegExp(label) });
  await waitFor(() => expect(combobox).toHaveValue(keywordName));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  await shouldOpenMenuAndSelectOption({
    optionLabels: keywordNames,
    toggleButtonLabel: new RegExp(label),
  });
});
