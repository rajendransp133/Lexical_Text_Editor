import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isTextNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type DOMExportOutputMap,
  isHTMLElement,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import "./App.css";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./Plugins/ToolbarPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode } from "@lexical/list";
import { ListItemNode } from "@lexical/list";
import { QuoteNode } from "@lexical/rich-text";
import { ImageNode } from "./nodes/ImageNode";
import ImagesPlugin from "./Plugins/ImagePlugin";
import { EquationNode } from "./nodes/EquationNode";
import EquationsPlugin from "./Plugins/EquationPlugin";
import CreateQP from "./create-qp-page/CreateQp";
import { useState, useEffect } from "react";
import type React from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

const placeholder = "Enter some rich text...";

function SubmitButton({
  variant = "submit",
  onClick,
  children,
  onContentUpdate,
}: {
  variant?: "submit" | "next";
  onClick?: () => void;
  children?: React.ReactNode;
  onContentUpdate?: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleSubmit = () => {
    editor.read(() => {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();

      console.log("📄 Serialized JSON:", JSON.stringify(json, null, 2));

      // Generate HTML from the editor content
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (onContentUpdate) {
        onContentUpdate(htmlString);
      }
    });
  };

  const handleClick = () => {
    if (variant === "submit") {
      handleSubmit();
    } else if (onClick) {
      onClick();
    }
  };

  const buttonText = children || (variant === "submit" ? "Submit" : "Next");
  const buttonClass =
    variant === "submit"
      ? "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4 transition-colors"
      : "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-4 transition-colors";

  return (
    <button className={buttonClass} onClick={handleClick}>
      {buttonText}
    </button>
  );
}

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll("[style],[class]"),
    ]) {
      // Preserve text-align style before removing all styles
      const textAlign = (el as HTMLElement).style.textAlign;
      el.removeAttribute("class");
      el.removeAttribute("style");
      // Restore text-align if it was present
      if (textAlign) {
        (el as HTMLElement).style.textAlign = textAlign;
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  const textAlign = element.style.textAlign;

  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  if (textAlign && textAlign !== "start" && textAlign !== "left") {
    extraStyles += `text-align: ${textAlign};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "React.js Demo",
  nodes: [
    ParagraphNode,
    TextNode,
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    ImageNode,
    EquationNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

const showboxConfig = {
  ...editorConfig,
  namespace: "React.js Demo - Showbox",
  editable: false,
};

function ContentPopulatorPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear();
        $insertNodes(nodes);
      });
    }
  }, [content, editor]);

  return null;
}

// ShowboxComposer component - read-only display
function ShowboxComposer({ content }: { content: string }) {
  const showboxPlaceholder = "Content will appear here after submission...";

  return (
    <div className="editor-shell mt-8">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-700">Preview:</h3>
      </div>
      <LexicalComposer initialConfig={showboxConfig}>
        <div className="editor-container opacity-80">
          <div className="editor-inner bg-gray-50">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input cursor-default pointer-events-none"
                  aria-placeholder={showboxPlaceholder}
                  placeholder={
                    <div className="editor-placeholder">
                      {showboxPlaceholder}
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ContentPopulatorPlugin content={content} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}

function App() {
  const [nextpage, setNextpage] = useState(false);
  const [showboxContent, setShowboxContent] = useState<string>("");

  const handleContentUpdate = (htmlContent: string) => {
    setShowboxContent(htmlContent);
  };

  return (
    <>
      {nextpage ? (
        <CreateQP />
      ) : (
        <div className="max-w-4xl mx-auto px-8 my-16 ">
          <h1>React.js Rich Text Lexical Example</h1>
          <div className="editor-shell">
            <LexicalComposer initialConfig={editorConfig}>
              <div className="editor-container ">
                <ToolbarPlugin />
                <div className="editor-inner">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="editor-input"
                        aria-placeholder={placeholder}
                        placeholder={
                          <div className="editor-placeholder">
                            {placeholder}
                          </div>
                        }
                      />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <ListPlugin />
                  <ImagesPlugin />
                  <EquationsPlugin />
                </div>
              </div>
              <SubmitButton onContentUpdate={handleContentUpdate} />
              <SubmitButton
                variant="next"
                onClick={() => {
                  setNextpage(true);
                }}
              >
                Next
              </SubmitButton>
            </LexicalComposer>
            <ShowboxComposer content={showboxContent} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
