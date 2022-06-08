/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createHTMLTransformer } from '@aeaton/prosemirror-transformers';
import {
  Editor,
  HtmlEditor,
  Toolbar,
  useEditorState,
  useEditorView,
} from '@aeaton/react-prosemirror';
import { css } from '@emotion/css';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import useSetFocused from '../../../hooks/useSetFocused';
import InputWrapper, { InputWrapperProps } from '../inputWrapper/InputWrapper';
import plugins from './config/plugins';
import schema from './config/schema';
import { generateToolbar } from './config/toolbar';
import placeholderPlugin from './plugins/placeholder/placeholder';
import styles from './textEditor.module.scss';

const initialValue = '<p></p>';

export type TextEditorProps = {
  disabled?: boolean;
  label: string;
  onBlur: (event?: React.SyntheticEvent) => void;
  onChange: (value: string) => void;
  placeholderKey?: string;
  sanitizeAfterChange?: (html: string) => string;
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
  placeholderKey = '',
  required,
  sanitizeAfterChange,
  style,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
  value,
  ...rest
}) => {
  const htmlTransformer = useState(function () {
    return createHTMLTransformer(schema);
  })[0];
  const { t } = useTranslation();
  const view = useEditorView();
  const editorState = useEditorState();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { focused } = useSetFocused(containerRef);

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
    tooltipLabel,
    tooltipText,
    tooltipButtonLabel,
    ...rest,
  };

  const setFocusToEditor = () => {
    view.focus();
  };

  const handleChange = React.useCallback(
    (value: string) => {
      if (
        !containerRef.current?.contains(document.activeElement) &&
        sanitizeAfterChange
      ) {
        const sanitizedValue = sanitizeAfterChange(value);

        if (sanitizedValue !== value) {
          const tr = editorState.tr;
          const newDoc = htmlTransformer.parse(sanitizedValue);

          tr.replaceWith(0, editorState.doc.content.size, newDoc.content);
          const newState = editorState.apply(tr);

          view.updateState(newState);
          onChange && onChange(sanitizeAfterChange(value));
        }
      }
    },
    [editorState, htmlTransformer, onChange, sanitizeAfterChange, view]
  );

  React.useEffect(() => {
    // Editor component doens't support aria label so set it manually here
    const editor = document.querySelector('[contenteditable=true]');
    if (editor) {
      editor.ariaLabel = label;
      editor.setAttribute('title', label);
      editor.setAttribute('role', 'textbox');
    }
  }, [label]);

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.textEditor,
        { [styles.invalid]: invalid },
        css(theme.textEditor)
      )}
      id={`${id}-text-editor`}
      onClick={setFocusToEditor}
      onBlur={(ev: React.SyntheticEvent) => {
        onBlur && onBlur(ev);
        handleChange(value as string);
      }}
    >
      <InputWrapper {...wrapperProps} className={styles.inputWrapper}>
        {/* @ts-ignore */}
        <Toolbar toolbar={generateToolbar(t)} />
        <div
          className={classNames(styles.editor, {
            [styles.focused]: focused,
          })}
        >
          <Editor />
        </div>
      </InputWrapper>
    </div>
  );
};

const TextEditorContainer: React.FC<TextEditorProps> = ({
  onChange,
  placeholderKey = '',
  value,
  ...rest
}) => {
  const { t } = useTranslation();

  const handleChange = React.useCallback((val: string) => {
    const newValue = val === initialValue ? '' : val;
    if (newValue !== value) {
      onChange(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // @ts-ignore
    <HtmlEditor
      schema={schema}
      plugins={[...plugins, placeholderPlugin(placeholderKey, t)]}
      value={value || initialValue}
      handleChange={handleChange}
      // debounce={250}
    >
      <TextEditor {...rest} onChange={handleChange} value={value} />
    </HtmlEditor>
  );
};

export default TextEditorContainer;
