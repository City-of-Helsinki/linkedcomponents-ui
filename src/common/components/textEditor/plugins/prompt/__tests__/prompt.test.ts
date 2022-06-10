/* eslint-disable import/no-named-as-default-member */
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { Attrs } from 'prosemirror-model';

import { VALIDATION_MESSAGE_KEYS } from '../../../../../../domain/app/i18n/constants';
import { actWait } from '../../../../../../utils/testUtils';
import { rUrl } from '../../../config/validate';
import { openPrompt, TextField } from '../prompt';

const getElement = (key: 'addButton' | 'cancelButton' | 'urlInput') => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: 'Lisää' });
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta' });
    case 'urlInput':
      return screen.getByRole('textbox', { name: 'Linkin URL' });
  }
};

const renderPrompt = (callback?: (attrs: Attrs) => void) => {
  const t = i18n.t.bind(i18n);

  openPrompt({
    title: t('common.textEditor.link.promptTitle'),
    fields: {
      href: new TextField({
        label: t('common.textEditor.link.linkTarget'),
        required: true,
        validate: (value: string) => {
          return rUrl.test(value) ? '' : t(VALIDATION_MESSAGE_KEYS.URL);
        },
      }),
      title: new TextField({ label: t('common.textEditor.link.linkTitle') }),
    },
    callback(attrs) {
      callback(attrs);
    },
    t,
  });
};

test('should call callback', async () => {
  const user = userEvent.setup();
  const callback = jest.fn();

  renderPrompt(callback);

  const addButton = getElement('addButton');
  await userEvent.click(addButton);
  screen.getByText('Tämä kenttä on pakollinen');
  const urlInput = getElement('urlInput');
  await user.type(urlInput, 'invalid');
  await userEvent.click(addButton);
  screen.getByText(
    'Kirjoita URL osoite kokonaisena ja oikeassa muodossa (http://...)'
  );
  await user.clear(urlInput);
  await user.type(urlInput, 'http://test.com');
  await userEvent.click(addButton);
  expect(callback).toBeCalledWith({ href: 'http://test.com', title: '' });
});

test('should submit form by pressing enter key', async () => {
  const user = userEvent.setup();
  const callback = jest.fn();

  renderPrompt(callback);

  const urlInput = getElement('urlInput');
  await user.clear(urlInput);
  await user.type(urlInput, 'http://test.com{enter}');
  expect(callback).toBeCalledWith({ href: 'http://test.com', title: '' });
});

test('should close modal by pressing esc key', async () => {
  const user = userEvent.setup();

  renderPrompt();

  const urlInput = getElement('urlInput');
  await user.type(urlInput, '{esc}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('should close modal by clicking outside of the modal', async () => {
  const user = userEvent.setup();

  renderPrompt();

  await actWait(50);
  await user.click(document.body);
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
