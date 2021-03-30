import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import classNames from 'classnames';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { css } from 'emotion';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import InputWrapper, { InputWrapperProps } from '../inputWrapper/InputWrapper';
import styles from './textEditor.module.scss';

const toolbarOptions = {
  options: ['inline', 'blockType', 'list', 'link', 'history'],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline'],
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
  },
  list: {
    inDropdown: false,
    options: ['unordered', 'ordered'],
  },
  link: {
    inDropdown: false,
    showOpenOptionOnHover: false,
    defaultTargetOption: '_blank',
    options: ['link', 'unlink'],
  },
  history: {
    inDropdown: false,
    options: ['undo', 'redo'],
  },
};

export type TextEditorProps = {
  disabled?: boolean;
  label: string;
  onBlur: (event?: React.SyntheticEvent<{}>) => void;
  onChange: (value: string) => void;
  placeholder?: string;
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
  labelText,
  onBlur,
  onChange,
  required,
  style,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
  value,
  ...rest
}) => {
  const editorRef = React.useRef<Editor>(null);
  const [focused, setFocused] = React.useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();

  const blocksFromHtml = htmlToDraft(value);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(contentState)
  );

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    if (editorState.getCurrentContent().getPlainText()) {
      onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    } else {
      onChange('');
    }
  };

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
    labelText,
    required,
    style,
    tooltipLabel,
    tooltipText,
    tooltipButtonLabel,
  };

  const setFocusToEditor = () => {
    editorRef.current?.focusEditor();
  };

  return (
    <div
      className={classNames(
        styles.textEditor,
        { [styles.invalid]: invalid },
        css(theme.textEditor)
      )}
      id={`${id}-text-editor`}
      onClick={setFocusToEditor}
    >
      <InputWrapper {...wrapperProps} className={styles.inputWrapper}>
        <Editor
          ref={editorRef}
          {...rest}
          ariaLabel={label}
          editorState={editorState}
          onBlur={(ev: React.SyntheticEvent<{}>) => {
            onBlur(ev);
            setFocused(false);
          }}
          onFocus={() => setFocused(true)}
          editorClassName={classNames(styles.editor, {
            [styles.focused]: focused,
          })}
          toolbarClassName={styles.toolbar}
          wrapperClassName={styles.wrapper}
          onEditorStateChange={onEditorStateChange}
          readOnly={disabled}
          localization={{
            translations: {
              // Generic
              'generic.add': t('common.textEditor.add'),
              'generic.cancel': t('common.textEditor.cancel'),
              // BlockType
              'components.controls.blocktype.h1': t(
                'common.textEditor.blocktype.h1'
              ),
              'components.controls.blocktype.h2': t(
                'common.textEditor.blocktype.h2'
              ),
              'components.controls.blocktype.h3': t(
                'common.textEditor.blocktype.h3'
              ),
              'components.controls.blocktype.h4': t(
                'common.textEditor.blocktype.h4'
              ),
              'components.controls.blocktype.h5': t(
                'common.textEditor.blocktype.h5'
              ),
              'components.controls.blocktype.h6': t(
                'common.textEditor.blocktype.h6'
              ),
              'components.controls.blocktype.blocktype': t(
                'common.textEditor.blocktype.blocktype'
              ),
              'components.controls.blocktype.normal': t(
                'common.textEditor.blocktype.normal'
              ),
              // History
              'components.controls.history.history': t(
                'common.textEditor.history.history'
              ),
              'components.controls.history.undo': t(
                'common.textEditor.history.undo'
              ),
              'components.controls.history.redo': t(
                'common.textEditor.history.redo'
              ),
              // Inline
              'components.controls.inline.bold': t(
                'common.textEditor.inline.bold'
              ),
              'components.controls.inline.italic': t(
                'common.textEditor.inline.italic'
              ),
              'components.controls.inline.underline': t(
                'common.textEditor.inline.underline'
              ),
              // Link
              'components.controls.link.linkTitle': t(
                'common.textEditor.link.linkTitle'
              ),
              'components.controls.link.linkTarget': t(
                'common.textEditor.link.linkTarget'
              ),
              'components.controls.link.linkTargetOption': t(
                'common.textEditor.link.linkTargetOption'
              ),
              'components.controls.link.link': t('common.textEditor.link.link'),
              'components.controls.link.unlink': t(
                'common.textEditor.link.unlink'
              ),
              // List
              'components.controls.list.list': t('common.textEditor.list.list'),
              'components.controls.list.unordered': t(
                'common.textEditor.list.unordered'
              ),
              'components.controls.list.ordered': t(
                'common.textEditor.list.ordered'
              ),
            },
          }}
          toolbar={toolbarOptions}
        />
      </InputWrapper>
    </div>
  );
};

export default TextEditor;
