/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createHTMLTransformer } from '@aeaton/prosemirror-transformers';
import {
  Editor,
  HtmlEditor,
  Toolbar,
  useEditorState,
  useEditorView,
} from '@aeaton/react-prosemirror';
import { ClassNames } from '@emotion/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
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
  isFocused?: boolean;
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
  isFocused,
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
      /* istanbul ignore next */
      const sanitizedValue = sanitizeAfterChange
        ? sanitizeAfterChange(value)
        : value;

      if (sanitizedValue !== value) {
        const tr = editorState.tr;
        const newDoc = htmlTransformer.parse(sanitizedValue || initialValue);

        tr.replaceWith(0, editorState.doc.content.size, newDoc.content);
        const newState = editorState.apply(tr);

        view.updateState(newState);
        onChange(sanitizedValue);
      }
    },
    [editorState, htmlTransformer, onChange, sanitizeAfterChange, view]
  );

  React.useEffect(() => {
    if (!isFocused) {
      const newDoc = htmlTransformer.parse(value || initialValue);

      /* istanbul ignore next */
      if (view.state.doc.toString() !== newDoc.toString()) {
        const tr = editorState.tr;

        tr.replaceWith(0, editorState.doc.content.size, newDoc.content);
        const newState = editorState.apply(tr);

        view.updateState(newState);
        onChange(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    view.setProps({ editable: () => !disabled });
  }, [disabled, view]);

  React.useEffect(() => {
    // Editor component doens't support aria label so set it manually here
    const editor = document.querySelector('[contenteditable=true]');
    /* istanbul ignore else */
    if (editor) {
      editor.ariaLabel = label;
      editor.setAttribute('title', label);
      editor.setAttribute('role', 'textbox');
    }
  }, [label]);

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          ref={containerRef}
          className={cx(
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
            <Toolbar toolbar={generateToolbar(disabled, t)} />
            <div className={cx(styles.editor, { [styles.focused]: focused })}>
              <Editor />
            </div>
          </InputWrapper>
        </div>
      )}
    </ClassNames>
  );
};

const TextEditorContainer: React.FC<TextEditorProps> = ({
  onChange,
  placeholderKey,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);

  const isComponentFocused = useIsComponentFocused(container);

  const handleChange = React.useCallback((val: string) => {
    const newValue = val === initialValue ? '' : val;

    onChange(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorChange = React.useCallback((val: string) => {
    if (isComponentFocused()) {
      handleChange(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={container}>
      {/* @ts-ignore */}
      <HtmlEditor
        schema={schema}
        plugins={[...plugins, placeholderPlugin(t, placeholderKey)]}
        value={value || initialValue}
        handleChange={handleEditorChange}
      >
        <TextEditor
          {...rest}
          isFocused={isComponentFocused()}
          onChange={handleChange}
          value={value}
        />
      </HtmlEditor>
    </div>
  );
};

export default TextEditorContainer;
