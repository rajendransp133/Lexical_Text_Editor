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
  $getRoot,
} from "lexical";
// Note: You may need to install @lexical/html with: npm install @lexical/html
// import { $generateHtmlFromNodes } from "@lexical/html";

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

const placeholder = "Enter some rich text...";

// Submit handler component to access editor context
function SubmitButton() {
  const [editor] = useLexicalComposerContext();

  const handleSubmit = () => {
    editor.read(() => {
      // Get the root node
      const root = $getRoot();

      // Get the editor state as JSON
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();

      // Get plain text content
      const plainText = root.getTextContent();

      // Try to get HTML representation (basic approach without @lexical/html)
      let htmlContent = "";
      try {
        // Get the root element of the editor
        const rootElement = editor.getRootElement();
        if (rootElement) {
          htmlContent = rootElement.innerHTML;
        }
      } catch (error) {
        console.warn("Could not extract HTML content:", error);
      }

      // Log different formats of the content
      console.group("🚀 Rich Text Editor Content:");
      console.log("📝 Plain text:", plainText);
      console.log("🌐 HTML content:", htmlContent);
      console.log("📋 JSON representation:", json);
      console.log("📄 Serialized JSON:", JSON.stringify(json, null, 2));
      console.groupEnd();

      // Also show alert for immediate feedback
      alert(
        `Content submitted! Check console for details.\n\nPlain text: ${plainText.slice(
          0,
          100
        )}${plainText.length > 100 ? "..." : ""}`
      );
    });
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4 transition-colors"
      onClick={handleSubmit}
    >
      Submit
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
      el.removeAttribute("class");
      el.removeAttribute("style");
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
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
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

function App() {
  return (
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
                      <div className="editor-placeholder">{placeholder}</div>
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
          <SubmitButton />
        </LexicalComposer>
      </div>
    </div>
  );
}

export default App;
