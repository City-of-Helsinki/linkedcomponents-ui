/* eslint-disable @typescript-eslint/no-explicit-any */
import './prompt.scss';

import { TFunction } from 'i18next';
import uniqueId from 'lodash/uniqueId';
import { Attrs } from 'prosemirror-model';

import { VALIDATION_MESSAGE_KEYS } from '../../../../../domain/app/i18n/constants';

const prefix = 'ProseMirror-prompt';

type Options = {
  /// The starting value for the field.
  value?: any;

  /// The label for the field.
  label: string;

  /// Whether the field is required.
  required?: boolean;

  /// A function to validate the given value. Should return an
  /// error message if it is not valid.
  validate?: (value: any) => string | null;

  /// A cleanup function for field values.
  clean?: (value: any) => any;
};

/// The type of field that `openPrompt` expects to be passed to it.
export abstract class Field {
  /// Create a field with the given options. Options support by all
  /// field types are:
  constructor(
    /// @internal
    readonly options: Options
  ) {}

  /// Read the field's value from its DOM node.
  read(dom: HTMLElement) {
    return (dom as any).value;
  }

  /// A field-type-specific validation function.
  validateType(value: any): string | null {
    return null;
  }

  /// @internal
  validate(value: any, t: TFunction): string | null {
    if (!value && this.options.required)
      return t(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED);
    return (
      this.validateType(value) ||
      (this.options.validate ? this.options.validate(value) : null)
    );
  }

  clean(value: any): any {
    /* istanbul ignore next */
    return this.options.clean ? this.options.clean(value) : value;
  }

  /// Render the field to the DOM. Should be implemented by all subclasses.
  abstract render(): HTMLElement;
}

const reportInvalid = (dom: HTMLElement, message: string) => {
  const parent = dom.parentNode?.parentNode;

  /* istanbul ignore else */
  if (parent) {
    const errorClassName = `${prefix}-input__error-text`;
    const msg = parent.appendChild(document.createElement('div'));
    const errors = parent.querySelectorAll(`.${errorClassName}`);

    if (errors.length) {
      errors.forEach((error) => {
        parent.removeChild(error);
      });
    }
    msg.className = errorClassName;
    msg.textContent = message;
  }
};

const getValues = (
  fields: { [name: string]: Field },
  domFields: readonly HTMLElement[],
  t: TFunction
) => {
  const result = Object.create(null);
  let i = 0;

  for (const name in fields) {
    const field = fields[name],
      dom = domFields[i];
    i = i + 1;
    const value = field.read(dom),
      bad = field.validate(value, t);

    if (bad) {
      reportInvalid(dom, bad);
      return null;
    }
    result[name] = field.clean(value);
  }
  return result;
};

export const openPrompt = (options: {
  callback: (attrs: Attrs) => void;
  fields: { [name: string]: Field };
  t: TFunction;
  title: string;
}) => {
  const dialogContainer = document.body.appendChild(
    document.createElement('div')
  );
  dialogContainer.className = `${prefix}-dialogContainer`;

  const mouseOutside = (e: MouseEvent) => {
    if (!dialogContainer.contains(e.target as HTMLElement)) close();
  };

  const close = () => {
    window.removeEventListener('mousedown', mouseOutside);
    /* istanbul ignore else */
    if (dialogContainer.parentNode)
      dialogContainer.parentNode.removeChild(dialogContainer);
  };

  setTimeout(() => window.addEventListener('mousedown', mouseOutside), 50);

  const dialogBackdrop = document.createElement('div');
  dialogBackdrop.className = `${prefix}-dialogBackdrop`;
  const dialogId = 'prosemirror-modal';
  const dialogLabelId = `${dialogId}-label`;
  const dialog = document.createElement('div');
  dialog.className = `${prefix}-dialog`;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'dialog');
  dialog.setAttribute('aria-labelledby', dialogLabelId);
  dialog.id = dialogId;

  dialogContainer.appendChild(dialogBackdrop);
  dialogContainer.appendChild(dialog);

  const form = dialog.appendChild(document.createElement('form'));

  /* istanbul ignore else */
  if (options.title) {
    const dialogHeader = document.createElement('div');
    dialogHeader.className = `${prefix}-dialogHeader`;
    const dialogHeaderContent = document.createElement('div');
    dialogHeaderContent.className = `${prefix}-dialogHeaderContent`;
    const dialogTitle = document.createElement('h2');
    dialogTitle.textContent = options.title;
    dialogTitle.className = `${prefix}-dialogTitle`;
    dialogTitle.id = dialogLabelId;

    dialogHeaderContent.appendChild(dialogTitle);
    dialogHeader.appendChild(dialogHeaderContent);
    form.appendChild(dialogHeader);
  }

  const dialogContent = document.createElement('div');
  dialogContent.className = `${prefix}-dialogContent`;

  const domFields: HTMLElement[] = [];

  for (const name in options.fields) {
    const input = options.fields[name].render();

    domFields.push(input);

    dialogContent.appendChild(
      addFormGroup(wrapTextInput(input, options.fields[name].options))
    );
  }
  form.appendChild(dialogContent);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = `${prefix}-button ${prefix}-button--primary`;
  const submitButtonLabel = submitButton.appendChild(
    document.createElement('span')
  );
  submitButtonLabel.className = `${prefix}-button__label`;
  submitButtonLabel.textContent = options.t('common.textEditor.add');

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = `${prefix}-button ${prefix}-button--secondary`;
  const cancelButtonLabel = cancelButton.appendChild(
    document.createElement('span')
  );
  cancelButtonLabel.className = `${prefix}-button__label`;
  cancelButtonLabel.textContent = options.t('common.textEditor.cancel');
  cancelButton.addEventListener('click', close);

  const dialogActionButtons = form.appendChild(document.createElement('div'));
  dialogActionButtons.className = prefix + '-dialogActionButtons';
  dialogActionButtons.appendChild(submitButton);
  dialogActionButtons.appendChild(cancelButton);

  const submit = () => {
    const params = getValues(options.fields, domFields, options.t);
    if (params) {
      close();
      options.callback(params);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });

  form.addEventListener('keydown', (e) => {
    /* istanbul ignore else */
    if (e.key === 'esc') {
      e.preventDefault();
      close();
    } else if (e.key === 'enter' && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault();
      submit();
    } else if (e.key === 'tab') {
      /* istanbul ignore next */
      window.setTimeout(() => {
        if (!dialog.contains(document.activeElement)) close();
      }, 500);
    }
  });

  const input = form.elements[0] as HTMLElement;
  /* istanbul ignore next */
  if (input) input.focus();
};

const addFormGroup = (element: HTMLElement) => {
  const formGroup = document.createElement('div');
  formGroup.className = `${prefix}-formGroup`;

  formGroup.appendChild(element);

  return formGroup;
};

const wrapTextInput = (input: HTMLElement, options: Options) => {
  const id = uniqueId();
  const textInput = document.createElement('div');
  textInput.className = `${prefix}-input`;

  const label = textInput.appendChild(document.createElement('label'));
  label.textContent = options.label;
  label.htmlFor = id;
  label.className = `${prefix}-input__label`;

  const inputWrapper = textInput.appendChild(document.createElement('div'));
  inputWrapper.className = `${prefix}-input__input-wrapper`;

  input.id = id;
  inputWrapper.appendChild(input);

  return textInput;
};

/// A field class for single-line text fields.
export class TextField extends Field {
  render() {
    const input = document.createElement('input');
    input.className = `${prefix}-input__input`;
    input.type = 'text';
    input.value = this.options.value || '';
    input.autocomplete = 'off';

    return input;
  }
}
