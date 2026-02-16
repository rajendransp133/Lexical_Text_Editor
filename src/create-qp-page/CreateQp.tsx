import React from "react";

import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

import { PiNotepadBold } from "react-icons/pi";
import { BsFillInboxesFill } from "react-icons/bs";

// Lexical imports
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// Lexical nodes
import {
  ParagraphNode,
  TextNode,
  $getRoot,
  $isTextNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type DOMExportOutputMap,
  isHTMLElement,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
} from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { ImageNode } from "../nodes/ImageNode";
import { EquationNode } from "../nodes/EquationNode";

// Lexical plugins
import ToolbarPlugin from "../Plugins/ToolbarPlugin";
import ImagesPlugin from "../Plugins/ImagePlugin";
import EquationsPlugin from "../Plugins/EquationPlugin";

// Theme
import ExampleTheme from "../ExampleTheme";

import {
  questions as defaultQuestions,
  section as defaultSection,
  type ConfigQuestion,
  type ConfigSection,
} from "./configCreateQP";

import { Panel } from "./Panel";
import Navbar from "./NavBar";
import { parseAllowedColor, parseAllowedFontSize } from "../styleConfig";

// Helper functions for DOM export/import (copied from App.tsx)
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

// Editor configuration
const createEditorConfig = (namespace: string) => ({
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace,
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
    console.error(error);
  },
  theme: ExampleTheme,
});

// Reusable Editor Component
interface RichTextEditorProps {
  placeholder: string;
  variant: "question" | "option" | "nat" | "submit";
  onChange?: (value: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  tabIndex?: number;
}

export interface RichTextEditorHandle {
  focus: () => void;
}

const RichTextEditor = React.memo(
  forwardRef<RichTextEditorHandle, RichTextEditorProps>(
    (
      { placeholder, variant, onChange, onBlur, autoFocus = false, tabIndex },
      ref
    ) => {
      const editorConfig = createEditorConfig(`CreateQP-${variant}`);

      const editorRef = useRef<any>(null);

      const containerClass = `editor-container-${variant}`;
      const innerClass = `editor-inner-${variant}`;
      const inputClass = `editor-input-${variant}`;
      const placeholderClass = `editor-placeholder-${variant}`;

      // Expose focus method to parent component
      useImperativeHandle(ref, () => ({
        focus: () => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        },
      }));

      // Component to handle content changes
      const OnChangePlugin = React.memo(
        ({ onChange }: { onChange: (value: string) => void }) => {
          const [editor] = useLexicalComposerContext();

          React.useEffect(() => {
            return editor.registerUpdateListener(({ editorState }) => {
              editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                onChange(textContent);
              });
            });
          }, [editor, onChange]);

          return null;
        }
      );

      // Component to handle focus
      const FocusPlugin = React.memo(() => {
        const [editor] = useLexicalComposerContext();

        React.useEffect(() => {
          if (editorRef.current) {
            editorRef.current = editor.getRootElement();
          }
        }, [editor]);

        return null;
      });

      return (
        <LexicalComposer initialConfig={editorConfig}>
          <div className={containerClass}>
            {(variant === "question" ||
              variant === "submit" ||
              variant === "option") && <ToolbarPlugin />}
            <div className={innerClass}>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={inputClass}
                    aria-placeholder={placeholder}
                    placeholder={
                      <div className={placeholderClass}>{placeholder}</div>
                    }
                    onBlur={onBlur}
                    tabIndex={tabIndex}
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              {autoFocus && <AutoFocusPlugin />}
              <ListPlugin />
              {(variant === "question" ||
                variant === "submit" ||
                variant === "option") && (
                <>
                  <ImagesPlugin />
                  <EquationsPlugin />
                </>
              )}
              {onChange && <OnChangePlugin onChange={onChange} />}
              <FocusPlugin />
            </div>
          </div>
        </LexicalComposer>
      );
    }
  )
);

function CreateQpPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sectionNavigation, setSectionNavigation] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [, setInstructionOpen] = useState(true);

  // Store question text inputs for each question index
  const [questionTexts, setQuestionTexts] = useState<{ [key: number]: string }>(
    {}
  );

  // Store solution text for each question
  const [solutionTexts, setSolutionTexts] = useState<{ [key: number]: string }>(
    {}
  );
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [newQuestionAnswer, setNewQuestionAnswer] = useState<number | number[]>(
    []
  );
  const [, setNewQuestionNatValues] = useState({
    start: 0,
    end: 100,
    precision: 0,
  });

  const questionsData: ConfigQuestion[] = defaultQuestions();
  const sectionData: ConfigSection = defaultSection();

  const currentQuestion: ConfigQuestion = questionsData[currentIndex];

  // All questions are now editable, no preset data needed

  const handleNext = () => {
    if (currentIndex < questionsData.length - 1)
      setCurrentIndex((prev) => prev + 1);
    else console.log("preview");
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLeft = () => {
    setCurrentSection((prev) =>
      prev === 0 ? sectionData.sectionName.length - 1 : prev - 1
    );
  };

  const handleRight = () => {
    setCurrentSection((prev) =>
      prev === sectionData.sectionName.length - 1 ? 0 : prev + 1
    );
  };

  const handleCancelCreate = () => {
    setQuestionTexts((prev) => ({ ...prev, [currentIndex]: "" }));
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionAnswer([]);
    setNewQuestionNatValues({ start: 0, end: 100, precision: 0 });
  };

  const handleSaveNewQuestion = () => {
    // Save the current question text to persistent storage
    const currentText = questionTexts[currentIndex] || "";
    if (currentText.trim()) {
      setQuestionTexts((prev) => ({
        ...prev,
        [currentIndex]: currentText.trim(),
      }));
    }
    // Clear the editing state
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionAnswer([]);
    setNewQuestionNatValues({ start: 0, end: 100, precision: 0 });
  };

  // Removed unused handleSaveQuestion function

  // Memoized onChange handlers to prevent recreation on every render
  const handleQuestionTextChange = useCallback(
    (value: string) => {
      setQuestionTexts((prev) => ({
        ...prev,
        [currentIndex]: value,
      }));
    },
    [currentIndex]
  );

  const handleOptionChange = useCallback(
    (index: number) => (value: string) => {
      setNewQuestionOptions((prev) => {
        const newOptions = [...prev];
        newOptions[index] = value;
        return newOptions;
      });
    },
    []
  );

  const handleSolutionTextChange = useCallback(
    (value: string) => {
      setSolutionTexts((prev) => ({
        ...prev,
        [currentIndex]: value,
      }));
    },
    [currentIndex]
  );

  const handleNatStartChange = useCallback((value: string) => {
    setNewQuestionNatValues((prev) => ({
      ...prev,
      start: Number(value) || 0,
    }));
  }, []);

  const handleNatEndChange = useCallback((value: string) => {
    setNewQuestionNatValues((prev) => ({
      ...prev,
      end: Number(value) || 0,
    }));
  }, []);

  const handleNatPrecisionChange = useCallback((value: string) => {
    setNewQuestionNatValues((prev) => ({
      ...prev,
      precision: Number(value) || 0,
    }));
  }, []);

  return (
    <main className="flex h-screen flex-col gap-6 bg-[#EFF0F5]">
      <nav>
        <Navbar />
      </nav>
      <article className="mx-7.5 flex flex-1 flex-col justify-between gap-15 rounded-4xl bg-white p-6">
        <div className="flex flex-col gap-15">
          <header className="flex items-center justify-between">
            <section className="flex text-2xl font-semibold text-[#0E2023]">
              <span>QP |&nbsp;</span>
              <span>JEE Mains Paper 01</span>
            </section>
            <section className="flex items-center gap-4">
              <span className="text-lg font-normal text-[#8C8C8C]">
                Progress
              </span>
              <div className="h-2 w-[26.25rem] rounded-4xl bg-[#EFF0F5]">
                <div
                  className="h-full rounded-4xl bg-[#1FB67C]"
                  style={{
                    width: `${
                      ((currentIndex + 1) / questionsData.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </section>
            <nav className="flex gap-4 text-2xl font-normal">
              <button
                className="rounded-full border border-[#0E2023] p-4.5 text-[#0E2023] hover:cursor-pointer disabled:opacity-40"
                onClick={() => setSectionNavigation(!sectionNavigation)}
              >
                <BsFillInboxesFill size={30} />
              </button>

              <button
                className="rounded-4xl border border-[#0E2023] px-9 py-4.5 text-[#0E2023] hover:cursor-pointer disabled:opacity-40"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                ← Back
              </button>
              <button
                className="rounded-4xl bg-[#263EAC] px-9 py-4.5 text-[#EFF0F5] hover:cursor-pointer disabled:opacity-40"
                onClick={handleNext}
              >
                {currentIndex === questionsData.length - 1
                  ? "Preview & Sign-Off →"
                  : "Next Question →"}
              </button>
            </nav>
          </header>

          {sectionNavigation && (
            <Panel
              sectionData={sectionData}
              currentSection={currentSection}
              handleLeft={handleLeft}
              handleRight={handleRight}
              questionsData={questionsData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              setSectionNavigation={setSectionNavigation}
            />
          )}

          <section className="flex items-center justify-between text-2xl font-semibold text-[#0E2023]">
            <article className="flex basis-4/5 flex-col gap-2">
              <header className="font-normal text-[#8C8C8C]">
                {currentQuestion.sectionName} | Question Number{" "}
                {currentQuestion.questionNo}
              </header>
              <section>
                <RichTextEditor
                  variant="question"
                  placeholder="Enter your question here..."
                  onChange={handleQuestionTextChange}
                  autoFocus
                  tabIndex={1}
                />
              </section>
            </article>
            <aside className="flex basis-1/5 justify-end gap-15">
              <section className="flex flex-col gap-2">
                <header className="font-normal text-[#8C8C8C]">Marks</header>
                <div className="text-base">
                  <span className="rounded-4xl bg-[#91FFD5] p-2 text-[#093E29]">
                    {currentQuestion.positive}
                  </span>
                  <span>&nbsp;|&nbsp;</span>
                  <span className="rounded-4xl bg-[#FFEDED] p-2 text-[#642929]">
                    {currentQuestion.negative}
                  </span>
                </div>
              </section>
              <section className="flex flex-col gap-2">
                <header className="justify-between font-normal text-ternary-gray-dark">
                  Question Type
                </header>
                <div className="flex items-center">
                  <label htmlFor="type">
                    {currentQuestion.type.toUpperCase()}
                  </label>
                </div>
              </section>
            </aside>
          </section>

          <section>
            {currentQuestion.type === "mcq" && (
              <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
                {newQuestionOptions.map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
                      <input
                        type="radio"
                        name="new-mcq-option"
                        checked={newQuestionAnswer === index}
                        onChange={() => setNewQuestionAnswer(index)}
                      />
                      <div className="flex-1">
                        <RichTextEditor
                          variant="option"
                          placeholder={`Option ${index + 1}`}
                          onChange={handleOptionChange(index)}
                          tabIndex={10 + index}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {currentQuestion.type === "msq" && (
              <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
                {newQuestionOptions.map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(newQuestionAnswer) &&
                          newQuestionAnswer.includes(index)
                        }
                        onChange={() => {
                          if (Array.isArray(newQuestionAnswer)) {
                            if (newQuestionAnswer.includes(index)) {
                              setNewQuestionAnswer(
                                newQuestionAnswer.filter((i) => i !== index)
                              );
                            } else {
                              setNewQuestionAnswer([
                                ...newQuestionAnswer,
                                index,
                              ]);
                            }
                          }
                        }}
                      />
                      <div className="flex-1">
                        <RichTextEditor
                          variant="option"
                          placeholder={`Option ${index + 1}`}
                          onChange={handleOptionChange(index)}
                          tabIndex={20 + index}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {currentQuestion.type === "nat" && (
              <div className="flex flex-col gap-4 text-2xl font-normal">
                <div className="py-4 flex items-center gap-2">
                  <span>Number Between </span>
                  <RichTextEditor
                    variant="nat"
                    placeholder="From"
                    onChange={handleNatStartChange}
                    tabIndex={30}
                  />
                  <span> and </span>
                  <RichTextEditor
                    variant="nat"
                    placeholder="To"
                    onChange={handleNatEndChange}
                    tabIndex={31}
                  />
                </div>
                <div className="py-4 flex items-center gap-2">
                  <span>No of floating point digit:</span>
                  <RichTextEditor
                    variant="nat"
                    placeholder="e.g. 2"
                    onChange={handleNatPrecisionChange}
                    tabIndex={32}
                  />
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="rounded-4xl border border-[#0E2023] px-9 py-4.5 text-[#0E2023] hover:cursor-pointer"
                onClick={handleCancelCreate}
              >
                Cancel
              </button>
              <button
                className="rounded-4xl bg-[#1FB67C] px-9 py-4.5 text-[#EFF0F5] hover:cursor-pointer"
                onClick={handleSaveNewQuestion}
                disabled={!(questionTexts[currentIndex] || "").trim()}
              >
                Save Question
              </button>
            </div>
          </section>

          <footer className="flex flex-col gap-4">
            {/* Solution Input Section */}
            <section className="w-full">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#0E2023] mb-2">
                  Submit Your Solution
                </h3>
                <RichTextEditor
                  variant="submit"
                  placeholder="Write your solution here..."
                  onChange={handleSolutionTextChange}
                  tabIndex={40}
                />
              </div>
            </section>

            <nav className="flex items-center justify-end gap-4 text-2xl font-normal">
              {/* <div className="flex items-center justify-center gap-2">
              <FaKeyboard />
              <p>↓</p>
            </div> */}
              <button
                className="cursor-pointer rounded-4xl border border-secondary-black px-9 py-4.5"
                disabled={!(solutionTexts[currentIndex] || "").trim()}
              >
                Submit Solution
              </button>

              <button
                className="flex h-15 w-15 items-center justify-center rounded-4xl bg-[#263EAC] p-4 text-[#EFF0F5] hover:cursor-pointer disabled:opacity-40"
                onClick={() => setInstructionOpen(true)}
              >
                <PiNotepadBold size={30} />
              </button>
            </nav>
          </footer>
        </div>
      </article>
    </main>
  );
}

export default CreateQpPage;
