/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@ckeditor/ckeditor5-react' {
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import { EditorConfig } from '@ckeditor/ckeditor5-core';

  interface CKEditorProps {
    config: EditorConfig;
    data: string;
    disabled?: boolean;
    editor: typeof ClassicEditor;
    onBlur: () => void;
    onChange: (event: any, editor: ClassicEditor) => void;
    onReady: (editor: ClassicEditor) => void;
  }

  function CKEditor(props: CKEditorProps): JSX.Element;

  export { CKEditor };
}
