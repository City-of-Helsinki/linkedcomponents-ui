import { Formik } from 'formik';
import React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { createEventValidationSchema } from '../../../utils';
import SummarySection from '../SummarySection';

const eventType = EVENT_TYPE.EVENT;

const initialValues = {
  [EVENT_FIELDS.IS_VERIFIED]: false,
  [EVENT_FIELDS.TYPE]: eventType,
};

const onSaveDraft = jest.fn();

const renderComponent = (validate = false) =>
  render(
    <Formik
      initialValues={initialValues}
      onSubmit={jest.fn()}
      validationSchema={validate && createEventValidationSchema}
      validateOnMount={validate}
    >
      <SummarySection onSaveDraft={onSaveDraft} />
    </Formik>
  );

test('should render summary section', () => {
  renderComponent();

  const headings = [
    translations.event.form.titleSummary[eventType],
    translations.event.form.notificationTitlePublishing[eventType],
  ];

  headings.forEach((name) => {
    expect(screen.queryByRole('heading', { name })).toBeInTheDocument();
  });

  const buttons = [
    translations.event.form.buttonPublish[eventType],
    translations.event.form.buttonSaveDraft,
  ];

  buttons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).toBeInTheDocument();
  });

  const links = [
    'Lue lisää aiheesta tapahtuman julkaisu (avataan uudessa välilehdessä)',
    'koskevia ohjeita ja säädöksiä (avataan uudessa välilehdessä)',
  ];

  links.forEach((name) => {
    expect(screen.getByRole('link', { name })).toBeInTheDocument();
  });
});

test('publish button should be enabled', () => {
  renderComponent();

  const publishButton = screen.getByRole('button', {
    name: translations.event.form.buttonPublish[eventType],
  });

  expect(publishButton).toBeEnabled();
});

test('publish button should be disabled', async () => {
  renderComponent(true);

  const publishButton = screen.getByRole('button', {
    name: translations.event.form.buttonPublish[eventType],
  });

  await waitFor(() => {
    expect(publishButton).toBeDisabled();
  });
});

test('should call onSaveDraft', async () => {
  renderComponent();

  const checkbox = screen.getByRole('checkbox');
  const saveDraftButton = screen.getByRole('button', {
    name: translations.event.form.buttonSaveDraft,
  });

  expect(saveDraftButton).toBeDisabled();

  userEvent.click(checkbox);

  expect(saveDraftButton).toBeEnabled();

  userEvent.click(saveDraftButton);

  await waitFor(() => {
    expect(onSaveDraft).toBeCalled();
  });
});
