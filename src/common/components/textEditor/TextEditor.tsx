/* eslint-disable @typescript-eslint/no-explicit-any */

import '@ckeditor/ckeditor5-build-classic/build/translations/fi';
import '@ckeditor/ckeditor5-build-classic/build/translations/sv';
import './ckeditor.scss';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassNames } from '@emotion/react';
import React, { useEffect, useRef } from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import useLocale from '../../../hooks/useLocale';
import isTestEnv from '../../../utils/isTestEnv';
import InputWrapper, { InputWrapperProps } from '../inputWrapper/InputWrapper';
import styles from './textEditor.module.scss';

export type TextEditorProps = {
  disabled?: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  sanitizeAfterBlur?: (html: string) => string;
  value: string;
} & InputWrapperProps;

const TextEditor: React.FC<TextEditorProps> = ({
  className,
  disabled,
  errorText,
  helperText,
  hideLabel,
  id,
  invalid,
  label,
  onBlur,
  onChange,
  placeholder,
  required,
  sanitizeAfterBlur,
  style,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
  value,
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const editor = useRef<ClassicEditor>();
  const { theme } = useTheme();
  const locale = useLocale();

  const isComponentFocused = useIsComponentFocused(container);

  const wrapperProps = {
    className,
    disabled,
    errorText,
    hasIcon: false,
    helperText,
    hideLabel,
    id,
    invalid,
    label,
    required,
    style,
    tooltipButtonLabel,
    tooltipLabel,
    tooltipText,
  };

  const setFocusToEditor: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (
      event.target instanceof HTMLElement &&
      !editor.current?.sourceElement?.nextSibling?.contains(event.target)
    ) {
      editor.current?.editing?.view?.focus();
    }
  };

  const handleDocumentClickOrFocusin = () => {
    if (!isComponentFocused()) {
      const sanitizedValue = sanitizeAfterBlur
        ? sanitizeAfterBlur(value)
        : value;
      if (sanitizedValue !== value) {
        onChange(sanitizedValue);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClickOrFocusin);
    document.addEventListener('focusin', handleDocumentClickOrFocusin);

    return () => {
      document.removeEventListener('click', handleDocumentClickOrFocusin);
      document.removeEventListener('focusin', handleDocumentClickOrFocusin);
    };
  });

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(
            'text-editor',
            styles.textEditor,
            css(theme.textEditor),
            { invalid: invalid }
          )}
          id={`${id}-text-editor`}
          onClick={setFocusToEditor}
          ref={container}
        >
          <InputWrapper {...wrapperProps} className={styles.inputWrapper}>
            <CKEditor
              key={locale}
              disabled={disabled}
              editor={ClassicEditor}
              config={{
                language: locale,
                placeholder,
                toolbar: {
                  items: [
                    'bold',
                    'italic',
                    'blockQuote',
                    'link',
                    '|',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'undo',
                    'redo',
                  ],
                  shouldNotGroupWhenFull: isTestEnv,
                },
              }}
              data={value}
              onBlur={onBlur}
              onChange={(_, editor) => {
                const data = editor.getData();
                onChange(data);
              }}
              onReady={(instance) => {
                editor.current = instance;
              }}
            />
          </InputWrapper>
        </div>
      )}
    </ClassNames>
  );
};

export default TextEditor;
