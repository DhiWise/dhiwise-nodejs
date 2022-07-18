/* eslint-disable no-nested-ternary */
import React from 'react';
import { Icons } from '@dhiwise/icons';
import Editor from '@monaco-editor/react';
import { isEmpty } from 'lodash';
import { useBoolean } from '../hooks';
import { Error } from '../Error';
import { EXTENSION_TYPE } from '../../constant/fileTypeConstant';

let monacoJSXHighlighter = null;
export const CodeEditor = React.memo(({
  value = '',
  readOnly = false,
  onChange = () => { },
  onValidate = () => { },
  isShowError = false, // For showing Error
  language = 'json',
  style = {},
  height = '100%',
  width,
  defaultValue = '{}',
  className,
  onBlur,
  repairedJson,
  setRepairedJson,
  imageShow = false,
  imageSource = false,
  fileType = EXTENSION_TYPE.TEXT,
  loading,
  scrollbar,
}) => {
  const [isError, setShowError, setHideError] = useBoolean(false);
  const [jsonError, setJsonError] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [internalValue, setInternalValue] = React.useState();

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  React.useEffect(() => {
    if (repairedJson && repairedJson !== '{}') {
      setInternalValue(repairedJson);
      setRepairedJson?.('{}');
    }
  }, [repairedJson]);

  async function handleEditorDidMount(monacoEditor, monaco) {
    // monaco-jsx-highlighter depends on these (and monaco)
    const { default: traverse } = await import('@babel/traverse');
    const { parse } = await import('@babel/parser');
    // The star of the show =P
    const { default: MonacoJSXHighlighter, JSXTypes } = await import(
      'monaco-jsx-highlighter'
    );
    // Customize Babel directly
    const babelParse = (code) => parse(code, { sourceType: 'module', plugins: ['jsx'] });
    // Instantiate the highlighter
    monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      babelParse,
      traverse,
      monacoEditor,
    );
    // Start the JSX highlighting and get the dispose function
    monacoJSXHighlighter.highLightOnDidChangeModelContent();
    // Enhance monaco's editor.action.commentLine with JSX commenting and get its disposer
    monacoJSXHighlighter.addJSXCommentCommand();
    // You are all set.

    // Optional: customize the color font in JSX texts (style class JSXElement.JSXText.tastyPizza from ./index.css)
    JSXTypes.JSXText.options.inlineClassName = 'JSXElement.JSXText.tastyPizza';

    // More of this example's boilerplate
    monacoJSXHighlighter.highLightOnDidChangeModelContent();
    monacoJSXHighlighter.addJSXCommentCommand();
  }

  return (
    <div
      onBlur={onBlur}
      className={`overflow-hidden relative h-full ${imageShow && 'flex items-center justify-center p-4'} ${className} ${readOnly ? 'readonlyEditor' : ''}`}
      onKeyDown={(e) => {
        // to stop copy paste
        if (readOnly) { e.preventDefault(); }
      }}
      style={style}
    >
      {(imageShow && imageSource && fileType === EXTENSION_TYPE.IMAGE)
        ? <div className="editorImage"><img src={imageSource} alt="" /></div>
        : fileType === EXTENSION_TYPE.DEFAULT
          ? (
            <div className="flex justify-center items-center h-full">
              <div className="p-3 text-lg xxl:text-xl w-7/12 xxl:w-5/12 text-center">
                <div className="w-24 h-24 xxl:w-28 xxl:h-28 m-auto mb-3 xxl:mb-10">
                  <Icons.NotSupportPreview />
                </div>
                The file is not displayed in the editor because it is either binary or uses an unsupported text encoding.
              </div>
            </div>
          )
          : (
            <Editor
              height={height}
              width={width}
              language={language}
              defaultValue={defaultValue}
              theme="vs-dark"
              lineNumbers={false}
              glyphMargin={false}
              folding={false}
              onChange={isShowError ? (changeCode) => {
                try {
                  setJsonError(false);
                  setHideError();
                  setInternalValue(changeCode);
                  onChange(changeCode);
                } catch (error) {
                  // To catch on Change error line by line
                  setShowError();
                  setJsonError(error);
                }
              } : (changeCode) => {
                setInternalValue(changeCode);
                onChange(changeCode);
              }}
              options={{ readOnly, contextmenu: !readOnly, scrollbar }}
              value={internalValue}
              onValidate={isShowError ? (errors) => {
                if (isEmpty(errors)) {
                  // errors contains array of error objects message
                  setHideError();
                  setJsonError(false);
                }
              } : onValidate}
              // eslint-disable-next-line react/jsx-no-bind
              onMount={handleEditorDidMount}
              loading={loading}
            />
          )}
      {
        isShowError && isError
          ? <Error isOpen={isError} error={jsonError} handleCancel={setHideError} /> : null
      }
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
