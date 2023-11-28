import { screen, waitFor, within } from '../../../utils/testUtils';

const successHeadingText = 'Kiitos yhteydenotostasi.';

export const findSuccessHeading = () =>
  screen.findByRole('heading', { name: successHeadingText });

export const isContactInfoSentSuccessfully = async () => {
  const successHeading = await findSuccessHeading();
  await waitFor(() =>
    expect(within(successHeading).getByText(successHeadingText)).toHaveFocus()
  );
};
